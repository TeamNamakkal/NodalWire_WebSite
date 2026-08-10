(function () {
  const css = `
    .pr-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 10001;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .pr-overlay.open { display: flex; opacity: 1; }
    .pr-card {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
      width: 92%;
      max-width: 900px;
      max-height: 85vh;
      overflow-y: auto;
      padding: 32px;
      color: #1e293b;
      font-family: 'Inter', sans-serif;
      transform: scale(0.92) translateY(10px);
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .pr-overlay.open .pr-card { transform: scale(1) translateY(0); }
    .pr-card::-webkit-scrollbar { width: 6px; }
    .pr-card::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.03); }
    .pr-card::-webkit-scrollbar-thumb { background: rgba(29, 120, 196, 0.25); border-radius: 3px; }
    .pr-card::-webkit-scrollbar-thumb:hover { background: rgba(29, 120, 196, 0.4); }
    .pr-card h2, .pr-card h3 { font-family: 'Lato', sans-serif; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }
    .pr-card h2 { font-size: 24px; margin-bottom: 8px; }
    .pr-card h3 { font-size: 18px; margin-bottom: 16px; }
    .pr-card p { font-size: 14px; color: #64748b; line-height: 1.6; }
    .pr-form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    .pr-label { font-family: 'Lato', sans-serif; font-size: 11px; font-weight: 700; color: #1D78C4; text-transform: uppercase; letter-spacing: 0.1em; }
    .pr-input, .pr-select { background: #f8fafc; border: 1px solid rgba(15, 23, 42, 0.12); border-radius: 8px; padding: 10px 14px; font-family: 'Inter', sans-serif; font-size: 14px; color: #0f172a; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
    .pr-input:focus, .pr-select:focus { border-color: #1D78C4; box-shadow: 0 0 0 3px rgba(29, 120, 196, 0.15); }
    .pr-select option { background: #ffffff; color: #0f172a; }
    .pr-btn-primary { background: linear-gradient(135deg, #1D78C4 0%, #1562a8 100%); color: #fff; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 14px; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 16px rgba(29, 120, 196, 0.25); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease; }
    .pr-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(29, 120, 196, 0.35); }
    .pr-btn-secondary { background: rgba(15, 23, 42, 0.05); border: 1px solid rgba(15, 23, 42, 0.12); color: #1e293b; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 14px; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: background 0.2s ease, transform 0.15s ease; }
    .pr-btn-secondary:hover { background: rgba(15, 23, 42, 0.08); transform: translateY(-1px); }
    .pr-btn-mini { padding: 6px 12px; font-size: 13px; border-radius: 6px; }
    .pr-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(15, 23, 42, 0.08); padding-bottom: 16px; margin-bottom: 24px; }
    .pr-footer { display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid rgba(15, 23, 42, 0.08); padding-top: 16px; margin-top: 24px; }
    .pr-alert { background: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.2); border-radius: 8px; padding: 12px; color: #b91c1c; font-size: 13px; margin-bottom: 16px; display: none; }
    .pr-table-container { overflow-x: auto; background: #ffffff; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 10px; }
    .pr-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
    .pr-table th, .pr-table td { padding: 12px 16px; border-bottom: 1px solid rgba(15, 23, 42, 0.06); }
    .pr-table th { background: rgba(15, 23, 42, 0.02); font-family: 'Lato', sans-serif; font-weight: 700; color: #1D78C4; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
    .pr-table tbody tr:hover { background: rgba(15, 23, 42, 0.02); }
    .pr-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .pr-preview-box { background: rgba(15, 23, 42, 0.02); border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 10px; padding: 16px; margin-bottom: 20px; }
    .pr-preview-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; border-bottom: 1px solid rgba(15, 23, 42, 0.06); }
    .pr-preview-row.total { font-weight: 700; font-size: 16px; border-top: 2px solid rgba(29, 120, 196, 0.4); border-bottom: none; padding-top: 12px; margin-top: 6px; color: #1D78C4; }
    @media (max-width: 600px) {
      .pr-form-row { grid-template-columns: 1fr; gap: 0; }
      .pr-header { flex-direction: column; align-items: flex-start; gap: 12px; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.innerHTML = css;
  document.head.appendChild(styleEl);

  const overlay = document.createElement('div');
  overlay.className = 'pr-overlay';
  overlay.innerHTML = `<div class="pr-card" id="prCard"></div>`;
  document.body.appendChild(overlay);

  let currentPayslips = [];
  let currentPreview = null;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('wh_user') || 'null');
  }

  if (window.NWPortal) {
    window.NWPortal.register('Payroll', openModal);
  }

  function openModal() {
    const user = getCurrentUser();
    if (!user) return;
    overlay.classList.add('open');
    renderScreen();
  }

  function closeModal() {
    overlay.classList.remove('open');
  }

  function renderScreen() {
    const user = getCurrentUser();
    const card = document.getElementById('prCard');
    if (!user) {
      closeModal();
      return;
    }
    if (user.role === 'admin') {
      renderAdminView(card);
    } else {
      renderEmployeeView(card);
    }
  }

  // --- Employee view: read-only own payslips ---
  async function renderEmployeeView(container) {
    const user = getCurrentUser();
    container.innerHTML = `
      <div class="pr-header">
        <div>
          <h2>My Payslips</h2>
          <p>View and print your pay history.</p>
        </div>
        <button class="pr-btn-secondary pr-btn-mini" id="prCloseBtn">Close</button>
      </div>
      <div class="pr-table-container">
        <table class="pr-table">
          <thead>
            <tr>
              <th>Pay Period</th>
              <th>Gross Pay</th>
              <th>Net Pay</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="prTableBody">
            <tr><td colspan="4" style="text-align: center; color: #7a9bbf; padding: 24px;">Loading payslips...</td></tr>
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('prCloseBtn').addEventListener('click', closeModal);

    try {
      const res = await fetch(`/api/payslips?requesterId=${user.id}`);
      const data = await res.json();
      const tbody = document.getElementById('prTableBody');
      if (data.success) {
        currentPayslips = data.payslips || [];
        if (currentPayslips.length === 0) {
          tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #7a9bbf; padding: 24px;">No payslips yet.</td></tr>`;
          return;
        }
        const sorted = [...currentPayslips].sort((a, b) => b.payPeriodStart.localeCompare(a.payPeriodStart));
        tbody.innerHTML = sorted.map(p => `
          <tr>
            <td>${p.payPeriodStart} to ${p.payPeriodEnd}</td>
            <td>${fmtCurrency(p.grossPay)}</td>
            <td><strong>${fmtCurrency(p.netPay)}</strong></td>
            <td><button class="pr-btn-secondary pr-btn-mini" onclick="window.prView('${p.id}')">View / Print</button></td>
          </tr>
        `).join('');
      } else {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #ef4444; padding: 24px;">${escapeHtml(data.message || 'Failed to load payslips.')}</td></tr>`;
      }
    } catch (err) {
      document.getElementById('prTableBody').innerHTML = `<tr><td colspan="4" style="text-align: center; color: #ef4444; padding: 24px;">Network error loading payslips.</td></tr>`;
    }
  }

  window.prView = function (id) {
    const user = getCurrentUser();
    window.open(`/api/payslips/${id}/print?requesterId=${user.id}`, '_blank');
  };

  // --- Admin view: run payroll + history ---
  async function renderAdminView(container) {
    container.innerHTML = `
      <div class="pr-header">
        <div>
          <h2>Payroll — Admin</h2>
          <p>Calculate withholding and generate payslips for employees.</p>
        </div>
        <button class="pr-btn-secondary pr-btn-mini" id="prCloseBtn">Close</button>
      </div>
      <div class="pr-alert" id="prAlert"></div>
      <form id="prCalcForm">
        <div class="pr-form-row">
          <div class="pr-form-group">
            <label class="pr-label" for="prEmployee">Employee</label>
            <select class="pr-select" id="prEmployee" required>
              <option value="">Select employee...</option>
            </select>
          </div>
          <div class="pr-form-group">
            <label class="pr-label" for="prHours">Hours Worked (hourly employees only)</label>
            <input class="pr-input" id="prHours" type="number" min="0" step="0.01" placeholder="e.g. 80">
          </div>
        </div>
        <div class="pr-form-row">
          <div class="pr-form-group">
            <label class="pr-label" for="prPeriodStart">Pay Period Start</label>
            <input class="pr-input" id="prPeriodStart" type="date" required>
          </div>
          <div class="pr-form-group">
            <label class="pr-label" for="prPeriodEnd">Pay Period End</label>
            <input class="pr-input" id="prPeriodEnd" type="date" required>
          </div>
        </div>
        <div class="pr-footer" style="margin-top: 0;">
          <button type="submit" class="pr-btn-primary">Calculate Preview</button>
        </div>
      </form>
      <div id="prPreviewContainer"></div>
      <h3 style="margin-top: 32px;">Payslip History</h3>
      <div class="pr-table-container">
        <table class="pr-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Pay Period</th>
              <th>Gross Pay</th>
              <th>Net Pay</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="prHistoryTableBody">
            <tr><td colspan="5" style="text-align: center; color: #7a9bbf; padding: 24px;">Loading history...</td></tr>
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('prCloseBtn').addEventListener('click', closeModal);
    document.getElementById('prCalcForm').addEventListener('submit', handleCalculate);

    await populateEmployeeSelect();
    await loadHistory();
  }

  async function populateEmployeeSelect() {
    const user = getCurrentUser();
    const select = document.getElementById('prEmployee');
    try {
      const res = await fetch(`/api/employees?requesterId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        (data.employees || []).forEach(emp => {
          const opt = document.createElement('option');
          opt.value = emp.id;
          opt.textContent = `${emp.fullName} (${emp.id})`;
          select.appendChild(opt);
        });
      }
    } catch (err) {
      // Non-fatal
    }
  }

  async function loadHistory() {
    const user = getCurrentUser();
    const tbody = document.getElementById('prHistoryTableBody');
    try {
      const res = await fetch(`/api/payslips?requesterId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        currentPayslips = data.payslips || [];
        if (currentPayslips.length === 0) {
          tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #7a9bbf; padding: 24px;">No payslips generated yet.</td></tr>`;
          return;
        }
        const sorted = [...currentPayslips].sort((a, b) => b.payPeriodStart.localeCompare(a.payPeriodStart));
        tbody.innerHTML = sorted.map(p => `
          <tr>
            <td><strong>${escapeHtml(p.employeeName)}</strong><div style="font-size: 10px; color: #7a9bbf;">${escapeHtml(p.employeeId)}</div></td>
            <td>${p.payPeriodStart} to ${p.payPeriodEnd}</td>
            <td>${fmtCurrency(p.grossPay)}</td>
            <td><strong>${fmtCurrency(p.netPay)}</strong></td>
            <td><button class="pr-btn-secondary pr-btn-mini" onclick="window.prView('${p.id}')">View / Print</button></td>
          </tr>
        `).join('');
      }
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #ef4444; padding: 24px;">Failed to load history.</td></tr>`;
    }
  }

  async function handleCalculate(e) {
    e.preventDefault();
    const alertBox = document.getElementById('prAlert');
    alertBox.style.display = 'none';
    const user = getCurrentUser();

    const payload = {
      requesterId: user.id,
      employeeId: document.getElementById('prEmployee').value,
      payPeriodStart: document.getElementById('prPeriodStart').value,
      payPeriodEnd: document.getElementById('prPeriodEnd').value,
      hoursWorked: parseFloat(document.getElementById('prHours').value) || 0
    };

    if (!payload.employeeId) {
      alertBox.innerText = 'Please select an employee.';
      alertBox.style.display = 'block';
      return;
    }

    try {
      const res = await fetch('/api/payroll/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        currentPreview = data.preview;
        renderPreview(currentPreview, payload);
      } else {
        alertBox.innerText = data.message || 'Failed to calculate payroll.';
        alertBox.style.display = 'block';
      }
    } catch (err) {
      alertBox.innerText = 'Network error occurred.';
      alertBox.style.display = 'block';
    }
  }

  function renderPreview(preview, payload) {
    const container = document.getElementById('prPreviewContainer');
    container.innerHTML = `
      <div class="pr-preview-box">
        <h3>Preview: ${escapeHtml(preview.employeeName)}</h3>
        <div class="pr-preview-row"><span>Gross Pay</span><span>${fmtCurrency(preview.grossPay)}</span></div>
        <div class="pr-preview-row"><span>Federal Withholding</span><span>${fmtCurrency(preview.federalWithholding)}</span></div>
        <div class="pr-preview-row"><span>Social Security (6.2%)</span><span>${fmtCurrency(preview.socialSecurity)}</span></div>
        <div class="pr-preview-row"><span>Medicare (1.45%)</span><span>${fmtCurrency(preview.medicare)}</span></div>
        <div class="pr-preview-row"><span>State Withholding (${preview.state})</span><span>${fmtCurrency(preview.stateWithholding)}</span></div>
        <div class="pr-preview-row total"><span>Net Pay</span><span>${fmtCurrency(preview.netPay)}</span></div>
      </div>
      <div class="pr-footer" style="margin-top: 0;">
        <button class="pr-btn-primary" id="prGenerateBtn">Generate & Save Payslip</button>
      </div>
    `;
    document.getElementById('prGenerateBtn').addEventListener('click', () => handleGenerate(payload));
  }

  async function handleGenerate(payload) {
    const alertBox = document.getElementById('prAlert');
    alertBox.style.display = 'none';
    try {
      const res = await fetch('/api/payroll/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        currentPreview = null;
        document.getElementById('prPreviewContainer').innerHTML = '';
        document.getElementById('prCalcForm').reset();
        await loadHistory();
      } else {
        alertBox.innerText = data.message || 'Failed to generate payslip.';
        alertBox.style.display = 'block';
      }
    } catch (err) {
      alertBox.innerText = 'Network error occurred.';
      alertBox.style.display = 'block';
    }
  }

  function fmtCurrency(n) {
    return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
