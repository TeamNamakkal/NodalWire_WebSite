(function () {
  const css = `
    .tb-card {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
      padding: 32px;
      color: #1e293b;
      font-family: 'Inter', sans-serif;
    }
    .tb-card h2, .tb-card h3 { font-family: 'Lato', sans-serif; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }
    .tb-card h2 { font-size: 24px; margin-bottom: 8px; }
    .tb-card h3 { font-size: 18px; margin-bottom: 16px; }
    .tb-card p { font-size: 14px; color: #64748b; line-height: 1.6; }
    .tb-form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    .tb-label { font-family: 'Lato', sans-serif; font-size: 11px; font-weight: 700; color: #1D78C4; text-transform: uppercase; letter-spacing: 0.1em; }
    .tb-input, .tb-select, .tb-textarea { background: #f8fafc; border: 1px solid rgba(15, 23, 42, 0.12); border-radius: 8px; padding: 10px 14px; font-family: 'Inter', sans-serif; font-size: 14px; color: #0f172a; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
    .tb-input:focus, .tb-select:focus, .tb-textarea:focus { border-color: #1D78C4; box-shadow: 0 0 0 3px rgba(29, 120, 196, 0.15); }
    .tb-textarea { resize: vertical; min-height: 80px; }
    .tb-select option { background: #ffffff; color: #0f172a; }
    .tb-btn-primary { background: linear-gradient(135deg, #1D78C4 0%, #1562a8 100%); color: #fff; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 14px; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 16px rgba(29, 120, 196, 0.25); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease; }
    .tb-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(29, 120, 196, 0.35); }
    .tb-btn-secondary { background: rgba(15, 23, 42, 0.05); border: 1px solid rgba(15, 23, 42, 0.12); color: #1e293b; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 14px; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: background 0.2s ease, transform 0.15s ease; }
    .tb-btn-secondary:hover { background: rgba(15, 23, 42, 0.08); transform: translateY(-1px); }
    .tb-btn-danger { background: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.3); color: #dc2626; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 13px; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: background 0.2s ease; }
    .tb-btn-danger:hover { background: rgba(220, 38, 38, 0.15); }
    .tb-btn-mini { padding: 6px 12px; font-size: 13px; border-radius: 6px; }
    .tb-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(15, 23, 42, 0.08); padding-bottom: 16px; margin-bottom: 24px; }
    .tb-footer { display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid rgba(15, 23, 42, 0.08); padding-top: 16px; margin-top: 24px; }
    .tb-alert { background: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.2); border-radius: 8px; padding: 12px; color: #b91c1c; font-size: 13px; margin-bottom: 16px; display: none; }
    .tb-table-container { overflow-x: auto; background: #ffffff; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 10px; }
    .tb-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
    .tb-table th, .tb-table td { padding: 12px 16px; border-bottom: 1px solid rgba(15, 23, 42, 0.06); }
    .tb-table th { background: rgba(15, 23, 42, 0.02); font-family: 'Lato', sans-serif; font-weight: 700; color: #1D78C4; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
    .tb-table tbody tr:hover { background: rgba(15, 23, 42, 0.02); }
    .tb-actions-cell { display: flex; gap: 8px; }
    .tb-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 600px) {
      .tb-form-row { grid-template-columns: 1fr; gap: 0; }
      .tb-header { flex-direction: column; align-items: flex-start; gap: 12px; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.innerHTML = css;
  document.head.appendChild(styleEl);

  let currentBookings = [];
  let editingBooking = null;
  let adminSelectedEmployee = '';

  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('wh_user') || 'null');
  }

  if (window.NWPortal) {
    window.NWPortal.register('Time Booking', renderInto);
  }

  function renderInto(container) {
    const user = getCurrentUser();
    if (!user) return;
    container.innerHTML = `<div class="tb-card" id="tbCard"></div>`;
    renderScreen();
  }

  function renderScreen() {
    const user = getCurrentUser();
    const card = document.getElementById('tbCard');
    if (!user || !card) return;
    if (user.role === 'admin') {
      renderAdminView(card);
    } else {
      renderUserView(card);
    }
  }

  // --- User view ---
  async function renderUserView(container) {
    const user = getCurrentUser();
    container.innerHTML = `
      <div class="tb-header">
        <div>
          <h2>Time Booking</h2>
          <p>Book your time against client projects.</p>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
        <button class="tb-btn-primary tb-btn-mini" id="tbAddBtn">New Booking</button>
      </div>
      <div class="tb-table-container">
        <table class="tb-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Client / Project</th>
              <th>Times</th>
              <th>Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="tbTableBody">
            <tr><td colspan="5" style="text-align: center; color: #7a9bbf; padding: 24px;">Loading bookings...</td></tr>
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('tbAddBtn').addEventListener('click', () => renderForm());

    await loadAndDisplayUserBookings();
  }

  async function loadAndDisplayUserBookings() {
    const user = getCurrentUser();
    try {
      const res = await fetch(`/api/timebookings?requesterId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        currentBookings = data.bookings || [];
        populateUserTable();
      }
    } catch (err) {
      console.error('Failed to fetch time bookings:', err);
    }
  }

  function populateUserTable() {
    const tbody = document.getElementById('tbTableBody');
    const todayStr = getTodayString();

    if (currentBookings.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #7a9bbf; padding: 24px;">No bookings yet. Add your first time booking!</td></tr>`;
      return;
    }

    const sorted = [...currentBookings].sort((a, b) => {
      const dateDiff = new Date(b.bookingDate) - new Date(a.bookingDate);
      if (dateDiff !== 0) return dateDiff;
      return b.startTime.localeCompare(a.startTime);
    });

    tbody.innerHTML = sorted.map(b => {
      const isToday = b.bookingDate === todayStr;
      const actions = isToday
        ? `<div class="tb-actions-cell">
             <button class="tb-btn-secondary tb-btn-mini" onclick="window.tbEdit('${b.id}')">Edit</button>
             <button class="tb-btn-danger" onclick="window.tbDelete('${b.id}')">Delete</button>
           </div>`
        : `<span style="color: #486080; font-style: italic;">Locked</span>`;

      return `
        <tr>
          <td>${formatDate(b.bookingDate)}</td>
          <td><strong>${escapeHtml(b.projectName)}</strong>${b.clientName ? `<div style="font-size: 11px; color: #7a9bbf; margin-top: 4px;">${escapeHtml(b.clientName)}</div>` : ''}</td>
          <td>${b.startTime} - ${b.endTime}</td>
          <td><strong>${b.totalHours.toFixed(2)} hrs</strong></td>
          <td>${actions}</td>
        </tr>
      `;
    }).join('');
  }

  // --- Admin view ---
  async function renderAdminView(container) {
    container.innerHTML = `
      <div class="tb-header">
        <div>
          <h2>Time Booking — Admin</h2>
          <p>Review time bookings across all employees.</p>
        </div>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; align-items: flex-end;">
        <div class="tb-form-group" style="margin-bottom: 0; flex: 1; min-width: 150px;">
          <label class="tb-label" for="tbFilterEmployee">Filter By Employee</label>
          <select class="tb-select" id="tbFilterEmployee">
            <option value="">All Employees</option>
          </select>
        </div>
        <button class="tb-btn-secondary" id="tbClearFilter" style="padding: 10px 14px;">Clear</button>
        <button class="tb-btn-primary tb-btn-mini" id="tbAddBtn">New Booking</button>
      </div>
      <div class="tb-table-container">
        <table class="tb-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Client / Project</th>
              <th>Times</th>
              <th>Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="tbAdminTableBody">
            <tr><td colspan="6" style="text-align: center; color: #7a9bbf; padding: 24px;">Loading bookings...</td></tr>
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('tbAddBtn').addEventListener('click', () => renderForm());

    const filterSelect = document.getElementById('tbFilterEmployee');
    await populateEmployeeFilter(filterSelect);

    filterSelect.addEventListener('change', () => {
      adminSelectedEmployee = filterSelect.value;
      fetchAndPopulateAdminBookings();
    });

    document.getElementById('tbClearFilter').addEventListener('click', () => {
      adminSelectedEmployee = '';
      filterSelect.value = '';
      fetchAndPopulateAdminBookings();
    });

    await fetchAndPopulateAdminBookings();
  }

  async function populateEmployeeFilter(selectEl) {
    const user = getCurrentUser();
    try {
      const res = await fetch(`/api/employees?requesterId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        (data.employees || []).forEach(emp => {
          const opt = document.createElement('option');
          opt.value = emp.username || emp.id;
          opt.textContent = emp.fullName;
          if (adminSelectedEmployee === opt.value) opt.selected = true;
          selectEl.appendChild(opt);
        });
      }
    } catch (err) {
      // Filter list is optional; ignore failures
    }
  }

  async function fetchAndPopulateAdminBookings() {
    const tbody = document.getElementById('tbAdminTableBody');
    if (!tbody) return;
    const user = getCurrentUser();

    let url = `/api/timebookings?requesterId=${user.id}`;
    if (adminSelectedEmployee) url += `&employeeId=${adminSelectedEmployee}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        currentBookings = data.bookings || [];
        if (currentBookings.length === 0) {
          tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #7a9bbf; padding: 24px;">No bookings match the current filter.</td></tr>`;
          return;
        }

        const sorted = [...currentBookings].sort((a, b) => {
          const dateDiff = new Date(b.bookingDate) - new Date(a.bookingDate);
          if (dateDiff !== 0) return dateDiff;
          return b.startTime.localeCompare(a.startTime);
        });

        tbody.innerHTML = sorted.map(b => `
          <tr>
            <td><strong>${escapeHtml(b.employeeName)}</strong><div style="font-size: 10px; color: #7a9bbf;">${escapeHtml(b.employeeId)}</div></td>
            <td>${formatDate(b.bookingDate)}</td>
            <td><strong>${escapeHtml(b.projectName)}</strong>${b.clientName ? `<div style="font-size: 11px; color: #7a9bbf; margin-top: 4px;">${escapeHtml(b.clientName)}</div>` : ''}</td>
            <td>${b.startTime} - ${b.endTime}</td>
            <td><strong>${b.totalHours.toFixed(2)} hrs</strong></td>
            <td>
              <div class="tb-actions-cell">
                <button class="tb-btn-secondary tb-btn-mini" onclick="window.tbEdit('${b.id}')">Edit</button>
                <button class="tb-btn-danger" onclick="window.tbDelete('${b.id}')">Delete</button>
              </div>
            </td>
          </tr>
        `).join('');
      }
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #ef4444; padding: 24px;">Failed to load bookings.</td></tr>`;
    }
  }

  // --- Booking form (add/edit) ---
  function renderForm(bookingToEdit = null) {
    editingBooking = bookingToEdit;
    const isEdit = !!bookingToEdit;
    const card = document.getElementById('tbCard');
    const b = bookingToEdit || {};

    card.innerHTML = `
      <div class="tb-header">
        <div>
          <h2>${isEdit ? 'Edit Booking' : 'New Time Booking'}</h2>
          <p>${isEdit ? "Modify this booking's details." : 'Book time against a client project.'}</p>
        </div>
        <button class="tb-btn-secondary tb-btn-mini" id="tbFormBackBtn">Back</button>
      </div>
      <div class="tb-alert" id="tbFormAlert"></div>
      <form id="tbForm">
        <div class="tb-form-row">
          <div class="tb-form-group">
            <label class="tb-label" for="tbDate">Date</label>
            <input class="tb-input" id="tbDate" type="date" value="${b.bookingDate || getTodayString()}" required>
          </div>
          <div class="tb-form-group">
            <label class="tb-label" for="tbClient">Client Name</label>
            <input class="tb-input" id="tbClient" type="text" value="${escapeHtml(b.clientName || '')}" placeholder="e.g. Acme Corp">
          </div>
        </div>
        <div class="tb-form-row">
          <div class="tb-form-group">
            <label class="tb-label" for="tbProject">Project Name</label>
            <input class="tb-input" id="tbProject" type="text" value="${escapeHtml(b.projectName || '')}" placeholder="e.g. FTTH Rollout Phase 2" required>
          </div>
          <div class="tb-form-group">
            <label class="tb-label" for="tbBillable">Billable</label>
            <select class="tb-select" id="tbBillable">
              <option value="true" ${b.billable !== false ? 'selected' : ''}>Yes</option>
              <option value="false" ${b.billable === false ? 'selected' : ''}>No</option>
            </select>
          </div>
        </div>
        <div class="tb-form-row">
          <div class="tb-form-group">
            <label class="tb-label" for="tbStart">Start Time</label>
            <input class="tb-input" id="tbStart" type="time" value="${b.startTime || ''}" required>
          </div>
          <div class="tb-form-group">
            <label class="tb-label" for="tbEnd">End Time</label>
            <input class="tb-input" id="tbEnd" type="time" value="${b.endTime || ''}" required>
          </div>
        </div>
        <div class="tb-form-group">
          <label class="tb-label" for="tbTaskDescription">Task Description (Optional)</label>
          <textarea class="tb-textarea" id="tbTaskDescription" placeholder="Describe the work performed...">${escapeHtml(b.taskDescription || '')}</textarea>
        </div>
        <div class="tb-form-group">
          <label class="tb-label" for="tbNotes">Notes (Optional)</label>
          <textarea class="tb-textarea" id="tbNotes">${escapeHtml(b.notes || '')}</textarea>
        </div>
        <div class="tb-footer">
          <button type="button" class="tb-btn-secondary" id="tbFormCancelBtn">Cancel</button>
          <button type="submit" class="tb-btn-primary">${isEdit ? 'Save Changes' : 'Save Booking'}</button>
        </div>
      </form>
    `;

    document.getElementById('tbFormBackBtn').addEventListener('click', goBack);
    document.getElementById('tbFormCancelBtn').addEventListener('click', goBack);
    document.getElementById('tbForm').addEventListener('submit', handleFormSubmit);

    function goBack() {
      editingBooking = null;
      renderScreen();
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const alertBox = document.getElementById('tbFormAlert');
    alertBox.style.display = 'none';
    const user = getCurrentUser();

    const startVal = document.getElementById('tbStart').value;
    const endVal = document.getElementById('tbEnd').value;

    if (toMinutes(endVal) <= toMinutes(startVal)) {
      alertBox.innerText = 'End Time must be greater than Start Time.';
      alertBox.style.display = 'block';
      return;
    }

    const payload = {
      requesterId: user.id,
      bookingDate: document.getElementById('tbDate').value,
      clientName: document.getElementById('tbClient').value.trim(),
      projectName: document.getElementById('tbProject').value.trim(),
      taskDescription: document.getElementById('tbTaskDescription').value.trim(),
      startTime: startVal,
      endTime: endVal,
      billable: document.getElementById('tbBillable').value === 'true',
      notes: document.getElementById('tbNotes').value.trim()
    };

    let method = 'POST';
    if (editingBooking) {
      payload.id = editingBooking.id;
      method = 'PUT';
    }

    try {
      const response = await fetch('/api/timebookings', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success) {
        editingBooking = null;
        renderScreen();
      } else {
        alertBox.innerText = data.message || 'Failed to save booking.';
        alertBox.style.display = 'block';
      }
    } catch (err) {
      alertBox.innerText = 'Network error occurred.';
      alertBox.style.display = 'block';
    }
  }

  window.tbEdit = function (id) {
    const booking = currentBookings.find(b => b.id === id);
    if (booking) renderForm(booking);
  };

  window.tbDelete = async function (id) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    const user = getCurrentUser();
    try {
      const res = await fetch(`/api/timebookings?requesterId=${user.id}&id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        renderScreen();
      } else {
        alert(data.message || 'Failed to delete booking.');
      }
    } catch (err) {
      alert('Network error. Failed to delete booking.');
    }
  };

  function toMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  function getTodayString() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
