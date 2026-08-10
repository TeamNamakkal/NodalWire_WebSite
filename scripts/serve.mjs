import { createServer } from 'http';
import { readFile, writeFile } from 'fs/promises';
import { existsSync, readFileSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';
import { calculatePayslip } from './lib/payroll-tax.mjs';

const __dirname = fileURLToPath(new URL('..', import.meta.url));

// Minimal .env loader (no external dependency, no CLI flag required).
// Does not override variables already set in the real environment.
function loadEnvFile() {
  const envPath = join(__dirname, '.env');
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvFile();

const PORT = process.env.PORT || 3000;
const DB_PATH = join(__dirname, 'data/worklogs.json');
const EMPLOYEES_PATH = join(__dirname, 'data/employees.json');
const TIMESHEETS_PATH = join(__dirname, 'data/timesheets.json');
const PAYSLIPS_PATH = join(__dirname, 'data/payslips.json');
const TICKETS_PATH = join(__dirname, 'data/tickets.json');

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

let cachedTransporter = null;
async function getMailTransporter() {
  if (cachedTransporter) return cachedTransporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  const { default: nodemailer } = await import('nodemailer');
  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return cachedTransporter;
}

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function loadEmployees() {
  return JSON.parse(await readFile(EMPLOYEES_PATH, 'utf8') || '[]');
}

async function saveEmployees(employees) {
  await writeFile(EMPLOYEES_PATH, JSON.stringify(employees, null, 2), 'utf8');
}

async function findEmployeeByUsername(username) {
  if (!username) return null;
  const employees = await loadEmployees();
  return employees.find(e => e.username === username) || null;
}

async function findEmployeeById(id) {
  if (!id) return null;
  const employees = await loadEmployees();
  return employees.find(e => e.id === id) || null;
}

const PUBLIC_EMPLOYEE_FIELDS = [
  'id', 'fullName', 'title', 'department', 'company',
  'reportingManager', 'joinedDate', 'workLocation', 'status', 'photo'
];

function toPublicEmployee(emp) {
  const out = {};
  for (const field of PUBLIC_EMPLOYEE_FIELDS) out[field] = emp[field];
  return out;
}

// Helper to parse bodies
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

const GA4_TAG = `  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-TCXCP971BF"><\/script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-TCXCP971BF');
  <\/script>`;

function injectGA4(html) {
  if (!html.includes('G-TCXCP971BF')) {
    return html.replace('<head>', `<head>\n${GA4_TAG}\n`);
  }
  return html;
}

function fmtCurrency(n) {
  return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderPayslipHtml(p) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Payslip - ${p.employeeName} - ${p.payPeriodStart} to ${p.payPeriodEnd}</title>
<style>
  body { font-family: 'Inter', Arial, sans-serif; color: #1a1a1a; max-width: 720px; margin: 40px auto; padding: 0 20px; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  .sub { color: #555; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #ddd; font-size: 14px; }
  th { background: #f4f4f4; }
  .total-row td { font-weight: 700; font-size: 15px; border-top: 2px solid #333; }
  .print-btn { margin-bottom: 20px; padding: 8px 16px; cursor: pointer; }
  @media print {
    .print-btn { display: none; }
  }
</style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  <h1>NodalWire LLC — Payslip</h1>
  <div class="sub">${p.employeeName} (${p.employeeId}) &nbsp;|&nbsp; Pay Period: ${p.payPeriodStart} to ${p.payPeriodEnd} &nbsp;|&nbsp; State: ${p.state}</div>
  <table>
    <tr><th colspan="2">Earnings</th></tr>
    <tr><td>Gross Pay</td><td>${fmtCurrency(p.grossPay)}</td></tr>
    ${p.regularHours !== null && p.regularHours !== undefined ? `<tr><td>Hours Worked</td><td>${p.regularHours}</td></tr>` : ''}
    ${p.hourlyRate ? `<tr><td>Hourly Rate</td><td>${fmtCurrency(p.hourlyRate)}</td></tr>` : ''}
    ${p.annualSalary ? `<tr><td>Annual Salary</td><td>${fmtCurrency(p.annualSalary)}</td></tr>` : ''}
  </table>
  <table>
    <tr><th colspan="2">Deductions</th></tr>
    <tr><td>Federal Income Tax Withholding</td><td>${fmtCurrency(p.federalWithholding)}</td></tr>
    <tr><td>Social Security (6.2%)</td><td>${fmtCurrency(p.socialSecurity)}</td></tr>
    <tr><td>Medicare (1.45%)</td><td>${fmtCurrency(p.medicare)}</td></tr>
    <tr><td>State Withholding (${p.state})</td><td>${fmtCurrency(p.stateWithholding)}</td></tr>
    <tr class="total-row"><td>Net Pay</td><td>${fmtCurrency(p.netPay)}</td></tr>
  </table>
  <div class="sub">Generated ${new Date(p.generatedAt).toLocaleString('en-US')} by ${p.generatedBy}</div>
</body>
</html>`;
}

createServer(async (req, res) => {
  // --- 1. POST /api/login ---
  if (req.url === '/api/login' && req.method === 'POST') {
    try {
      const { username, password } = await getRequestBody(req);
      const user = await findEmployeeByUsername(username);
      const isCorrectPassword = user && (user.password === password || (user.passwords && user.passwords.includes(password)));
      if (isCorrectPassword) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          user: { id: username, name: user.fullName, role: user.role, isTimeApprover: !!user.isTimeApprover }
        }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid username or password' }));
      }
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Malformed JSON payload' }));
    }
    return;
  }

  // --- 1a-i. POST /api/forgot-password (no auth) ---
  if (req.url === '/api/forgot-password' && req.method === 'POST') {
    try {
      const { username } = await getRequestBody(req);
      const genericResponse = { success: true, message: 'If that account exists and has an email on file, a reset link has been sent.' };

      const employee = await findEmployeeByUsername(username);
      if (!employee || !employee.email) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(genericResponse));
        return;
      }

      const transporter = await getMailTransporter();
      if (!transporter) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(genericResponse));
        return;
      }

      const token = randomBytes(32).toString('hex');
      const expiresAt = Date.now() + RESET_TOKEN_TTL_MS;

      const employees = await loadEmployees();
      const idx = employees.findIndex(e => e.username === username);
      employees[idx] = { ...employees[idx], resetToken: token, resetTokenExpiry: expiresAt };
      await saveEmployees(employees);

      const baseUrl = process.env.SITE_BASE_URL || `http://localhost:${PORT}`;
      const resetLink = `${baseUrl}/reset-password.html?token=${token}`;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: employee.email,
        subject: 'NodalWire — Password Reset Request',
        text: `Hi ${employee.fullName},\n\nA password reset was requested for your NodalWire account. This link expires in 1 hour:\n\n${resetLink}\n\nIf you didn't request this, you can ignore this email.`,
        html: `<p>Hi ${employee.fullName},</p><p>A password reset was requested for your NodalWire account. This link expires in 1 hour:</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you didn't request this, you can ignore this email.</p>`
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(genericResponse));
    } catch (err) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'If that account exists and has an email on file, a reset link has been sent.' }));
    }
    return;
  }

  // --- 1a-ii. POST /api/reset-password (no auth, token-based) ---
  if (req.url === '/api/reset-password' && req.method === 'POST') {
    try {
      const { token, newPassword } = await getRequestBody(req);
      if (!token || !newPassword || newPassword.length < 6) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'A valid token and a password of at least 6 characters are required.' }));
        return;
      }

      const employees = await loadEmployees();
      const idx = employees.findIndex(e => e.resetToken === token);
      if (idx === -1 || !employees[idx].resetTokenExpiry || employees[idx].resetTokenExpiry < Date.now()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'This reset link is invalid or has expired. Please request a new one.' }));
        return;
      }

      employees[idx] = {
        ...employees[idx],
        password: newPassword,
        passwords: null,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: new Date().toISOString()
      };
      await saveEmployees(employees);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Password updated successfully. You can now log in.' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to reset password.' }));
    }
    return;
  }

  // --- 1a-iii. GET /api/employees/me (any authenticated employee, self only) ---
  if (req.url.startsWith('/api/employees/me') && req.method === 'GET') {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const requesterId = urlObj.searchParams.get('requesterId');
    try {
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }
      const SELF_VIEW_FIELDS = [...PUBLIC_EMPLOYEE_FIELDS, 'username', 'email', 'role', 'phone', 'address', 'personalEmail', 'bankDetails', 'exploreN2pUsername', 'exploreN2pPassword', 'projectName', 'projectCode', 'isTimeApprover', 'dateOfBirth'];
      const out = {};
      for (const field of SELF_VIEW_FIELDS) out[field] = requester[field];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, employee: out }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to load profile' }));
    }
    return;
  }

  function isTimesheetApprover(employee) {
    return !!employee && (employee.role === 'admin' || employee.isTimeApprover === true);
  }

  // --- 1a-iv. GET /api/employees/projects (approver only) ---
  if (req.url.startsWith('/api/employees/projects') && req.method === 'GET') {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const requesterId = urlObj.searchParams.get('requesterId');
    try {
      const requester = await findEmployeeByUsername(requesterId);
      if (!isTimesheetApprover(requester)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }
      const employees = await loadEmployees();
      const out = employees.map(e => ({ id: e.id, username: e.username, fullName: e.fullName, projectName: e.projectName || '', projectCode: e.projectCode || '' }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, employees: out }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to load project assignments' }));
    }
    return;
  }

  // --- 1a-v. PUT /api/employees/project (approver only, project fields only) ---
  if (req.url === '/api/employees/project' && req.method === 'PUT') {
    try {
      const { requesterId, id, projectName, projectCode } = await getRequestBody(req);
      const requester = await findEmployeeByUsername(requesterId);
      if (!isTimesheetApprover(requester)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }
      const employees = await loadEmployees();
      const idx = employees.findIndex(e => e.id === id);
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Employee not found' }));
        return;
      }
      employees[idx] = { ...employees[idx], projectName: projectName || '', projectCode: projectCode || '', updatedAt: new Date().toISOString() };
      await saveEmployees(employees);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, employee: { id: employees[idx].id, fullName: employees[idx].fullName, projectName: employees[idx].projectName, projectCode: employees[idx].projectCode } }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to update project assignment' }));
    }
    return;
  }

  // --- 1a-vi. POST /api/employees/photo (self or admin) ---
  if (req.url === '/api/employees/photo' && req.method === 'POST') {
    try {
      const { requesterId, employeeId, imageData } = await getRequestBody(req);
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }

      const targetId = employeeId || requester.id;
      if (targetId !== requester.id && requester.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only admin can change another employee’s photo' }));
        return;
      }

      const match = /^data:(image\/(jpeg|png|webp));base64,(.+)$/.exec(imageData || '');
      if (!match) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unsupported image format. Use JPEG, PNG, or WEBP.' }));
        return;
      }
      const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[match[1]];
      const buffer = Buffer.from(match[3], 'base64');
      if (buffer.length > 3 * 1024 * 1024) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Image must be 3MB or smaller.' }));
        return;
      }

      const employees = await loadEmployees();
      const idx = employees.findIndex(e => e.id === targetId);
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Employee not found' }));
        return;
      }

      const assetsDir = join(__dirname, 'assets/employees');
      if (!existsSync(assetsDir)) mkdirSync(assetsDir, { recursive: true });
      const fileName = `${targetId}-${Date.now()}.${ext}`;
      await writeFile(join(assetsDir, fileName), buffer);

      const photoPath = `/assets/employees/${fileName}`;
      employees[idx] = { ...employees[idx], photo: photoPath, updatedAt: new Date().toISOString() };
      await saveEmployees(employees);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, photo: photoPath }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to upload photo' }));
    }
    return;
  }

  // --- 1b. GET /api/employees/public (no auth) ---
  if (req.url.startsWith('/api/employees/public') && req.method === 'GET') {
    try {
      const employees = await loadEmployees();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, employees: employees.map(toPublicEmployee) }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to load employees' }));
    }
    return;
  }

  // --- 1c. GET /api/employees (admin only, full records) ---
  if (req.url.startsWith('/api/employees') && req.method === 'GET') {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const requesterId = urlObj.searchParams.get('requesterId');
    try {
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester || requester.role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }
      const employees = await loadEmployees();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, employees }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to load employees' }));
    }
    return;
  }

  // --- 1d. POST /api/employees (admin only, create) ---
  if (req.url === '/api/employees' && req.method === 'POST') {
    try {
      const body = await getRequestBody(req);
      const requester = await findEmployeeByUsername(body.requesterId);
      if (!requester || requester.role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }
      if (!body.id || !body.fullName) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'id and fullName are required' }));
        return;
      }
      const employees = await loadEmployees();
      if (employees.some(e => e.id === body.id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'An employee with this id already exists' }));
        return;
      }
      if (body.username && employees.some(e => e.username === body.username)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'An employee with this username already exists' }));
        return;
      }
      const now = new Date().toISOString();
      const { requesterId, ...fields } = body;
      const newEmployee = {
        role: 'user',
        status: 'Active',
        passwords: null,
        employmentType: 'W2',
        state: 'TX',
        payType: 'salary',
        annualSalary: 0,
        hourlyRate: null,
        payFrequency: 'biweekly',
        filingStatus: 'single',
        w4Step2Checkbox: false,
        w4Dependents: 0,
        w4OtherIncome: 0,
        w4Deductions: 0,
        w4ExtraWithholding: 0,
        phone: '',
        address: '',
        personalEmail: null,
        bankDetails: { bankName: '', accountType: 'checking', routingNumber: '', accountNumber: '', zelleInfo: '' },
        exploreN2pUsername: null,
        exploreN2pPassword: null,
        projectName: '',
        projectCode: '',
        isTimeApprover: false,
        dateOfBirth: '',
        ...fields,
        createdAt: now,
        updatedAt: now
      };
      employees.push(newEmployee);
      await saveEmployees(employees);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, employee: newEmployee }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to create employee' }));
    }
    return;
  }

  // --- 1e. PUT /api/employees (admin only, update) ---
  if (req.url === '/api/employees' && req.method === 'PUT') {
    try {
      const body = await getRequestBody(req);
      const requester = await findEmployeeByUsername(body.requesterId);
      if (!requester || requester.role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }
      const employees = await loadEmployees();
      const idx = employees.findIndex(e => e.id === body.id);
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Employee not found' }));
        return;
      }
      const { requesterId, ...fields } = body;
      employees[idx] = { ...employees[idx], ...fields, updatedAt: new Date().toISOString() };
      await saveEmployees(employees);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, employee: employees[idx] }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to update employee' }));
    }
    return;
  }

  // --- 1f. DELETE /api/employees (admin only) ---
  if (req.url.startsWith('/api/employees') && req.method === 'DELETE') {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const id = urlObj.searchParams.get('id');
    const requesterId = urlObj.searchParams.get('requesterId');
    try {
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester || requester.role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }
      const employees = await loadEmployees();
      const idx = employees.findIndex(e => e.id === id);
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Employee not found' }));
        return;
      }
      employees.splice(idx, 1);
      await saveEmployees(employees);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Employee deleted' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to delete employee' }));
    }
    return;
  }

  // --- 2. GET /api/worklogs ---
  if (req.url.startsWith('/api/worklogs') && req.method === 'GET') {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const userId = urlObj.searchParams.get('userId');
    const requesterId = urlObj.searchParams.get('requesterId');
    const dateStr = urlObj.searchParams.get('date');

    try {
      const dbData = JSON.parse(await readFile(DB_PATH, 'utf8') || '[]');
      let logs = dbData;
      const requester = await findEmployeeByUsername(requesterId);

      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }

      if (requester.role !== 'admin') {
        logs = logs.filter(l => l.userId === requesterId);
      } else {
        if (userId) {
          logs = logs.filter(l => l.userId === userId);
        }
        if (dateStr) {
          logs = logs.filter(l => l.date === dateStr);
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, logs }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Database read failed' }));
    }
    return;
  }

  // --- 3. POST /api/worklogs ---
  if (req.url === '/api/worklogs' && req.method === 'POST') {
    try {
      const { requesterId, date, taskName, startTime, endTime, notes } = await getRequestBody(req);
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }

      if (!date || !taskName || !startTime || !endTime) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
        return;
      }

      const toMinutes = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };

      const startM = toMinutes(startTime);
      const endM = toMinutes(endTime);

      if (endM <= startM) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'End Time must be greater than Start Time' }));
        return;
      }

      const dbData = JSON.parse(await readFile(DB_PATH, 'utf8') || '[]');

      const isDuplicate = dbData.some(log => {
        if (log.userId === requesterId && log.date === date && log.taskName.toLowerCase() === taskName.toLowerCase()) {
          const logStart = toMinutes(log.startTime);
          const logEnd = toMinutes(log.endTime);
          return startM < logEnd && logStart < endM;
        }
        return false;
      });

      if (isDuplicate) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'A duplicate entry for the same task in this time range already exists.' }));
        return;
      }

      const totalHours = parseFloat(((endM - startM) / 60).toFixed(2));
      const newLog = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
        userId: requesterId,
        userName: requester.fullName,
        date,
        taskName,
        startTime,
        endTime,
        totalHours,
        notes: notes || '',
        createdAt: new Date().toISOString()
      };

      dbData.push(newLog);
      await writeFile(DB_PATH, JSON.stringify(dbData, null, 2), 'utf8');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, log: newLog }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to save entry' }));
    }
    return;
  }

  // --- 4. PUT /api/worklogs ---
  if (req.url === '/api/worklogs' && req.method === 'PUT') {
    try {
      const { requesterId, id, date, taskName, startTime, endTime, notes } = await getRequestBody(req);
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }

      const dbData = JSON.parse(await readFile(DB_PATH, 'utf8') || '[]');
      const logIndex = dbData.findIndex(l => l.id === id);

      if (logIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Work entry not found' }));
        return;
      }

      const existingLog = dbData[logIndex];

      if (requester.role !== 'admin') {
        const getTodayString = () => {
          const d = new Date();
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        };
        if (existingLog.date !== getTodayString()) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Users can only edit today\'s entries' }));
          return;
        }
        if (existingLog.userId !== requesterId) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Unauthorized to edit this entry' }));
          return;
        }
      }

      const toMinutes = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };

      const startM = toMinutes(startTime);
      const endM = toMinutes(endTime);

      if (endM <= startM) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'End Time must be greater than Start Time' }));
        return;
      }

      const isDuplicate = dbData.some(log => {
        if (log.id !== id && log.userId === existingLog.userId && log.date === date && log.taskName.toLowerCase() === taskName.toLowerCase()) {
          const logStart = toMinutes(log.startTime);
          const logEnd = toMinutes(log.endTime);
          return startM < logEnd && logStart < endM;
        }
        return false;
      });

      if (isDuplicate) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'A duplicate entry for the same task in this time range already exists.' }));
        return;
      }

      const totalHours = parseFloat(((endM - startM) / 60).toFixed(2));

      dbData[logIndex] = {
        ...existingLog,
        date,
        taskName,
        startTime,
        endTime,
        totalHours,
        notes: notes || ''
      };

      await writeFile(DB_PATH, JSON.stringify(dbData, null, 2), 'utf8');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, log: dbData[logIndex] }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to update entry' }));
    }
    return;
  }

  // --- 5. DELETE /api/worklogs ---
  if (req.url.startsWith('/api/worklogs') && req.method === 'DELETE') {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const id = urlObj.searchParams.get('id');
    const requesterId = urlObj.searchParams.get('requesterId');

    try {
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }

      const dbData = JSON.parse(await readFile(DB_PATH, 'utf8') || '[]');
      const logIndex = dbData.findIndex(l => l.id === id);

      if (logIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Work entry not found' }));
        return;
      }

      const existingLog = dbData[logIndex];

      if (requester.role !== 'admin') {
        const getTodayString = () => {
          const d = new Date();
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        };
        if (existingLog.date !== getTodayString()) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Users can only delete today\'s entries' }));
          return;
        }
        if (existingLog.userId !== requesterId) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Unauthorized to delete this entry' }));
          return;
        }
      }

      dbData.splice(logIndex, 1);
      await writeFile(DB_PATH, JSON.stringify(dbData, null, 2), 'utf8');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Entry deleted' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to delete entry' }));
    }
    return;
  }

  // --- 5d. GET /api/timesheets ---
  if (req.url.startsWith('/api/timesheets') && req.method === 'GET') {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const requesterId = urlObj.searchParams.get('requesterId');
    const weekStart = urlObj.searchParams.get('weekStart');
    const employeeIdFilter = urlObj.searchParams.get('employeeId');

    try {
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }

      const dbData = JSON.parse(await readFile(TIMESHEETS_PATH, 'utf8') || '[]');
      let sheets = dbData;

      if (weekStart) sheets = sheets.filter(s => s.weekStart === weekStart);

      if (!isTimesheetApprover(requester)) {
        sheets = sheets.filter(s => s.employeeId === requesterId);
      } else if (employeeIdFilter) {
        sheets = sheets.filter(s => s.employeeId === employeeIdFilter);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, timesheets: sheets }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Database read failed' }));
    }
    return;
  }

  // --- 5e. POST /api/timesheets (upsert own, or anyone's if approver) ---
  if (req.url === '/api/timesheets' && req.method === 'POST') {
    try {
      const body = await getRequestBody(req);
      const { requesterId, weekStart, weekEnd, hours, activity } = body;
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }

      const targetId = body.employeeId || requesterId;
      const approver = isTimesheetApprover(requester);
      if (targetId !== requesterId && !approver) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: "Only Julius or admin can edit another employee's timesheet" }));
        return;
      }

      const targetEmployee = await findEmployeeByUsername(targetId);
      if (!targetEmployee) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Employee not found' }));
        return;
      }

      if (!weekStart || !weekEnd || !hours) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
        return;
      }

      const todayStr = new Date().toISOString().split('T')[0];
      if (weekStart > todayStr) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Cannot submit a future week.' }));
        return;
      }

      const dbData = JSON.parse(await readFile(TIMESHEETS_PATH, 'utf8') || '[]');
      const idx = dbData.findIndex(s => s.employeeId === targetId && s.weekStart === weekStart);

      if (idx !== -1 && dbData[idx].status === 'approved' && !approver) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'This timesheet is approved and locked.' }));
        return;
      }

      const now = new Date().toISOString();
      const isTargetApprover = isTimesheetApprover(targetEmployee);
      const status = isTargetApprover ? 'approved' : 'pending';

      const dayHours = {};
      ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(d => {
        dayHours[d] = Math.max(0, parseFloat(hours[d]) || 0);
      });

      const record = {
        id: idx !== -1 ? dbData[idx].id : 'ts_' + Date.now().toString() + Math.random().toString(36).substring(2, 7),
        employeeId: targetId,
        employeeName: targetEmployee.fullName,
        projectName: targetEmployee.projectName || '',
        projectCode: targetEmployee.projectCode || '',
        weekStart,
        weekEnd,
        hours: dayHours,
        activity: activity || '',
        status,
        submittedAt: now,
        approvedAt: status === 'approved' ? now : (idx !== -1 ? dbData[idx].approvedAt : null),
        approvedBy: status === 'approved' ? requesterId : (idx !== -1 ? dbData[idx].approvedBy : null),
        createdAt: idx !== -1 ? dbData[idx].createdAt : now,
        updatedAt: now
      };

      if (idx !== -1) {
        dbData[idx] = record;
      } else {
        dbData.push(record);
      }
      await writeFile(TIMESHEETS_PATH, JSON.stringify(dbData, null, 2), 'utf8');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, timesheet: record }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to save timesheet' }));
    }
    return;
  }

  // --- 5f2. PUT /api/timesheets (approve/reject, approver only) ---
  if (req.url === '/api/timesheets' && req.method === 'PUT') {
    try {
      const { requesterId, id, status } = await getRequestBody(req);
      const requester = await findEmployeeByUsername(requesterId);
      if (!isTimesheetApprover(requester)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only Julius or admin can approve timesheets' }));
        return;
      }
      if (!['approved', 'rejected'].includes(status)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid status' }));
        return;
      }

      const dbData = JSON.parse(await readFile(TIMESHEETS_PATH, 'utf8') || '[]');
      const idx = dbData.findIndex(s => s.id === id);
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Timesheet not found' }));
        return;
      }

      dbData[idx] = {
        ...dbData[idx],
        status,
        approvedAt: status === 'approved' ? new Date().toISOString() : null,
        approvedBy: status === 'approved' ? requesterId : null,
        updatedAt: new Date().toISOString()
      };
      await writeFile(TIMESHEETS_PATH, JSON.stringify(dbData, null, 2), 'utf8');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, timesheet: dbData[idx] }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to update timesheet' }));
    }
    return;
  }

  // --- 5f. Payroll helpers ---
  async function buildPayslipPreview({ employeeId, payPeriodStart, payPeriodEnd, hoursWorked }) {
    const employee = await findEmployeeById(employeeId);
    if (!employee) return { error: 'Employee not found' };

    const payFrequency = employee.payFrequency || 'biweekly';
    const periodsPerYear = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 }[payFrequency];
    if (!periodsPerYear) return { error: 'Invalid pay frequency for this employee' };

    let grossPayPerPeriod;
    let regularHours = null;
    if (employee.payType === 'hourly') {
      regularHours = hoursWorked || 0;
      grossPayPerPeriod = (employee.hourlyRate || 0) * regularHours;
    } else {
      grossPayPerPeriod = (employee.annualSalary || 0) / periodsPerYear;
    }

    const payslips = JSON.parse(await readFile(PAYSLIPS_PATH, 'utf8') || '[]');
    const periodYear = payPeriodStart.slice(0, 4);
    const ytdGrossBeforeThisPeriod = payslips
      .filter(p => p.employeeId === employeeId && p.payPeriodStart.slice(0, 4) === periodYear && p.payPeriodStart < payPeriodStart)
      .reduce((sum, p) => sum + p.grossPay, 0);

    const w4Snapshot = {
      filingStatus: employee.filingStatus || 'single',
      w4Step2Checkbox: !!employee.w4Step2Checkbox,
      w4Dependents: employee.w4Dependents || 0,
      w4OtherIncome: employee.w4OtherIncome || 0,
      w4Deductions: employee.w4Deductions || 0,
      w4ExtraWithholding: employee.w4ExtraWithholding || 0
    };

    const calc = calculatePayslip({
      grossPayPerPeriod,
      payFrequency,
      state: employee.state || 'TX',
      filingStatus: w4Snapshot.filingStatus,
      w4Step2Checkbox: w4Snapshot.w4Step2Checkbox,
      w4Deductions: w4Snapshot.w4Deductions,
      w4OtherIncome: w4Snapshot.w4OtherIncome,
      w4Dependents: w4Snapshot.w4Dependents,
      w4ExtraWithholding: w4Snapshot.w4ExtraWithholding,
      ytdGrossBeforeThisPeriod
    });

    return {
      employeeId: employee.id,
      employeeName: employee.fullName,
      payPeriodStart,
      payPeriodEnd,
      payFrequency,
      state: employee.state || 'TX',
      regularHours,
      hourlyRate: employee.payType === 'hourly' ? employee.hourlyRate : null,
      annualSalary: employee.payType === 'salary' ? employee.annualSalary : null,
      w4Snapshot,
      ...calc
    };
  }

  // --- 5g. POST /api/payroll/calculate (preview, admin only) ---
  if (req.url === '/api/payroll/calculate' && req.method === 'POST') {
    try {
      const body = await getRequestBody(req);
      const requester = await findEmployeeByUsername(body.requesterId);
      if (!requester || requester.role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only admins can run payroll' }));
        return;
      }
      if (!body.employeeId || !body.payPeriodStart || !body.payPeriodEnd) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
        return;
      }
      const preview = await buildPayslipPreview(body);
      if (preview.error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: preview.error }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, preview }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to calculate payroll' }));
    }
    return;
  }

  // --- 5h. POST /api/payroll/generate (persist, admin only) ---
  if (req.url === '/api/payroll/generate' && req.method === 'POST') {
    try {
      const body = await getRequestBody(req);
      const requester = await findEmployeeByUsername(body.requesterId);
      if (!requester || requester.role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only admins can run payroll' }));
        return;
      }
      if (!body.employeeId || !body.payPeriodStart || !body.payPeriodEnd) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
        return;
      }

      const payslips = JSON.parse(await readFile(PAYSLIPS_PATH, 'utf8') || '[]');
      const newStart = body.payPeriodStart;
      const newEnd = body.payPeriodEnd;
      const overlaps = payslips.some(p => {
        if (p.employeeId !== body.employeeId) return false;
        return newStart <= p.payPeriodEnd && p.payPeriodStart <= newEnd;
      });
      if (overlaps) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'A payslip already exists for this employee covering an overlapping pay period.' }));
        return;
      }

      const preview = await buildPayslipPreview(body);
      if (preview.error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: preview.error }));
        return;
      }

      const newPayslip = {
        id: 'ps_' + Date.now().toString() + Math.random().toString(36).substring(2, 7),
        ...preview,
        generatedAt: new Date().toISOString(),
        generatedBy: body.requesterId
      };

      payslips.push(newPayslip);
      await writeFile(PAYSLIPS_PATH, JSON.stringify(payslips, null, 2), 'utf8');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, payslip: newPayslip }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to generate payslip' }));
    }
    return;
  }

  // --- 5i. GET /api/payslips/:id/print ---
  if (req.url.match(/^\/api\/payslips\/[^/]+\/print(\?.*)?$/) && req.method === 'GET') {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const requesterId = urlObj.searchParams.get('requesterId');
    const id = decodeURIComponent(urlObj.pathname.split('/')[3]);

    try {
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Unauthorized');
        return;
      }
      const payslips = JSON.parse(await readFile(PAYSLIPS_PATH, 'utf8') || '[]');
      const payslip = payslips.find(p => p.id === id);
      if (!payslip) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Payslip not found');
        return;
      }
      if (requester.role !== 'admin' && payslip.employeeId !== requester.id) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Unauthorized to view this payslip');
        return;
      }

      const html = renderPayslipHtml(payslip);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Failed to render payslip');
    }
    return;
  }

  // --- 5j. GET /api/payslips ---
  if (req.url.startsWith('/api/payslips') && !req.url.includes('/print') && req.method === 'GET') {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const requesterId = urlObj.searchParams.get('requesterId');
    const employeeId = urlObj.searchParams.get('employeeId');

    try {
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }

      const payslips = JSON.parse(await readFile(PAYSLIPS_PATH, 'utf8') || '[]');
      let results = payslips;

      if (requester.role !== 'admin') {
        results = results.filter(p => p.employeeId === requester.id);
      } else if (employeeId) {
        results = results.filter(p => p.employeeId === employeeId);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, payslips: results }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to load payslips' }));
    }
    return;
  }

  // --- 5k. GET /api/tickets ---
  if (req.url.startsWith('/api/tickets') && req.method === 'GET') {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const requesterId = urlObj.searchParams.get('requesterId');
    const employeeId = urlObj.searchParams.get('employeeId');

    try {
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }

      const tickets = JSON.parse(await readFile(TICKETS_PATH, 'utf8') || '[]');
      let results = tickets;

      if (requester.role !== 'admin') {
        results = results.filter(t => t.employeeId === requester.id);
      } else if (employeeId) {
        results = results.filter(t => t.employeeId === employeeId);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, tickets: results }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to load tickets' }));
    }
    return;
  }

  // --- 5l. POST /api/tickets (any authenticated employee) ---
  if (req.url === '/api/tickets' && req.method === 'POST') {
    try {
      const { requesterId, message } = await getRequestBody(req);
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
      }
      if (!message || !message.trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Message is required' }));
        return;
      }

      const tickets = JSON.parse(await readFile(TICKETS_PATH, 'utf8') || '[]');
      const now = new Date().toISOString();
      const newTicket = {
        id: 'tk_' + Date.now().toString() + Math.random().toString(36).substring(2, 7),
        employeeId: requester.id,
        employeeName: requester.fullName,
        message: message.trim(),
        status: 'pending',
        adminNotes: '',
        createdAt: now,
        updatedAt: now,
        resolvedBy: null
      };

      tickets.push(newTicket);
      await writeFile(TICKETS_PATH, JSON.stringify(tickets, null, 2), 'utf8');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, ticket: newTicket }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to submit ticket' }));
    }
    return;
  }

  // --- 5m. PUT /api/tickets (admin only, update status/notes) ---
  if (req.url === '/api/tickets' && req.method === 'PUT') {
    try {
      const { requesterId, id, status, adminNotes } = await getRequestBody(req);
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester || requester.role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only admins can update tickets' }));
        return;
      }

      const validStatuses = ['pending', 'in_review', 'resolved', 'rejected'];
      if (status && !validStatuses.includes(status)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid status' }));
        return;
      }

      const tickets = JSON.parse(await readFile(TICKETS_PATH, 'utf8') || '[]');
      const idx = tickets.findIndex(t => t.id === id);
      if (idx === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Ticket not found' }));
        return;
      }

      tickets[idx] = {
        ...tickets[idx],
        status: status || tickets[idx].status,
        adminNotes: adminNotes !== undefined ? adminNotes : tickets[idx].adminNotes,
        resolvedBy: requesterId,
        updatedAt: new Date().toISOString()
      };

      await writeFile(TICKETS_PATH, JSON.stringify(tickets, null, 2), 'utf8');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, ticket: tickets[idx] }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to update ticket' }));
    }
    return;
  }

  // --- 6. GET /api/reports/export ---
  if (req.url.startsWith('/api/reports/export') && req.method === 'GET') {
    const urlObj = new URL(req.url, `http://localhost:${PORT}`);
    const format = urlObj.searchParams.get('format') || 'csv';
    const type = urlObj.searchParams.get('type') || 'daily';
    const userId = urlObj.searchParams.get('userId');
    const dateStr = urlObj.searchParams.get('date');
    const requesterId = urlObj.searchParams.get('requesterId');

    try {
      const requester = await findEmployeeByUsername(requesterId);
      if (!requester || requester.role !== 'admin') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Only admins can export reports' }));
        return;
      }

      const dbData = JSON.parse(await readFile(DB_PATH, 'utf8') || '[]');
      let logs = dbData;

      if (userId) {
        logs = logs.filter(l => l.userId === userId);
      }

      const targetDate = dateStr ? new Date(dateStr) : new Date();
      
      if (type === 'daily') {
        const dayStr = dateStr || targetDate.toISOString().split('T')[0];
        logs = logs.filter(l => l.date === dayStr);
      } else if (type === 'weekly') {
        const startOfWeek = new Date(targetDate);
        startOfWeek.setDate(targetDate.getDate() - targetDate.getDay());
        startOfWeek.setHours(0,0,0,0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23,59,59,999);

        logs = logs.filter(l => {
          const logD = new Date(l.date);
          return logD >= startOfWeek && logD <= endOfWeek;
        });
      } else if (type === 'monthly') {
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth();
        logs = logs.filter(l => {
          const logD = new Date(l.date);
          return logD.getFullYear() === year && logD.getMonth() === month;
        });
      }

      let csv = '\ufeffID,User ID,User Name,Date,Task/Project,Start Time,End Time,Total Hours,Notes,Created At\n';
      logs.forEach(l => {
        csv += `"${l.id}","${l.userId}","${l.userName}","${l.date}","${l.taskName.replace(/"/g, '""')}","${l.startTime}","${l.endTime}",${l.totalHours},"${(l.notes || '').replace(/"/g, '""')}","${l.createdAt}"\n`;
      });

      const filename = `work_hours_${type}_report_${new Date().toISOString().split('T')[0]}`;
      if (format === 'excel') {
        res.writeHead(200, {
          'Content-Type': 'application/vnd.ms-excel; charset=utf-8',
          'Content-Disposition': `attachment; filename=${filename}.xls`
        });
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename=${filename}.csv`
        });
      }
      res.end(csv);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to generate report' }));
    }
    return;
  }

  // --- Static File Serving ---
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  // If request contains query parameters, strip them for file lookup
  if (urlPath.includes('?')) {
    urlPath = urlPath.split('?')[0];
  }
  const filePath = join(__dirname, urlPath);
  try {
    let data = await readFile(filePath);
    const ext = extname(filePath);

    if (ext === '.html') {
      let html = data.toString();
      html = injectGA4(html);
      data = Buffer.from(html);
    }

    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
