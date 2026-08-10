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
    .tb-input, .tb-select { background: #f8fafc; border: 1px solid rgba(15, 23, 42, 0.12); border-radius: 8px; padding: 10px 14px; font-family: 'Inter', sans-serif; font-size: 14px; color: #0f172a; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
    .tb-input:focus, .tb-select:focus { border-color: #1D78C4; box-shadow: 0 0 0 3px rgba(29, 120, 196, 0.15); }
    .tb-input:disabled { background: rgba(15, 23, 42, 0.04); color: #94a3b8; }
    .tb-select option { background: #ffffff; color: #0f172a; }
    .tb-btn-primary { background: linear-gradient(135deg, #1D78C4 0%, #1562a8 100%); color: #fff; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 14px; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 16px rgba(29, 120, 196, 0.25); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease; }
    .tb-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(29, 120, 196, 0.35); }
    .tb-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
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
    .tb-table th, .tb-table td { padding: 10px 12px; border-bottom: 1px solid rgba(15, 23, 42, 0.06); }
    .tb-table th { background: rgba(15, 23, 42, 0.02); font-family: 'Lato', sans-serif; font-weight: 700; color: #1D78C4; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; }
    .tb-table tbody tr:hover { background: rgba(15, 23, 42, 0.02); }
    .tb-hour-input { width: 56px; text-align: center; padding: 6px 4px; }
    .tb-actions-cell { display: flex; gap: 6px; flex-wrap: wrap; }
    .tb-badge { font-family: 'Lato', sans-serif; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; padding: 3px 9px; border-radius: 20px; white-space: nowrap; }
    .tb-badge-pending { background: rgba(202, 138, 4, 0.12); color: #a16207; border: 1px solid rgba(202, 138, 4, 0.3); }
    .tb-badge-approved { background: rgba(22, 163, 74, 0.12); color: #16a34a; border: 1px solid rgba(22, 163, 74, 0.3); }
    .tb-badge-rejected { background: rgba(220, 38, 38, 0.12); color: #dc2626; border: 1px solid rgba(220, 38, 38, 0.3); }
    .tb-total { font-weight: 700; color: #0f172a; }
    .tb-toolbar { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; margin-bottom: 20px; }
    @media (max-width: 600px) {
      .tb-header { flex-direction: column; align-items: flex-start; gap: 12px; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.innerHTML = css;
  document.head.appendChild(styleEl);

  const DAYS = [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' }
  ];

  const ACTIVITIES = [
    { value: 'design', label: 'Design' },
    { value: 'deploy', label: 'Deploy' },
    { value: 'develop', label: 'Develop' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'testing', label: 'Testing' }
  ];

  let weekOptions = [];
  let selectedWeekIdx = 0;
  let currentEntries = [];

  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('wh_user') || 'null');
  }

  if (window.NWPortal) {
    window.NWPortal.register('Time Booking', renderInto);
  }

  function renderInto(container) {
    const user = getCurrentUser();
    if (!user) return;
    weekOptions = buildWeekOptions();
    selectedWeekIdx = 0;
    container.innerHTML = `<div class="tb-card" id="tbCard"></div>`;
    renderScreen();
  }

  function renderScreen() {
    const user = getCurrentUser();
    const card = document.getElementById('tbCard');
    if (!user || !card) return;
    if (window.NWAuth.isApprover(user)) {
      renderApproverView(card);
    } else {
      renderEmployeeView(card);
    }
  }

  // --- Week utilities ---
  function getMonday(d) {
    d = new Date(d);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function isoWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  }

  function fmtShortDate(d) {
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  }

  function toDateStr(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function buildWeekOptions() {
    const weeks = [];
    const thisMonday = getMonday(new Date());
    for (let i = 0; i < 6; i++) {
      const monday = new Date(thisMonday);
      monday.setDate(monday.getDate() - i * 7);
      const sunday = new Date(monday);
      sunday.setDate(sunday.getDate() + 6);
      const wk = isoWeekNumber(monday);
      const yy = String(sunday.getFullYear()).slice(-2);
      const label = `WK${String(wk).padStart(2, '0')} (${fmtShortDate(monday)} - ${fmtShortDate(sunday)} '${yy})`;
      weeks.push({
        weekStart: toDateStr(monday),
        weekEnd: toDateStr(sunday),
        label,
        monday
      });
    }
    return weeks;
  }

  function weekDayDates(monday) {
    return DAYS.map((d, idx) => {
      const dt = new Date(monday);
      dt.setDate(dt.getDate() + idx);
      return fmtShortDate(dt);
    });
  }

  function sumHours(hours) {
    return DAYS.reduce((sum, d) => sum + (parseFloat(hours && hours[d.key]) || 0), 0);
  }

  function activityLabel(value) {
    const a = ACTIVITIES.find(x => x.value === value);
    return a ? a.label : (value || '—');
  }

  function statusBadge(status) {
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return `<span class="tb-badge tb-badge-${status}">${label}</span>`;
  }

  // --- Employee view ---
  function renderEmployeeView(container) {
    const user = getCurrentUser();
    const week = weekOptions[selectedWeekIdx];

    container.innerHTML = `
      <div class="tb-header">
        <div>
          <h2>Time Booking</h2>
          <p>Log your hours for the week and submit for approval.</p>
        </div>
      </div>
      <div class="tb-toolbar">
        <div class="tb-form-group" style="margin-bottom: 0;">
          <label class="tb-label" for="tbWeekSelect">Week</label>
          <select class="tb-select" id="tbWeekSelect">
            ${weekOptions.map((w, idx) => `<option value="${idx}" ${idx === selectedWeekIdx ? 'selected' : ''}>${w.label}${idx === 0 ? ' — Current' : ''}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="tb-alert" id="tbAlert"></div>
      <div id="tbEntryContainer">Loading...</div>
    `;

    document.getElementById('tbWeekSelect').addEventListener('change', (e) => {
      selectedWeekIdx = parseInt(e.target.value, 10);
      renderScreen();
    });

    loadEmployeeEntry(week);
  }

  async function loadEmployeeEntry(week) {
    const user = getCurrentUser();
    const container = document.getElementById('tbEntryContainer');
    try {
      const [tsRes, meRes] = await Promise.all([
        fetch(`/api/timesheets?requesterId=${user.id}&weekStart=${week.weekStart}`),
        fetch(`/api/employees/me?requesterId=${user.id}`)
      ]);
      const tsData = await tsRes.json();
      const meData = await meRes.json();
      const entry = tsData.success && tsData.timesheets.length ? tsData.timesheets[0] : null;
      const profile = meData.success ? meData.employee : {};
      renderEmployeeEntryForm(container, user, week, entry, profile);
    } catch (err) {
      container.innerHTML = `<p style="color:#dc2626;">Network error loading your timesheet.</p>`;
    }
  }

  function renderEmployeeEntryForm(container, user, week, entry, profile) {
    const dayDates = weekDayDates(week.monday);
    const locked = entry && entry.status === 'approved';
    const hours = entry ? entry.hours : {};
    const activity = entry ? entry.activity : '';
    const projectName = entry ? entry.projectName : ((profile && profile.projectName) || '');
    const projectCode = entry ? entry.projectCode : ((profile && profile.projectCode) || '');

    container.innerHTML = `
      <div class="tb-table-container">
        <table class="tb-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Project</th>
              <th>Code</th>
              ${DAYS.map((d, i) => `<th>${d.label}<br>${dayDates[i]}</th>`).join('')}
              <th>Total</th>
              <th>Activity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${escapeHtml(user.name)}</td>
              <td id="tbProjectName">${escapeHtml(projectName) || '<span style="color:#94a3b8;">Not assigned</span>'}</td>
              <td id="tbProjectCode">${escapeHtml(projectCode) || '—'}</td>
              ${DAYS.map(d => `<td><input class="tb-input tb-hour-input" type="number" min="0" max="24" step="0.5" id="tbHour_${d.key}" value="${hours[d.key] || 0}" ${locked ? 'disabled' : ''}></td>`).join('')}
              <td class="tb-total" id="tbTotalHours">${sumHours(hours).toFixed(1)}</td>
              <td>
                <select class="tb-select" id="tbActivity" ${locked ? 'disabled' : ''}>
                  <option value="">Select...</option>
                  ${ACTIVITIES.map(a => `<option value="${a.value}" ${a.value === activity ? 'selected' : ''}>${a.label}</option>`).join('')}
                </select>
              </td>
              <td>${entry ? statusBadge(entry.status) : '<span style="color:#94a3b8; font-size: 11px;">Not submitted</span>'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="tb-footer">
        <button class="tb-btn-primary" id="tbSubmitBtn" ${locked ? 'disabled' : ''}>${locked ? 'Approved — Locked' : 'Submit for Approval'}</button>
      </div>
    `;

    DAYS.forEach(d => {
      const input = document.getElementById(`tbHour_${d.key}`);
      if (input) input.addEventListener('input', updateTotal);
    });

    function updateTotal() {
      const h = {};
      DAYS.forEach(d => { h[d.key] = document.getElementById(`tbHour_${d.key}`).value; });
      document.getElementById('tbTotalHours').textContent = sumHours(h).toFixed(1);
    }

    if (!locked) {
      document.getElementById('tbSubmitBtn').addEventListener('click', () => submitEmployeeEntry(week));
    }
  }

  async function submitEmployeeEntry(week) {
    const user = getCurrentUser();
    const alertBox = document.getElementById('tbAlert');
    alertBox.style.display = 'none';

    const activity = document.getElementById('tbActivity').value;
    if (!activity) {
      alertBox.innerText = 'Please select an activity type.';
      alertBox.style.display = 'block';
      return;
    }

    const hours = {};
    DAYS.forEach(d => { hours[d.key] = document.getElementById(`tbHour_${d.key}`).value; });

    try {
      const res = await fetch('/api/timesheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterId: user.id, weekStart: week.weekStart, weekEnd: week.weekEnd, hours, activity })
      });
      const data = await res.json();
      if (data.success) {
        renderScreen();
      } else {
        alertBox.innerText = data.message || 'Failed to submit timesheet.';
        alertBox.style.display = 'block';
      }
    } catch (err) {
      alertBox.innerText = 'Network error occurred.';
      alertBox.style.display = 'block';
    }
  }

  // --- Approver view ---
  function renderApproverView(container) {
    const week = weekOptions[selectedWeekIdx];

    container.innerHTML = `
      <div class="tb-header">
        <div>
          <h2>Time Booking — Approvals</h2>
          <p>Review, edit, and approve weekly timesheets across all employees.</p>
        </div>
      </div>
      <div class="tb-toolbar">
        <div class="tb-form-group" style="margin-bottom: 0;">
          <label class="tb-label" for="tbWeekSelect">Week</label>
          <select class="tb-select" id="tbWeekSelect">
            ${weekOptions.map((w, idx) => `<option value="${idx}" ${idx === selectedWeekIdx ? 'selected' : ''}>${w.label}${idx === 0 ? ' — Current' : ''}</option>`).join('')}
          </select>
        </div>
        <button class="tb-btn-secondary tb-btn-mini" id="tbAddForEmployeeBtn">Add / Edit for Employee</button>
      </div>
      <div class="tb-alert" id="tbAlert"></div>
      <div id="tbApproverBody">Loading...</div>
    `;

    document.getElementById('tbWeekSelect').addEventListener('change', (e) => {
      selectedWeekIdx = parseInt(e.target.value, 10);
      renderScreen();
    });
    document.getElementById('tbAddForEmployeeBtn').addEventListener('click', () => openEmployeePicker(week));

    loadApproverEntries(week);
  }

  async function loadApproverEntries(week) {
    const user = getCurrentUser();
    const body = document.getElementById('tbApproverBody');
    try {
      const res = await fetch(`/api/timesheets?requesterId=${user.id}&weekStart=${week.weekStart}`);
      const data = await res.json();
      if (!data.success) {
        body.innerHTML = `<p style="color:#dc2626;">${escapeHtml(data.message || 'Failed to load timesheets.')}</p>`;
        return;
      }
      currentEntries = data.timesheets || [];
      renderApproverTable(body, week);
    } catch (err) {
      body.innerHTML = `<p style="color:#dc2626;">Network error loading timesheets.</p>`;
    }
  }

  function renderApproverTable(body, week) {
    if (currentEntries.length === 0) {
      body.innerHTML = `<p style="color:#7a9bbf;">No timesheets submitted for this week yet.</p>`;
      return;
    }
    const dayDates = weekDayDates(week.monday);
    body.innerHTML = `
      <div class="tb-table-container">
        <table class="tb-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Project</th>
              <th>Code</th>
              ${DAYS.map((d, i) => `<th>${d.label}<br>${dayDates[i]}</th>`).join('')}
              <th>Total</th>
              <th>Activity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${currentEntries.map(e => `
              <tr>
                <td><strong>${escapeHtml(e.employeeName)}</strong><div style="font-size: 10px; color: #7a9bbf;">${escapeHtml(e.employeeId)}</div></td>
                <td>${escapeHtml(e.projectName) || '—'}</td>
                <td>${escapeHtml(e.projectCode) || '—'}</td>
                ${DAYS.map(d => `<td>${(e.hours && e.hours[d.key]) || 0}</td>`).join('')}
                <td class="tb-total">${sumHours(e.hours).toFixed(1)}</td>
                <td>${escapeHtml(activityLabel(e.activity))}</td>
                <td>${statusBadge(e.status)}</td>
                <td>
                  <div class="tb-actions-cell">
                    <button class="tb-btn-secondary tb-btn-mini" onclick="window.tbEditEntry('${e.id}')">Edit</button>
                    ${e.status !== 'approved' ? `<button class="tb-btn-secondary tb-btn-mini" onclick="window.tbSetStatus('${e.id}','approved')">Approve</button>` : ''}
                    ${e.status !== 'rejected' ? `<button class="tb-btn-danger" onclick="window.tbSetStatus('${e.id}','rejected')">Reject</button>` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  window.tbSetStatus = async function (id, status) {
    const user = getCurrentUser();
    try {
      const res = await fetch('/api/timesheets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterId: user.id, id, status })
      });
      const data = await res.json();
      if (data.success) {
        renderScreen();
      } else {
        alert(data.message || 'Failed to update status.');
      }
    } catch (err) {
      alert('Network error. Failed to update status.');
    }
  };

  window.tbEditEntry = function (id) {
    const entry = currentEntries.find(e => e.id === id);
    if (entry) openApproverEditForm(entry);
  };

  function openApproverEditForm(entry) {
    const card = document.getElementById('tbCard');
    const week = weekOptions[selectedWeekIdx];
    const dayDates = weekDayDates(week.monday);

    card.innerHTML = `
      <div class="tb-header">
        <div>
          <h2>Edit Timesheet — ${escapeHtml(entry.employeeName)}</h2>
          <p>${week ? escapeHtml(week.label) : ''}</p>
        </div>
        <button class="tb-btn-secondary tb-btn-mini" id="tbBackBtn">Back</button>
      </div>
      <div class="tb-alert" id="tbAlert"></div>
      <div class="tb-table-container">
        <table class="tb-table">
          <thead>
            <tr>
              ${DAYS.map((d, i) => `<th>${d.label}<br>${dayDates[i]}</th>`).join('')}
              <th>Total</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              ${DAYS.map(d => `<td><input class="tb-input tb-hour-input" type="number" min="0" max="24" step="0.5" id="tbEditHour_${d.key}" value="${(entry.hours && entry.hours[d.key]) || 0}"></td>`).join('')}
              <td class="tb-total" id="tbEditTotal">${sumHours(entry.hours).toFixed(1)}</td>
              <td>
                <select class="tb-select" id="tbEditActivity">
                  ${ACTIVITIES.map(a => `<option value="${a.value}" ${a.value === entry.activity ? 'selected' : ''}>${a.label}</option>`).join('')}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="tb-footer">
        <button class="tb-btn-secondary" id="tbEditCancelBtn">Cancel</button>
        <button class="tb-btn-primary" id="tbEditSaveBtn">Save Changes</button>
      </div>
    `;

    DAYS.forEach(d => {
      document.getElementById(`tbEditHour_${d.key}`).addEventListener('input', () => {
        const h = {};
        DAYS.forEach(dd => { h[dd.key] = document.getElementById(`tbEditHour_${dd.key}`).value; });
        document.getElementById('tbEditTotal').textContent = sumHours(h).toFixed(1);
      });
    });

    document.getElementById('tbBackBtn').addEventListener('click', renderScreen);
    document.getElementById('tbEditCancelBtn').addEventListener('click', renderScreen);
    document.getElementById('tbEditSaveBtn').addEventListener('click', async () => {
      const user = getCurrentUser();
      const alertBox = document.getElementById('tbAlert');
      alertBox.style.display = 'none';
      const hours = {};
      DAYS.forEach(d => { hours[d.key] = document.getElementById(`tbEditHour_${d.key}`).value; });
      const activity = document.getElementById('tbEditActivity').value;

      try {
        const res = await fetch('/api/timesheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requesterId: user.id, employeeId: entry.employeeId, weekStart: entry.weekStart, weekEnd: entry.weekEnd, hours, activity })
        });
        const data = await res.json();
        if (data.success) {
          renderScreen();
        } else {
          alertBox.innerText = data.message || 'Failed to save.';
          alertBox.style.display = 'block';
        }
      } catch (err) {
        alertBox.innerText = 'Network error occurred.';
        alertBox.style.display = 'block';
      }
    });
  }

  async function openEmployeePicker(week) {
    const user = getCurrentUser();
    const card = document.getElementById('tbCard');
    card.innerHTML = `
      <div class="tb-header">
        <div>
          <h2>Add / Edit Timesheet</h2>
          <p>${escapeHtml(week.label)}</p>
        </div>
        <button class="tb-btn-secondary tb-btn-mini" id="tbBackBtn">Back</button>
      </div>
      <div class="tb-form-group">
        <label class="tb-label" for="tbEmployeePick">Employee</label>
        <select class="tb-select" id="tbEmployeePick">
          <option value="">Loading employees...</option>
        </select>
      </div>
    `;
    document.getElementById('tbBackBtn').addEventListener('click', renderScreen);

    try {
      const res = await fetch(`/api/employees/projects?requesterId=${user.id}`);
      const data = await res.json();
      const select = document.getElementById('tbEmployeePick');
      if (data.success) {
        select.innerHTML = '<option value="">Select employee...</option>' +
          data.employees.filter(e => e.username).map(e => `<option value="${escapeHtml(e.username)}">${escapeHtml(e.fullName)}</option>`).join('');
        select.addEventListener('change', () => {
          if (!select.value) return;
          const existing = currentEntries.find(e => e.employeeId === select.value && e.weekStart === week.weekStart);
          if (existing) {
            openApproverEditForm(existing);
          } else {
            const emp = data.employees.find(e => e.username === select.value);
            openApproverNewEntryForm(week, emp);
          }
        });
      } else {
        select.innerHTML = `<option value="">${escapeHtml(data.message || 'Failed to load employees')}</option>`;
      }
    } catch (err) {
      document.getElementById('tbEmployeePick').innerHTML = '<option value="">Network error</option>';
    }
  }

  function openApproverNewEntryForm(week, emp) {
    const blankEntry = {
      id: null,
      employeeId: emp.username,
      employeeName: emp.fullName,
      projectName: emp.projectName,
      projectCode: emp.projectCode,
      weekStart: week.weekStart,
      weekEnd: week.weekEnd,
      hours: {},
      activity: ACTIVITIES[0].value,
      status: 'pending'
    };
    openApproverEditForm(blankEntry);
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
