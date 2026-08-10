(function () {
  const css = `
    .emp-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 10002;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .emp-overlay.open {
      display: flex;
      opacity: 1;
    }
    .emp-card {
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
    .emp-overlay.open .emp-card {
      transform: scale(1) translateY(0);
    }
    .emp-card::-webkit-scrollbar { width: 6px; }
    .emp-card::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.03); }
    .emp-card::-webkit-scrollbar-thumb { background: rgba(29, 120, 196, 0.25); border-radius: 3px; }
    .emp-card::-webkit-scrollbar-thumb:hover { background: rgba(29, 120, 196, 0.4); }
    .emp-card h2, .emp-card h3 { font-family: 'Lato', sans-serif; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }
    .emp-card h2 { font-size: 24px; margin-bottom: 8px; }
    .emp-card h3 { font-size: 18px; margin-bottom: 16px; }
    .emp-card p { font-size: 14px; color: #64748b; line-height: 1.6; }
    .emp-form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    .emp-label { font-family: 'Lato', sans-serif; font-size: 11px; font-weight: 700; color: #1D78C4; text-transform: uppercase; letter-spacing: 0.1em; }
    .emp-input, .emp-select { background: #f8fafc; border: 1px solid rgba(15, 23, 42, 0.12); border-radius: 8px; padding: 10px 14px; font-family: 'Inter', sans-serif; font-size: 14px; color: #0f172a; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
    .emp-input:focus, .emp-select:focus { border-color: #1D78C4; box-shadow: 0 0 0 3px rgba(29, 120, 196, 0.15); }
    .emp-select option { background: #ffffff; color: #0f172a; }
    .emp-btn-primary { background: linear-gradient(135deg, #1D78C4 0%, #1562a8 100%); color: #fff; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 14px; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 16px rgba(29, 120, 196, 0.25); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease; }
    .emp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(29, 120, 196, 0.35); }
    .emp-btn-secondary { background: rgba(15, 23, 42, 0.05); border: 1px solid rgba(15, 23, 42, 0.12); color: #1e293b; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 14px; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: background 0.2s ease, transform 0.15s ease; }
    .emp-btn-secondary:hover { background: rgba(15, 23, 42, 0.08); transform: translateY(-1px); }
    .emp-btn-danger { background: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.3); color: #dc2626; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 13px; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: background 0.2s ease; }
    .emp-btn-danger:hover { background: rgba(220, 38, 38, 0.15); }
    .emp-btn-mini { padding: 6px 12px; font-size: 13px; border-radius: 6px; }
    .emp-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(15, 23, 42, 0.08); padding-bottom: 16px; margin-bottom: 24px; }
    .emp-footer { display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid rgba(15, 23, 42, 0.08); padding-top: 16px; margin-top: 24px; }
    .emp-alert { background: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.2); border-radius: 8px; padding: 12px; color: #b91c1c; font-size: 13px; margin-bottom: 16px; display: none; }
    .emp-table-container { overflow-x: auto; background: #ffffff; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 10px; }
    .emp-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
    .emp-table th, .emp-table td { padding: 12px 16px; border-bottom: 1px solid rgba(15, 23, 42, 0.06); }
    .emp-table th { background: rgba(15, 23, 42, 0.02); font-family: 'Lato', sans-serif; font-weight: 700; color: #1D78C4; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
    .emp-table tbody tr:hover { background: rgba(15, 23, 42, 0.02); }
    .emp-actions-cell { display: flex; gap: 8px; }
    .emp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 600px) {
      .emp-form-row { grid-template-columns: 1fr; gap: 0; }
      .emp-header { flex-direction: column; align-items: flex-start; gap: 12px; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.innerHTML = css;
  document.head.appendChild(styleEl);

  const overlay = document.createElement('div');
  overlay.className = 'emp-overlay';
  overlay.innerHTML = `<div class="emp-card" id="empCard"></div>`;
  document.body.appendChild(overlay);

  let currentEmployees = [];
  let editingEmployee = null;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('wh_user') || 'null');
  }

  if (window.NWPortal) {
    window.NWPortal.register('Manage Employees', openModal, { adminOnly: true });
    window.NWPortal.register('My Profile', openMyProfile);
  }

  function openModal() {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') return;
    overlay.classList.add('open');
    renderListView();
  }

  function openMyProfile() {
    const user = getCurrentUser();
    if (!user) return;
    overlay.classList.add('open');
    renderMyProfile();
  }

  function closeModal() {
    overlay.classList.remove('open');
  }

  async function renderMyProfile() {
    const user = getCurrentUser();
    const card = document.getElementById('empCard');
    card.innerHTML = `
      <div class="emp-header">
        <div>
          <h2>My Profile</h2>
          <p>Your details on file. To request a change, use Employee Requests.</p>
        </div>
        <button class="emp-btn-secondary emp-btn-mini" id="empCloseBtn">Close</button>
      </div>
      <div id="empProfileBody">Loading...</div>
    `;
    document.getElementById('empCloseBtn').addEventListener('click', closeModal);

    try {
      const res = await fetch(`/api/employees/me?requesterId=${user.id}`);
      const data = await res.json();
      const body = document.getElementById('empProfileBody');
      if (!data.success) {
        body.innerHTML = `<p style="color:#dc2626;">${escapeHtml(data.message || 'Failed to load profile.')}</p>`;
        return;
      }
      const e = data.employee;
      const bd = e.bankDetails || {};
      const rows = [
        ['Employee ID', e.id],
        ['Full Name', e.fullName],
        ['Title', e.title],
        ['Department', e.department],
        ['Company', e.company],
        ['Reporting Manager', e.reportingManager],
        ['Work Location', e.workLocation],
        ['Address', e.address],
        ['Phone', e.phone],
        ['Joined Date', e.joinedDate],
        ['Status', e.status],
        ['Username', e.username],
        ['Office Email', e.email],
        ['Personal Email', e.personalEmail],
        ['Role', e.role],
        ['Bank Name', bd.bankName],
        ['Account Type', bd.accountType],
        ['Routing Number', bd.routingNumber],
        ['Account Number', bd.accountNumber],
        ['Zelle', bd.zelleInfo],
        ['exploreN2p Username', e.exploreN2pUsername],
        ['exploreN2p Password', e.exploreN2pPassword]
      ];
      body.innerHTML = `
        <div class="emp-table-container">
          <table class="emp-table">
            <tbody>
              ${rows.map(([label, val]) => `
                <tr>
                  <th style="width: 200px;">${escapeHtml(label)}</th>
                  <td>${val ? escapeHtml(String(val)) : '<span style="color:#94a3b8;">Not set</span>'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      document.getElementById('empProfileBody').innerHTML = `<p style="color:#dc2626;">Network error loading profile.</p>`;
    }
  }

  async function renderListView() {
    const card = document.getElementById('empCard');
    card.innerHTML = `
      <div class="emp-header">
        <div>
          <h2>Manage Employees</h2>
          <p>Create, update, and manage employee records.</p>
        </div>
        <button class="emp-btn-secondary emp-btn-mini" id="empCloseBtn">Close</button>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
        <button class="emp-btn-primary emp-btn-mini" id="empAddBtn">Add Employee</button>
      </div>
      <div class="emp-table-container">
        <table class="emp-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Title</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="empTableBody">
            <tr><td colspan="7" style="text-align: center; color: #7a9bbf; padding: 24px;">Loading employees...</td></tr>
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('empCloseBtn').addEventListener('click', closeModal);
    document.getElementById('empAddBtn').addEventListener('click', () => renderFormView());

    await loadEmployees();
  }

  async function loadEmployees() {
    const user = getCurrentUser();
    const tbody = document.getElementById('empTableBody');
    try {
      const res = await fetch(`/api/employees?requesterId=${user.id}`);
      const data = await res.json();
      if (!data.success) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #ef4444; padding: 24px;">${escapeHtml(data.message || 'Failed to load employees.')}</td></tr>`;
        return;
      }
      currentEmployees = data.employees || [];
      populateTable();
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #ef4444; padding: 24px;">Network error loading employees.</td></tr>`;
    }
  }

  function populateTable() {
    const tbody = document.getElementById('empTableBody');
    if (currentEmployees.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #7a9bbf; padding: 24px;">No employees found.</td></tr>`;
      return;
    }
    tbody.innerHTML = currentEmployees.map(emp => `
      <tr>
        <td>${escapeHtml(emp.id)}</td>
        <td><strong>${escapeHtml(emp.fullName)}</strong></td>
        <td>${escapeHtml(emp.title || '')}</td>
        <td>${escapeHtml(emp.username || '—')}</td>
        <td>${escapeHtml(emp.role || '')}</td>
        <td>${escapeHtml(emp.status || '')}</td>
        <td>
          <div class="emp-actions-cell">
            <button class="emp-btn-secondary emp-btn-mini" onclick="window.empEdit('${emp.id}')">Edit</button>
            <button class="emp-btn-danger" onclick="window.empDelete('${emp.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function renderFormView(empToEdit = null) {
    editingEmployee = empToEdit;
    const isEdit = !!empToEdit;
    const card = document.getElementById('empCard');
    const e = empToEdit || {};

    card.innerHTML = `
      <div class="emp-header">
        <div>
          <h2>${isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
          <p>${isEdit ? "Update this employee's record." : 'Create a new employee record.'}</p>
        </div>
        <button class="emp-btn-secondary emp-btn-mini" id="empFormBackBtn">Back</button>
      </div>
      <div class="emp-alert" id="empFormAlert"></div>
      <form id="empForm">
        <div class="emp-form-row">
          <div class="emp-form-group">
            <label class="emp-label" for="empId">Employee ID</label>
            <input class="emp-input" id="empId" type="text" value="${escapeHtml(e.id || '')}" placeholder="e.g. NW004" required ${isEdit ? 'disabled' : ''}>
          </div>
          <div class="emp-form-group">
            <label class="emp-label" for="empFullName">Full Name</label>
            <input class="emp-input" id="empFullName" type="text" value="${escapeHtml(e.fullName || '')}" required>
          </div>
        </div>
        <div class="emp-form-row">
          <div class="emp-form-group">
            <label class="emp-label" for="empEmail">Office Email (used for password reset)</label>
            <input class="emp-input" id="empEmail" type="email" value="${escapeHtml(e.email || '')}" placeholder="employee@nodalwire.com">
          </div>
          <div class="emp-form-group">
            <label class="emp-label" for="empPersonalEmail">Personal Email</label>
            <input class="emp-input" id="empPersonalEmail" type="email" value="${escapeHtml(e.personalEmail || '')}" placeholder="employee@example.com">
          </div>
        </div>
        <div class="emp-form-row">
          <div class="emp-form-group">
            <label class="emp-label" for="empTitle">Title</label>
            <input class="emp-input" id="empTitle" type="text" value="${escapeHtml(e.title || '')}">
          </div>
          <div class="emp-form-group">
            <label class="emp-label" for="empDepartment">Department</label>
            <input class="emp-input" id="empDepartment" type="text" value="${escapeHtml(e.department || 'ICT')}">
          </div>
        </div>
        <div class="emp-form-row">
          <div class="emp-form-group">
            <label class="emp-label" for="empPhone">Phone Number</label>
            <input class="emp-input" id="empPhone" type="text" value="${escapeHtml(e.phone || '')}" placeholder="+1 555 123 4567">
          </div>
          <div class="emp-form-group">
            <label class="emp-label" for="empJoinedDate">Joined Date</label>
            <input class="emp-input" id="empJoinedDate" type="text" value="${escapeHtml(e.joinedDate || '')}" placeholder="e.g. January 19, 2026">
          </div>
        </div>
        <div class="emp-form-row">
          <div class="emp-form-group">
            <label class="emp-label" for="empAddress">Address</label>
            <input class="emp-input" id="empAddress" type="text" value="${escapeHtml(e.address || '')}">
          </div>
          <div class="emp-form-group">
            <label class="emp-label" for="empPhoto">Photo Path</label>
            <input class="emp-input" id="empPhoto" type="text" value="${escapeHtml(e.photo || '')}" placeholder="/assets/employees/name.jpg">
          </div>
        </div>
        <div class="emp-form-row">
          <div class="emp-form-group">
            <label class="emp-label" for="empWorkLocation">Work Location</label>
            <input class="emp-input" id="empWorkLocation" type="text" value="${escapeHtml(e.workLocation || '')}">
          </div>
          <div class="emp-form-group">
            <label class="emp-label" for="empReportingManager">Reporting Manager</label>
            <input class="emp-input" id="empReportingManager" type="text" value="${escapeHtml(e.reportingManager || '')}">
          </div>
        </div>
        <div class="emp-form-row">
          <div class="emp-form-group">
            <label class="emp-label" for="empStatus">Status</label>
            <select class="emp-select" id="empStatus">
              <option value="Active" ${e.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Inactive" ${e.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
          <div class="emp-form-group">
            <label class="emp-label" for="empRole">Role</label>
            <select class="emp-select" id="empRole">
              <option value="user" ${e.role === 'user' || !e.role ? 'selected' : ''}>User</option>
              <option value="admin" ${e.role === 'admin' ? 'selected' : ''}>Admin</option>
            </select>
          </div>
        </div>
        <div class="emp-form-row">
          <div class="emp-form-group">
            <label class="emp-label" for="empUsername">Username (login)</label>
            <input class="emp-input" id="empUsername" type="text" value="${escapeHtml(e.username || '')}" placeholder="Leave blank for no login access">
          </div>
          <div class="emp-form-group">
            <label class="emp-label" for="empPassword">Password</label>
            <input class="emp-input" id="empPassword" type="text" placeholder="${isEdit ? 'Leave blank to keep current password' : 'Set login password'}">
          </div>
        </div>
        <div class="emp-form-row">
          <div class="emp-form-group">
            <label class="emp-label" for="empState">State (for payroll)</label>
            <input class="emp-input" id="empState" type="text" value="${escapeHtml(e.state || 'TX')}" maxlength="2">
          </div>
          <div class="emp-form-group">
            <label class="emp-label" for="empPayType">Pay Type</label>
            <select class="emp-select" id="empPayType">
              <option value="salary" ${e.payType === 'salary' || !e.payType ? 'selected' : ''}>Salary</option>
              <option value="hourly" ${e.payType === 'hourly' ? 'selected' : ''}>Hourly</option>
            </select>
          </div>
        </div>
        <h3 style="margin-top: 8px;">Bank Details (for direct deposit)</h3>
        <div class="emp-form-row">
          <div class="emp-form-group">
            <label class="emp-label" for="empBankName">Bank Name</label>
            <input class="emp-input" id="empBankName" type="text" value="${escapeHtml((e.bankDetails && e.bankDetails.bankName) || '')}">
          </div>
          <div class="emp-form-group">
            <label class="emp-label" for="empAccountType">Account Type</label>
            <select class="emp-select" id="empAccountType">
              <option value="checking" ${!e.bankDetails || e.bankDetails.accountType === 'checking' ? 'selected' : ''}>Checking</option>
              <option value="savings" ${e.bankDetails && e.bankDetails.accountType === 'savings' ? 'selected' : ''}>Savings</option>
            </select>
          </div>
        </div>
        <div class="emp-form-row">
          <div class="emp-form-group">
            <label class="emp-label" for="empRoutingNumber">Routing Number</label>
            <input class="emp-input" id="empRoutingNumber" type="text" value="${escapeHtml((e.bankDetails && e.bankDetails.routingNumber) || '')}">
          </div>
          <div class="emp-form-group">
            <label class="emp-label" for="empAccountNumber">Account Number</label>
            <input class="emp-input" id="empAccountNumber" type="text" value="${escapeHtml((e.bankDetails && e.bankDetails.accountNumber) || '')}">
          </div>
        </div>
        <div class="emp-form-row">
          <div class="emp-form-group">
            <label class="emp-label" for="empZelleInfo">Zelle (phone or email)</label>
            <input class="emp-input" id="empZelleInfo" type="text" value="${escapeHtml((e.bankDetails && e.bankDetails.zelleInfo) || '')}">
          </div>
        </div>
        <h3 style="margin-top: 8px;">exploreN2p (reference only)</h3>
        <div class="emp-form-row">
          <div class="emp-form-group">
            <label class="emp-label" for="empExploreUsername">exploreN2p Username</label>
            <input class="emp-input" id="empExploreUsername" type="text" value="${escapeHtml(e.exploreN2pUsername || '')}">
          </div>
          <div class="emp-form-group">
            <label class="emp-label" for="empExplorePassword">exploreN2p Password</label>
            <input class="emp-input" id="empExplorePassword" type="text" value="${escapeHtml(e.exploreN2pPassword || '')}">
          </div>
        </div>
        <div class="emp-footer">
          <button type="button" class="emp-btn-secondary" id="empFormCancelBtn">Cancel</button>
          <button type="submit" class="emp-btn-primary">${isEdit ? 'Save Changes' : 'Create Employee'}</button>
        </div>
      </form>
    `;

    document.getElementById('empFormBackBtn').addEventListener('click', goBack);
    document.getElementById('empFormCancelBtn').addEventListener('click', goBack);
    document.getElementById('empForm').addEventListener('submit', handleFormSubmit);

    function goBack() {
      editingEmployee = null;
      renderListView();
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const alertBox = document.getElementById('empFormAlert');
    alertBox.style.display = 'none';
    const user = getCurrentUser();

    const payload = {
      requesterId: user.id,
      id: document.getElementById('empId').value.trim(),
      fullName: document.getElementById('empFullName').value.trim(),
      email: document.getElementById('empEmail').value.trim() || null,
      personalEmail: document.getElementById('empPersonalEmail').value.trim() || null,
      title: document.getElementById('empTitle').value.trim(),
      department: document.getElementById('empDepartment').value.trim(),
      phone: document.getElementById('empPhone').value.trim(),
      joinedDate: document.getElementById('empJoinedDate').value.trim(),
      address: document.getElementById('empAddress').value.trim(),
      photo: document.getElementById('empPhoto').value.trim(),
      workLocation: document.getElementById('empWorkLocation').value.trim(),
      reportingManager: document.getElementById('empReportingManager').value.trim() || null,
      status: document.getElementById('empStatus').value,
      role: document.getElementById('empRole').value,
      username: document.getElementById('empUsername').value.trim() || null,
      state: document.getElementById('empState').value.trim().toUpperCase() || 'TX',
      payType: document.getElementById('empPayType').value,
      bankDetails: {
        bankName: document.getElementById('empBankName').value.trim(),
        accountType: document.getElementById('empAccountType').value,
        routingNumber: document.getElementById('empRoutingNumber').value.trim(),
        accountNumber: document.getElementById('empAccountNumber').value.trim(),
        zelleInfo: document.getElementById('empZelleInfo').value.trim()
      },
      exploreN2pUsername: document.getElementById('empExploreUsername').value.trim() || null,
      exploreN2pPassword: document.getElementById('empExplorePassword').value.trim() || null
    };

    const passwordVal = document.getElementById('empPassword').value;
    if (passwordVal) {
      payload.password = passwordVal;
      payload.passwords = null;
    }

    const isEdit = !!editingEmployee;
    const url = '/api/employees';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        editingEmployee = null;
        renderListView();
      } else {
        alertBox.innerText = data.message || 'Failed to save employee.';
        alertBox.style.display = 'block';
      }
    } catch (err) {
      alertBox.innerText = 'Network error occurred.';
      alertBox.style.display = 'block';
    }
  }

  window.empEdit = function (id) {
    const emp = currentEmployees.find(e => e.id === id);
    if (emp) renderFormView(emp);
  };

  window.empDelete = async function (id) {
    if (!confirm('Are you sure you want to delete this employee record?')) return;
    const user = getCurrentUser();
    try {
      const res = await fetch(`/api/employees?requesterId=${user.id}&id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await loadEmployees();
      } else {
        alert(data.message || 'Failed to delete employee.');
      }
    } catch (err) {
      alert('Network error. Failed to delete employee.');
    }
  };

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
