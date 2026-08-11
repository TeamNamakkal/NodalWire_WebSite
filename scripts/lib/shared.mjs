// Shared helpers used by both scripts/serve.mjs and scripts/lib/*-routes.mjs.
// Extracted so route modules can use auth/employee/email helpers without a
// circular import back into serve.mjs (which starts listening at module load).

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('../..', import.meta.url));
const EMPLOYEES_PATH = join(__dirname, 'data/employees.json');

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

function isTimesheetApprover(employee) {
  return !!employee && (employee.role === 'admin' || employee.isTimeApprover === true);
}

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

export {
  __dirname,
  EMPLOYEES_PATH,
  getMailTransporter,
  isTimesheetApprover,
  loadEmployees,
  saveEmployees,
  findEmployeeByUsername,
  findEmployeeById,
  getRequestBody
};
