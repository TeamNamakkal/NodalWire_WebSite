(function () {
  const css = `
    .tk-card {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
      padding: 32px;
      color: #1e293b;
      font-family: 'Inter', sans-serif;
    }
    .tk-card h2, .tk-card h3 { font-family: 'Lato', sans-serif; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }
    .tk-card h2 { font-size: 24px; margin-bottom: 8px; }
    .tk-card h3 { font-size: 16px; margin-bottom: 12px; }
    .tk-card p { font-size: 14px; color: #64748b; line-height: 1.6; }
    .tk-form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    .tk-label { font-family: 'Lato', sans-serif; font-size: 11px; font-weight: 700; color: #1D78C4; text-transform: uppercase; letter-spacing: 0.1em; }
    .tk-textarea, .tk-select { background: #f8fafc; border: 1px solid rgba(15, 23, 42, 0.12); border-radius: 8px; padding: 10px 14px; font-family: 'Inter', sans-serif; font-size: 14px; color: #0f172a; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
    .tk-textarea:focus, .tk-select:focus { border-color: #1D78C4; box-shadow: 0 0 0 3px rgba(29, 120, 196, 0.15); }
    .tk-textarea { resize: vertical; min-height: 90px; }
    .tk-select option { background: #ffffff; color: #0f172a; }
    .tk-btn-primary { background: linear-gradient(135deg, #1D78C4 0%, #1562a8 100%); color: #fff; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 14px; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 16px rgba(29, 120, 196, 0.25); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease; }
    .tk-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(29, 120, 196, 0.35); }
    .tk-btn-secondary { background: rgba(15, 23, 42, 0.05); border: 1px solid rgba(15, 23, 42, 0.12); color: #1e293b; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 14px; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: background 0.2s ease, transform 0.15s ease; }
    .tk-btn-secondary:hover { background: rgba(15, 23, 42, 0.08); transform: translateY(-1px); }
    .tk-btn-mini { padding: 6px 12px; font-size: 13px; border-radius: 6px; }
    .tk-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(15, 23, 42, 0.08); padding-bottom: 16px; margin-bottom: 24px; }
    .tk-footer { display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid rgba(15, 23, 42, 0.08); padding-top: 16px; margin-top: 24px; }
    .tk-alert { background: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.2); border-radius: 8px; padding: 12px; color: #b91c1c; font-size: 13px; margin-bottom: 16px; display: none; }
    .tk-list { display: flex; flex-direction: column; gap: 12px; }
    .tk-item { background: #ffffff; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 10px; padding: 14px 16px; }
    .tk-item-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .tk-item-meta { font-size: 11px; color: #64748b; }
    .tk-badge { font-family: 'Lato', sans-serif; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; padding: 3px 9px; border-radius: 20px; }
    .tk-badge-pending { background: rgba(202, 138, 4, 0.12); color: #a16207; border: 1px solid rgba(202, 138, 4, 0.3); }
    .tk-badge-in_review { background: rgba(29, 120, 196, 0.12); color: #1D78C4; border: 1px solid rgba(29, 120, 196, 0.3); }
    .tk-badge-resolved { background: rgba(22, 163, 74, 0.12); color: #16a34a; border: 1px solid rgba(22, 163, 74, 0.3); }
    .tk-badge-rejected { background: rgba(220, 38, 38, 0.12); color: #dc2626; border: 1px solid rgba(220, 38, 38, 0.3); }
    .tk-item-msg { font-size: 14px; color: #1e293b; white-space: pre-wrap; margin-bottom: 8px; }
    .tk-item-notes { font-size: 13px; color: #64748b; background: rgba(15, 23, 42, 0.02); border-left: 2px solid #1D78C4; padding: 8px 12px; margin-top: 8px; }
    .tk-item-actions { display: flex; gap: 8px; align-items: center; margin-top: 10px; }
  `;

  const styleEl = document.createElement('style');
  styleEl.innerHTML = css;
  document.head.appendChild(styleEl);

  let currentTickets = [];

  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('wh_user') || 'null');
  }

  if (window.NWPortal) {
    window.NWPortal.register(user => user && user.role === 'admin' ? 'Employee Requests' : 'My Requests', renderInto);
  }

  function renderInto(container) {
    const user = getCurrentUser();
    if (!user) return;
    container.innerHTML = `<div class="tk-card" id="tkCard"></div>`;
    renderScreen();
  }

  function renderScreen() {
    const user = getCurrentUser();
    const card = document.getElementById('tkCard');
    if (!user || !card) return;
    if (user.role === 'admin') {
      renderAdminView(card);
    } else {
      renderEmployeeView(card);
    }
  }

  // --- Employee view: submit form + own history ---
  async function renderEmployeeView(container) {
    container.innerHTML = `
      <div class="tk-header">
        <div>
          <h2>My Requests</h2>
          <p>Need something in your employee record updated? Submit a request here — an admin will review it and make the change.</p>
        </div>
      </div>
      <div class="tk-alert" id="tkAlert"></div>
      <form id="tkSubmitForm" style="margin-bottom: 28px;">
        <div class="tk-form-group">
          <label class="tk-label" for="tkMessage">Describe what needs to change</label>
          <textarea class="tk-textarea" id="tkMessage" placeholder="e.g. My work location changed to Austin, TX — please update my profile." required></textarea>
        </div>
        <div class="tk-footer" style="margin-top: 0;">
          <button type="submit" class="tk-btn-primary">Submit Request</button>
        </div>
      </form>
      <h3>Request History</h3>
      <div class="tk-list" id="tkListContainer">
        <p>Loading your requests...</p>
      </div>
    `;

    document.getElementById('tkSubmitForm').addEventListener('submit', handleSubmit);

    await loadOwnTickets();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const alertBox = document.getElementById('tkAlert');
    alertBox.style.display = 'none';
    const user = getCurrentUser();
    const message = document.getElementById('tkMessage').value.trim();

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterId: user.id, message })
      });
      const data = await res.json();
      if (data.success) {
        renderScreen();
      } else {
        alertBox.innerText = data.message || 'Failed to submit request.';
        alertBox.style.display = 'block';
      }
    } catch (err) {
      alertBox.innerText = 'Network error occurred.';
      alertBox.style.display = 'block';
    }
  }

  async function loadOwnTickets() {
    const user = getCurrentUser();
    const container = document.getElementById('tkListContainer');
    try {
      const res = await fetch(`/api/tickets?requesterId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        currentTickets = data.tickets || [];
        renderTicketList(container, currentTickets, false);
      } else {
        container.innerHTML = `<p style="color:#ef4444;">${escapeHtml(data.message || 'Failed to load requests.')}</p>`;
      }
    } catch (err) {
      container.innerHTML = `<p style="color:#ef4444;">Network error loading requests.</p>`;
    }
  }

  function renderTicketList(container, tickets, isAdmin) {
    if (tickets.length === 0) {
      container.innerHTML = `<p>No requests yet.</p>`;
      return;
    }
    const sorted = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    container.innerHTML = sorted.map(t => `
      <div class="tk-item">
        <div class="tk-item-head">
          <div class="tk-item-meta">${isAdmin ? `<strong>${escapeHtml(t.employeeName)}</strong> (${escapeHtml(t.employeeId)}) &nbsp;|&nbsp; ` : ''}${formatDateTime(t.createdAt)}</div>
          <span class="tk-badge tk-badge-${t.status}">${statusLabel(t.status)}</span>
        </div>
        <div class="tk-item-msg">${escapeHtml(t.message)}</div>
        ${t.adminNotes ? `<div class="tk-item-notes">Admin note: ${escapeHtml(t.adminNotes)}</div>` : ''}
        ${isAdmin ? `
          <div class="tk-item-actions">
            <select class="tk-select" id="tkStatus_${t.id}" style="padding: 6px 10px; font-size: 12px;">
              <option value="pending" ${t.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="in_review" ${t.status === 'in_review' ? 'selected' : ''}>In Review</option>
              <option value="resolved" ${t.status === 'resolved' ? 'selected' : ''}>Resolved</option>
              <option value="rejected" ${t.status === 'rejected' ? 'selected' : ''}>Rejected</option>
            </select>
            <button class="tk-btn-secondary tk-btn-mini" onclick="window.tkUpdate('${t.id}')">Save</button>
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  // --- Admin view: all tickets ---
  async function renderAdminView(container) {
    container.innerHTML = `
      <div class="tk-header">
        <div>
          <h2>Employee Requests</h2>
          <p>Review and action employee change requests. Update the employee record via Manage Employees once resolved.</p>
        </div>
      </div>
      <div class="tk-list" id="tkListContainer">
        <p>Loading requests...</p>
      </div>
    `;

    const user = getCurrentUser();
    const container2 = document.getElementById('tkListContainer');
    try {
      const res = await fetch(`/api/tickets?requesterId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        currentTickets = data.tickets || [];
        renderTicketList(container2, currentTickets, true);
      } else {
        container2.innerHTML = `<p style="color:#ef4444;">${escapeHtml(data.message || 'Failed to load requests.')}</p>`;
      }
    } catch (err) {
      container2.innerHTML = `<p style="color:#ef4444;">Network error loading requests.</p>`;
    }
  }

  window.tkUpdate = async function (id) {
    const user = getCurrentUser();
    const status = document.getElementById(`tkStatus_${id}`).value;
    try {
      const res = await fetch('/api/tickets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterId: user.id, id, status })
      });
      const data = await res.json();
      if (data.success) {
        renderScreen();
      } else {
        alert(data.message || 'Failed to update request.');
      }
    } catch (err) {
      alert('Network error. Failed to update request.');
    }
  };

  function statusLabel(status) {
    return { pending: 'Pending', in_review: 'In Review', resolved: 'Resolved', rejected: 'Rejected' }[status] || status;
  }

  function formatDateTime(iso) {
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
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
