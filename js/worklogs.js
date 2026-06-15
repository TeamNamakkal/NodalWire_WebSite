(function () {
  // --- CSS Injections ---
  const css = `
    /* Header Login Button */
    .wh-btn {
      cursor: pointer;
    }
    .wh-nav-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    /* Modal Overlay */
    .wh-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(4, 9, 17, 0.82);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 10001;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .wh-overlay.open {
      display: flex;
      opacity: 1;
    }

    /* Modal Card */
    .wh-card {
      background: rgba(7, 16, 31, 0.95);
      border: 1px solid rgba(29, 120, 196, 0.22);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      width: 92%;
      max-width: 720px;
      max-height: 85vh;
      overflow-y: auto;
      padding: 32px;
      color: #eef4ff;
      font-family: 'Inter', sans-serif;
      transform: scale(0.92) translateY(10px);
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .wh-overlay.open .wh-card {
      transform: scale(1) translateY(0);
    }

    /* Scrollbar */
    .wh-card::-webkit-scrollbar {
      width: 6px;
    }
    .wh-card::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
    }
    .wh-card::-webkit-scrollbar-thumb {
      background: rgba(29, 120, 196, 0.3);
      border-radius: 3px;
    }
    .wh-card::-webkit-scrollbar-thumb:hover {
      background: rgba(29, 120, 196, 0.5);
    }

    /* Typography & Core Styles */
    .wh-card h2, .wh-card h3 {
      font-family: 'Lato', sans-serif;
      font-weight: 700;
      color: #eef4ff;
      letter-spacing: -0.02em;
    }
    .wh-card h2 { font-size: 24px; margin-bottom: 8px; }
    .wh-card h3 { font-size: 18px; margin-bottom: 16px; }
    .wh-card p {
      font-size: 14px;
      color: #7a9bbf;
      line-height: 1.6;
    }

    /* Inputs & Forms */
    .wh-form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }
    .wh-label {
      font-family: 'Lato', sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: #1D78C4;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .wh-input, .wh-select, .wh-textarea {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 10px 14px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: #eef4ff;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .wh-input:focus, .wh-select:focus, .wh-textarea:focus {
      border-color: #1D78C4;
      box-shadow: 0 0 0 3px rgba(29, 120, 196, 0.2);
    }
    .wh-textarea {
      resize: vertical;
      min-height: 80px;
    }
    .wh-select option {
      background: #07101f;
      color: #eef4ff;
    }

    /* Buttons inside modal */
    .wh-btn-primary {
      background: linear-gradient(135deg, #1D78C4 0%, #1562a8 100%);
      color: #fff;
      font-family: 'Lato', sans-serif;
      font-weight: 700;
      font-size: 14px;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(29, 120, 196, 0.25);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
    }
    .wh-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(29, 120, 196, 0.4);
    }
    .wh-btn-secondary {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #eef4ff;
      font-family: 'Lato', sans-serif;
      font-weight: 700;
      font-size: 14px;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.15s ease;
    }
    .wh-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }
    .wh-btn-danger {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #ef4444;
      font-family: 'Lato', sans-serif;
      font-weight: 700;
      font-size: 13px;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .wh-btn-danger:hover {
      background: rgba(239, 68, 68, 0.25);
    }
    .wh-btn-mini {
      padding: 6px 12px;
      font-size: 13px;
      border-radius: 6px;
    }

    /* Layout structure */
    .wh-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .wh-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 16px;
      margin-top: 24px;
    }
    .wh-stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .wh-stat-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }
    .wh-stat-val {
      font-family: 'Lato', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #1D78C4;
      margin-top: 6px;
    }
    .wh-alert {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.25);
      border-radius: 8px;
      padding: 12px;
      color: #fca5a5;
      font-size: 13px;
      margin-bottom: 16px;
      display: none;
    }

    /* Tabs */
    .wh-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 8px;
    }
    .wh-tab {
      background: none;
      border: none;
      color: #7a9bbf;
      font-family: 'Lato', sans-serif;
      font-weight: 700;
      font-size: 14px;
      padding: 6px 12px;
      cursor: pointer;
      position: relative;
    }
    .wh-tab.active {
      color: #eef4ff;
    }
    .wh-tab.active::after {
      content: '';
      position: absolute;
      bottom: -9px;
      left: 0;
      right: 0;
      height: 2px;
      background: #1D78C4;
    }

    /* Logs list / Table styling */
    .wh-table-container {
      overflow-x: auto;
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
    }
    .wh-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }
    .wh-table th, .wh-table td {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .wh-table th {
      background: rgba(255, 255, 255, 0.02);
      font-family: 'Lato', sans-serif;
      font-weight: 700;
      color: #1D78C4;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.05em;
    }
    .wh-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.02);
    }
    .wh-actions-cell {
      display: flex;
      gap: 8px;
    }

    /* Responsive grid styles */
    .wh-form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    @media (max-width: 600px) {
      .wh-form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
      .wh-stats-grid {
        grid-template-columns: 1fr;
      }
      .wh-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      .wh-header .wh-btn-secondary {
        align-self: flex-end;
      }
    }
  `;

  // Inject Stylesheet
  const styleEl = document.createElement('style');
  styleEl.innerHTML = css;
  document.head.appendChild(styleEl);

  // --- HTML Elements Setup ---
  // Create Header Login Button
  const btn = document.createElement('a');
  btn.href = '#';
  btn.className = 'nav-cta wh-btn';
  btn.textContent = 'Employee Login';

  const navCta = document.querySelector('.nav-cta');
  if (navCta && navCta.parentNode) {
    const navActions = document.createElement('div');
    navActions.className = 'wh-nav-actions';
    navCta.parentNode.insertBefore(navActions, navCta);
    navActions.appendChild(btn);
    navActions.appendChild(navCta);
  } else {
    document.body.appendChild(btn);
  }

  // Create Modal Overlay & Card
  const overlay = document.createElement('div');
  overlay.className = 'wh-overlay';
  overlay.innerHTML = `
    <div class="wh-card" id="whCard">
      <!-- Content will be injected dynamically based on screen state -->
    </div>
  `;
  document.body.appendChild(overlay);

  // --- State Variables ---
  let currentUser = JSON.parse(localStorage.getItem('wh_user') || 'null');
  let currentLogs = [];
  let editingLog = null; // Stored log when editing

  // Close modal when clicking outside card
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Open modal click handler
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  function openModal() {
    overlay.classList.add('open');
    renderScreen();
  }

  function closeModal() {
    overlay.classList.remove('open');
  }

  // --- Screen Router & Renderer ---
  function renderScreen() {
    const card = document.getElementById('whCard');
    if (!currentUser) {
      renderLogin(card);
    } else if (currentUser.role === 'admin') {
      renderAdminDashboard(card);
    } else {
      renderUserDashboard(card);
    }
  }

  // --- 1. LOGIN SCREEN ---
  function renderLogin(container) {
    container.innerHTML = `
      <div class="wh-header">
        <div>
          <h2>Work Hours Tracker</h2>
          <p>Please authenticate to access your logs.</p>
        </div>
        <button class="wh-btn-secondary wh-btn-mini" id="whCloseBtn">Close</button>
      </div>
      <div class="wh-alert" id="whLoginAlert"></div>
      <form id="whLoginForm">
        <div class="wh-form-group">
          <label class="wh-label" for="whUsername">Username</label>
          <input class="wh-input" id="whUsername" type="text" required placeholder="Username" value="" autocomplete="off">
        </div>
        <div class="wh-form-group">
          <label class="wh-label" for="whPassword">Password</label>
          <input class="wh-input" id="whPassword" type="password" required placeholder="Password" value="" autocomplete="off">
        </div>
        <div class="wh-footer">
          <button type="button" class="wh-btn-secondary" id="whLoginCloseBtn">Close</button>
          <button type="submit" class="wh-btn-primary">Login</button>
        </div>
      </form>
    `;

    document.getElementById('whCloseBtn').addEventListener('click', closeModal);
    document.getElementById('whLoginCloseBtn').addEventListener('click', closeModal);
    document.getElementById('whLoginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('whUsername').value.trim();
      const passwordInput = document.getElementById('whPassword').value;
      const alertBox = document.getElementById('whLoginAlert');

      alertBox.style.display = 'none';

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
        const data = await response.json();

        if (data.success) {
          currentUser = data.user;
          localStorage.setItem('wh_user', JSON.stringify(currentUser));
          renderScreen();
        } else {
          alertBox.innerText = data.message || 'Verification failed.';
          alertBox.style.display = 'block';
        }
      } catch (err) {
        alertBox.innerText = 'Network error. Please try again.';
        alertBox.style.display = 'block';
      }
    });
  }

  // --- 2. USER DASHBOARD SCREEN ---
  async function renderUserDashboard(container) {
    container.innerHTML = `
      <div class="wh-header">
        <div>
          <h2>Welcome, ${currentUser.name}</h2>
          <p>Log and manage your daily network engineering tasks.</p>
        </div>
        <button class="wh-btn-secondary wh-btn-mini" id="whLogoutBtn">Log Out</button>
      </div>
      
      <div class="wh-stats-grid">
        <div class="wh-stat-card">
          <div class="wh-label">Today's Hours</div>
          <div class="wh-stat-val" id="whTodayHours">0.0</div>
        </div>
        <div class="wh-stat-card">
          <div class="wh-label">This Week's Hours</div>
          <div class="wh-stat-val" id="whWeekHours">0.0</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3>Recent Entries</h3>
        <button class="wh-btn-primary wh-btn-mini" id="whQuickAddBtn">Quick Add Entry</button>
      </div>

      <div class="wh-table-container">
        <table class="wh-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Task / Project</th>
              <th>Times</th>
              <th>Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="whLogsTableBody">
            <tr>
              <td colspan="5" style="text-align: center; color: #7a9bbf; padding: 24px;">Retrieving logs...</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('whLogoutBtn').addEventListener('click', handleLogout);
    document.getElementById('whQuickAddBtn').addEventListener('click', () => renderWorkForm());

    await loadAndDisplayUserLogs();
  }

  async function loadAndDisplayUserLogs() {
    try {
      const res = await fetch(`/api/worklogs?requesterId=${currentUser.id}`);
      const data = await res.json();
      if (data.success) {
        currentLogs = data.logs || [];
        calculateUserStats();
        populateUserLogsTable();
      }
    } catch (err) {
      console.error('Failed to fetch user logs:', err);
    }
  }

  function calculateUserStats() {
    const todayStr = getTodayString();
    
    // Calculate Today's hours
    const todayHours = currentLogs
      .filter(l => l.date === todayStr)
      .reduce((sum, l) => sum + l.totalHours, 0);

    // Calculate Week's hours (Sunday - Saturday)
    const refD = new Date();
    const startOfWeek = new Date(refD);
    startOfWeek.setDate(refD.getDate() - refD.getDay());
    startOfWeek.setHours(0,0,0,0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23,59,59,999);

    const weekHours = currentLogs
      .filter(l => {
        const logD = new Date(l.date);
        return logD >= startOfWeek && logD <= endOfWeek;
      })
      .reduce((sum, l) => sum + l.totalHours, 0);

    document.getElementById('whTodayHours').innerText = todayHours.toFixed(1);
    document.getElementById('whWeekHours').innerText = weekHours.toFixed(1);
  }

  function populateUserLogsTable() {
    const tbody = document.getElementById('whLogsTableBody');
    const todayStr = getTodayString();

    if (currentLogs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #7a9bbf; padding: 24px;">No log entries found. Start adding your work hours!</td>
        </tr>
      `;
      return;
    }

    // Sort by date desc, then startTime desc
    const sorted = [...currentLogs].sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;
      return b.startTime.localeCompare(a.startTime);
    });

    tbody.innerHTML = sorted.map(log => {
      const isToday = log.date === todayStr;
      const actions = isToday 
        ? `<div class="wh-actions-cell">
             <button class="wh-btn-secondary wh-btn-mini" onclick="window.whEditLog('${log.id}')">Edit</button>
             <button class="wh-btn-danger" onclick="window.whDeleteLog('${log.id}')">Delete</button>
           </div>`
        : `<span style="color: #486080; font-style: italic;">Locked</span>`;

      return `
        <tr>
          <td>${formatDate(log.date)}</td>
          <td><strong>${escapeHtml(log.taskName)}</strong>${log.notes ? `<div style="font-size: 11px; color: #7a9bbf; margin-top: 4px;">${escapeHtml(log.notes)}</div>` : ''}</td>
          <td>${log.startTime} - ${log.endTime}</td>
          <td><strong>${log.totalHours.toFixed(2)} hrs</strong></td>
          <td>${actions}</td>
        </tr>
      `;
    }).join('');
  }

  // --- 3. WORK ENTRY FORM SCREEN (ADD / EDIT) ---
  function renderWorkForm(logToEdit = null) {
    editingLog = logToEdit;
    const isEdit = !!logToEdit;
    const card = document.getElementById('whCard');

    const defaultDate = isEdit ? logToEdit.date : getTodayString();
    const defaultTask = isEdit ? logToEdit.taskName : '';
    const defaultStart = isEdit ? logToEdit.startTime : '';
    const defaultEnd = isEdit ? logToEdit.endTime : '';
    const defaultNotes = isEdit ? logToEdit.notes : '';

    card.innerHTML = `
      <div class="wh-header">
        <div>
          <h2>${isEdit ? 'Edit Work Entry' : 'Log Work Hours'}</h2>
          <p>${isEdit ? 'Modify your selected log entry details.' : 'Provide details of your work logs.'}</p>
        </div>
        <button class="wh-btn-secondary wh-btn-mini" id="whFormCancelTopBtn">Back</button>
      </div>

      <div class="wh-alert" id="whFormAlert"></div>

      <form id="whWorkForm">
        <div class="wh-form-row">
          <div class="wh-form-group">
            <label class="wh-label" for="whLogDate">Date</label>
            <input class="wh-input" id="whLogDate" type="date" value="${defaultDate}" required ${currentUser.role !== 'admin' && isEdit ? 'disabled' : ''}>
          </div>
          <div class="wh-form-group">
            <label class="wh-label" for="whLogTask">Task / Project Name</label>
            <input class="wh-input" id="whLogTask" type="text" placeholder="e.g. Optical Ring Configuration" value="${escapeHtml(defaultTask)}" required>
          </div>
        </div>

        <div class="wh-form-row">
          <div class="wh-form-group">
            <label class="wh-label" for="whLogStart">Start Time</label>
            <input class="wh-input" id="whLogStart" type="time" value="${defaultStart}" required>
          </div>
          <div class="wh-form-group">
            <label class="wh-label" for="whLogEnd">End Time</label>
            <input class="wh-input" id="whLogEnd" type="time" value="${defaultEnd}" required>
          </div>
        </div>

        <div class="wh-form-group">
          <label class="wh-label" for="whLogNotes">Notes (Optional)</label>
          <textarea class="wh-textarea" id="whLogNotes" placeholder="Provide any additional details or outcomes...">${escapeHtml(defaultNotes)}</textarea>
        </div>

        <div class="wh-footer">
          <button type="button" class="wh-btn-secondary" id="whFormCancelBtn">Cancel</button>
          <button type="submit" class="wh-btn-primary">${isEdit ? 'Save Changes' : 'Save Entry'}</button>
        </div>
      </form>
    `;

    document.getElementById('whFormCancelTopBtn').addEventListener('click', goBack);
    document.getElementById('whFormCancelBtn').addEventListener('click', goBack);
    document.getElementById('whWorkForm').addEventListener('submit', handleFormSubmit);

    function goBack() {
      editingLog = null;
      renderScreen();
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const alertBox = document.getElementById('whFormAlert');
    alertBox.style.display = 'none';

    const dateVal = document.getElementById('whLogDate').value;
    const taskVal = document.getElementById('whLogTask').value.trim();
    const startVal = document.getElementById('whLogStart').value;
    const endVal = document.getElementById('whLogEnd').value;
    const notesVal = document.getElementById('whLogNotes').value.trim();

    // Frontend validations
    const startMin = toMinutes(startVal);
    const endMin = toMinutes(endVal);

    if (endMin <= startMin) {
      alertBox.innerText = 'End Time must be greater than Start Time.';
      alertBox.style.display = 'block';
      return;
    }

    const payload = {
      requesterId: currentUser.id,
      date: dateVal,
      taskName: taskVal,
      startTime: startVal,
      endTime: endVal,
      notes: notesVal
    };

    let url = '/api/worklogs';
    let method = 'POST';

    if (editingLog) {
      payload.id = editingLog.id;
      method = 'PUT';
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success) {
        editingLog = null;
        renderScreen();
      } else {
        alertBox.innerText = data.message || 'Failed to save work entry.';
        alertBox.style.display = 'block';
      }
    } catch (err) {
      alertBox.innerText = 'Network error occurred.';
      alertBox.style.display = 'block';
    }
  }

  // --- 4. ADMIN DASHBOARD SCREEN ---
  let adminSelectedUser = '';
  let adminSelectedDate = '';
  let adminActiveTab = 'logs'; // 'logs' or 'export'

  async function renderAdminDashboard(container) {
    container.innerHTML = `
      <div class="wh-header">
        <div>
          <h2>Admin Control Center</h2>
          <p>Review organization work records and generate analytics reports.</p>
        </div>
        <button class="wh-btn-secondary wh-btn-mini" id="whLogoutBtn">Log Out</button>
      </div>

      <div class="wh-tabs">
        <button class="wh-tab ${adminActiveTab === 'logs' ? 'active' : ''}" id="whTabLogs">All Worklogs</button>
        <button class="wh-tab ${adminActiveTab === 'export' ? 'active' : ''}" id="whTabExport">Export Reports</button>
      </div>

      <div id="whAdminTabContent"></div>
    `;

    document.getElementById('whLogoutBtn').addEventListener('click', handleLogout);
    
    const logsTabBtn = document.getElementById('whTabLogs');
    const exportTabBtn = document.getElementById('whTabExport');

    logsTabBtn.addEventListener('click', () => {
      adminActiveTab = 'logs';
      logsTabBtn.classList.add('active');
      exportTabBtn.classList.remove('active');
      loadAdminLogsView();
    });

    exportTabBtn.addEventListener('click', () => {
      adminActiveTab = 'export';
      exportTabBtn.classList.add('active');
      logsTabBtn.classList.remove('active');
      loadAdminExportView();
    });

    if (adminActiveTab === 'logs') {
      loadAdminLogsView();
    } else {
      loadAdminExportView();
    }
  }

  async function loadAdminLogsView() {
    const container = document.getElementById('whAdminTabContent');
    container.innerHTML = `
      <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; align-items: flex-end;">
        <div class="wh-form-group" style="margin-bottom: 0; flex: 1; min-width: 150px;">
          <label class="wh-label" for="whAdminFilterUser">Filter By User</label>
          <select class="wh-select" id="whAdminFilterUser">
            <option value="">All Users</option>
            <option value="surendran" ${adminSelectedUser === 'surendran' ? 'selected' : ''}>Surendran Natarajan</option>
            <option value="theepan" ${adminSelectedUser === 'theepan' ? 'selected' : ''}>Theepan SS</option>
            <option value="sampritha" ${adminSelectedUser === 'sampritha' ? 'selected' : ''}>Sampritha Sureshkumar</option>
          </select>
        </div>
        <div class="wh-form-group" style="margin-bottom: 0; flex: 1; min-width: 150px;">
          <label class="wh-label" for="whAdminFilterDate">Filter By Date</label>
          <input class="wh-input" id="whAdminFilterDate" type="date" value="${adminSelectedDate}">
        </div>
        <button class="wh-btn-secondary" id="whAdminClearFilters" style="padding: 10px 14px;">Clear</button>
      </div>

      <div class="wh-table-container">
        <table class="wh-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>Task / Project</th>
              <th>Times</th>
              <th>Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="whAdminTableBody">
            <tr>
              <td colspan="6" style="text-align: center; color: #7a9bbf; padding: 24px;">Fetching work records...</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    const userSelect = document.getElementById('whAdminFilterUser');
    const dateInput = document.getElementById('whAdminFilterDate');
    const clearBtn = document.getElementById('whAdminClearFilters');

    userSelect.addEventListener('change', () => {
      adminSelectedUser = userSelect.value;
      fetchAndPopulateAdminLogs();
    });

    dateInput.addEventListener('change', () => {
      adminSelectedDate = dateInput.value;
      fetchAndPopulateAdminLogs();
    });

    clearBtn.addEventListener('click', () => {
      adminSelectedUser = '';
      adminSelectedDate = '';
      userSelect.value = '';
      dateInput.value = '';
      fetchAndPopulateAdminLogs();
    });

    await fetchAndPopulateAdminLogs();
  }

  async function fetchAndPopulateAdminLogs() {
    const tbody = document.getElementById('whAdminTableBody');
    if (!tbody) return;

    let url = `/api/worklogs?requesterId=${currentUser.id}`;
    if (adminSelectedUser) url += `&userId=${adminSelectedUser}`;
    if (adminSelectedDate) url += `&date=${adminSelectedDate}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        const logs = data.logs || [];
        if (logs.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="6" style="text-align: center; color: #7a9bbf; padding: 24px;">No records match the current filters.</td>
            </tr>
          `;
          return;
        }

        // Sort by date desc, then user, then startTime desc
        const sorted = [...logs].sort((a, b) => {
          const dateDiff = new Date(b.date) - new Date(a.date);
          if (dateDiff !== 0) return dateDiff;
          const userDiff = a.userName.localeCompare(b.userName);
          if (userDiff !== 0) return userDiff;
          return b.startTime.localeCompare(a.startTime);
        });

        tbody.innerHTML = sorted.map(log => `
          <tr>
            <td><strong>${escapeHtml(log.userName)}</strong><div style="font-size: 10px; color: #7a9bbf;">${escapeHtml(log.userId)}</div></td>
            <td>${formatDate(log.date)}</td>
            <td><strong>${escapeHtml(log.taskName)}</strong>${log.notes ? `<div style="font-size: 11px; color: #7a9bbf; margin-top: 4px;">${escapeHtml(log.notes)}</div>` : ''}</td>
            <td>${log.startTime} - ${log.endTime}</td>
            <td><strong>${log.totalHours.toFixed(2)} hrs</strong></td>
            <td>
              <div class="wh-actions-cell">
                <button class="wh-btn-secondary wh-btn-mini" onclick="window.whEditLog('${log.id}')">Edit</button>
                <button class="wh-btn-danger" onclick="window.whDeleteLog('${log.id}')">Delete</button>
              </div>
            </td>
          </tr>
        `).join('');
      }
    } catch (err) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: #ef4444; padding: 24px;">Failed to load logs.</td>
        </tr>
      `;
    }
  }

  function loadAdminExportView() {
    const container = document.getElementById('whAdminTabContent');
    container.innerHTML = `
      <form id="whExportForm" style="display: flex; flex-direction: column; gap: 16px;">
        <div class="wh-form-row">
          <div class="wh-form-group">
            <label class="wh-label" for="whExportType">Report Type</label>
            <select class="wh-select" id="whExportType">
              <option value="daily">Daily Report (Specified Date)</option>
              <option value="weekly">Weekly Report (Week of Specified Date)</option>
              <option value="monthly">Monthly Report (Month of Specified Date)</option>
            </select>
          </div>
          <div class="wh-form-group">
            <label class="wh-label" for="whExportDate">Reference Date</label>
            <input class="wh-input" id="whExportDate" type="date" value="${getTodayString()}" required>
          </div>
        </div>

        <div class="wh-form-row">
          <div class="wh-form-group">
            <label class="wh-label" for="whExportUser">User Filter (Optional)</label>
            <select class="wh-select" id="whExportUser">
              <option value="">All Users</option>
              <option value="surendran">Surendran Natarajan</option>
              <option value="theepan">Theepan SS</option>
              <option value="sampritha">Sampritha Sureshkumar</option>
            </select>
          </div>
          <div class="wh-form-group">
            <label class="wh-label" for="whExportFormat">Output Format</label>
            <select class="wh-select" id="whExportFormat">
              <option value="csv">Standard CSV</option>
              <option value="excel">Microsoft Excel (.xls)</option>
            </select>
          </div>
        </div>

        <div class="wh-footer" style="margin-top: 10px;">
          <button type="submit" class="wh-btn-primary">Generate & Download Report</button>
        </div>
      </form>
    `;

    document.getElementById('whExportForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('whExportType').value;
      const date = document.getElementById('whExportDate').value;
      const user = document.getElementById('whExportUser').value;
      const format = document.getElementById('whExportFormat').value;

      let exportUrl = `/api/reports/export?requesterId=${currentUser.id}&type=${type}&date=${date}&format=${format}`;
      if (user) exportUrl += `&userId=${user}`;

      // Open in a new tab to trigger download
      window.open(exportUrl, '_blank');
    });
  }

  // --- Actions & Helpers ---
  function handleLogout() {
    currentUser = null;
    localStorage.removeItem('wh_user');
    renderScreen();
  }

  window.whEditLog = function (id) {
    const log = currentLogs.find(l => l.id === id);
    if (log) {
      renderWorkForm(log);
    } else {
      // If we are admin, fetch and check since we may have filtered logs
      // Try to fetch or find from the admin display
      // For simplicity, let's load work form with full API fetch if needed
      // but since all logs are fetched in currentLogs / fetch logs we can do:
      fetch(`/api/worklogs?requesterId=${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const adminLog = data.logs.find(l => l.id === id);
            if (adminLog) renderWorkForm(adminLog);
          }
        });
    }
  };

  window.whDeleteLog = async function (id) {
    if (!confirm('Are you sure you want to delete this work hours log?')) return;

    try {
      const res = await fetch(`/api/worklogs?requesterId=${currentUser.id}&id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        // Reload dashboard
        renderScreen();
      } else {
        alert(data.message || 'Failed to delete record.');
      }
    } catch (err) {
      alert('Network error. Failed to delete entry.');
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
    // Convert YYYY-MM-DD to a nicer date
    const [y, m, d] = dateStr.split('-');
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
