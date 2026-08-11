(function () {
  const css = `
    .ld-card {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
      padding: 32px;
      color: #1e293b;
      font-family: 'Inter', sans-serif;
    }
    .ld-card h2, .ld-card h3, .ld-card h4 { font-family: 'Lato', sans-serif; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }
    .ld-card h2 { font-size: 24px; margin-bottom: 4px; }
    .ld-card h3 { font-size: 16px; margin-bottom: 4px; }
    .ld-card h4 { font-size: 13px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #1D78C4; }
    .ld-card p { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; }
    .ld-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(15, 23, 42, 0.08); padding-bottom: 20px; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .ld-section { margin-top: 28px; }
    .ld-section:first-child { margin-top: 0; }
    .ld-form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    .ld-label { font-family: 'Lato', sans-serif; font-size: 11px; font-weight: 700; color: #1D78C4; text-transform: uppercase; letter-spacing: 0.1em; }
    .ld-input, .ld-select, .ld-textarea { background: #f8fafc; border: 1px solid rgba(15, 23, 42, 0.12); border-radius: 8px; padding: 10px 14px; font-family: 'Inter', sans-serif; font-size: 14px; color: #0f172a; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; width: 100%; box-sizing: border-box; }
    .ld-input:focus, .ld-select:focus, .ld-textarea:focus { border-color: #1D78C4; box-shadow: 0 0 0 3px rgba(29, 120, 196, 0.15); }
    .ld-textarea { resize: vertical; min-height: 70px; font-family: 'Inter', sans-serif; }
    .ld-select option { background: #ffffff; color: #0f172a; }
    .ld-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .ld-form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .ld-btn-primary { background: linear-gradient(135deg, #1D78C4 0%, #1562a8 100%); color: #fff; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 14px; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 16px rgba(29, 120, 196, 0.25); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .ld-btn-primary:hover { transform: translateY(-2px); }
    .ld-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .ld-btn-secondary { background: rgba(15, 23, 42, 0.05); border: 1px solid rgba(15, 23, 42, 0.12); color: #1e293b; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 14px; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
    .ld-btn-secondary:hover { background: rgba(15, 23, 42, 0.08); }
    .ld-btn-mini { padding: 6px 12px; font-size: 13px; border-radius: 6px; }
    .ld-footer { display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid rgba(15, 23, 42, 0.08); padding-top: 16px; margin-top: 24px; }
    .ld-alert { background: rgba(220, 38, 38, 0.08); border: 1px solid rgba(220, 38, 38, 0.2); border-radius: 8px; padding: 12px; color: #b91c1c; font-size: 13px; margin-bottom: 16px; display: none; }
    .ld-empty { text-align: center; color: #94a3b8; font-size: 14px; padding: 28px 16px; }

    .ld-badge { display: inline-block; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; padding: 3px 9px; border-radius: 20px; white-space: nowrap; }

    .ld-followup-groups { display: flex; flex-direction: column; gap: 18px; }
    .ld-followup-group-title { font-family: 'Lato', sans-serif; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .ld-followup-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 14px; border-radius: 10px; margin-bottom: 6px; flex-wrap: wrap; cursor: pointer; }
    .ld-followup-item:hover { filter: brightness(0.98); }
    .ld-followup-overdue { background: rgba(220, 38, 38, 0.06); border: 1px solid rgba(220, 38, 38, 0.18); }
    .ld-followup-today { background: rgba(202, 138, 4, 0.07); border: 1px solid rgba(202, 138, 4, 0.2); }
    .ld-followup-upcoming { background: rgba(15, 23, 42, 0.02); border: 1px solid rgba(15, 23, 42, 0.08); }
    .ld-followup-main { display: flex; flex-direction: column; gap: 2px; min-width: 180px; }
    .ld-followup-lead-id { font-family: 'Lato', sans-serif; font-weight: 700; font-size: 12px; color: #1D78C4; }
    .ld-followup-company { font-size: 14px; font-weight: 600; color: #0f172a; }
    .ld-followup-meta { font-size: 11px; color: #64748b; }
    .ld-followup-dates { display: flex; gap: 18px; font-size: 12px; color: #475569; }

    .ld-analytics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .ld-chart-box { text-align: center; }
    .ld-chart-legend { text-align: left; margin-top: 10px; font-size: 12px; }
    .ld-legend-row { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
    .ld-legend-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }

    .ld-toolbar { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; align-items: flex-end; }
    .ld-table-container { overflow-x: auto; background: #ffffff; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 10px; }
    .ld-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
    .ld-table th, .ld-table td { padding: 10px 14px; border-bottom: 1px solid rgba(15, 23, 42, 0.06); white-space: nowrap; }
    .ld-table th { background: rgba(15, 23, 42, 0.02); font-family: 'Lato', sans-serif; font-weight: 700; color: #1D78C4; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; }
    .ld-table tbody tr:hover { background: rgba(15, 23, 42, 0.02); }
    .ld-lead-link { color: #1D78C4; font-weight: 700; cursor: pointer; text-decoration: underline; }

    .ld-timeline { display: flex; flex-direction: column; gap: 10px; }
    .ld-timeline-item { background: #ffffff; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 10px; padding: 12px 16px; }
    .ld-timeline-head { display: flex; justify-content: space-between; font-size: 11px; color: #64748b; margin-bottom: 6px; }
    .ld-timeline-type { font-family: 'Lato', sans-serif; font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 4px; }
    .ld-timeline-note { font-size: 13px; color: #334155; white-space: pre-wrap; }

    .ld-detail-grid { display: grid; grid-template-columns: 1fr; gap: 8px 24px; }
    .ld-detail-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(15, 23, 42, 0.05); font-size: 13px; }
    .ld-detail-row span:first-child { color: #64748b; }
    .ld-detail-row span:last-child { color: #0f172a; font-weight: 500; text-align: right; }

    @media (max-width: 900px) {
      .ld-analytics-grid { grid-template-columns: 1fr; }
      .ld-form-row, .ld-form-row-3 { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .ld-header { flex-direction: column; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.innerHTML = css;
  document.head.appendChild(styleEl);

  const STATUS_COLORS = {
    Initiated: '#94a3b8',
    Contacted: '#1D78C4',
    Discussion: '#0ea5e9',
    Proposal: '#6366f1',
    Negotiation: '#d97706',
    Won: '#16a34a',
    Lost: '#dc2626',
    'On Hold': '#64748b'
  };
  const PRIORITY_COLORS = { Low: '#94a3b8', Normal: '#1D78C4', High: '#d97706', Critical: '#dc2626' };

  let meta = { statuses: [], priorities: [], serviceCategories: [] };
  let allLeads = [];
  let followups = { overdue: [], dueToday: [], upcoming: [] };
  let analytics = { byStatus: [], byMonth: [], byService: [] };
  let approversList = [];
  let filters = { search: '', status: '', owner: '', service: '' };

  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('wh_user') || 'null');
  }

  if (window.NWPortal) {
    window.NWPortal.register('Lead Management', renderInto, { approverOnly: true });
  }

  function renderInto(container) {
    const user = getCurrentUser();
    if (!user || !window.NWAuth.isApprover(user)) return;
    container.innerHTML = `<div id="ldRoot"></div>`;
    loadMetaThenDashboard();
  }

  async function loadMetaThenDashboard() {
    const user = getCurrentUser();
    try {
      const [metaRes, projRes] = await Promise.all([
        fetch(`/api/leads/meta?requesterId=${user.id}`),
        fetch(`/api/employees/projects?requesterId=${user.id}`)
      ]);
      const metaData = await metaRes.json();
      const projData = await projRes.json();
      if (metaData.success) meta = metaData;
      if (projData.success) approversList = projData.employees.filter(e => e.username);
    } catch (err) {
      // Fall through with defaults; dashboard will show a load error per-section instead.
    }
    renderDashboard();
  }

  // ============================================================
  // DASHBOARD
  // ============================================================
  async function renderDashboard() {
    const root = document.getElementById('ldRoot');
    root.innerHTML = `
      <div class="ld-card">
        <div class="ld-header">
          <div>
            <h2>Lead Management Dashboard</h2>
            <p>Track opportunities, follow up consistently, and convert conversations into business.</p>
          </div>
          <button class="ld-btn-primary" id="ldNewLeadBtn">+ New Lead</button>
        </div>

        <div class="ld-section">
          <h3>Follow-Up Required</h3>
          <div id="ldFollowupBody"><p style="color:#94a3b8; font-size: 13px;">Loading...</p></div>
        </div>

        <div class="ld-section">
          <h3>Lead Analytics</h3>
          <div id="ldAnalyticsBody"><p style="color:#94a3b8; font-size: 13px;">Loading...</p></div>
        </div>

        <div class="ld-section">
          <h3>All Leads</h3>
          <div id="ldListBody"><p style="color:#94a3b8; font-size: 13px;">Loading...</p></div>
        </div>
      </div>
    `;

    document.getElementById('ldNewLeadBtn').addEventListener('click', renderNewLeadForm);

    await Promise.all([loadFollowups(), loadAnalytics(), loadLeadList()]);
  }

  async function loadFollowups() {
    const user = getCurrentUser();
    const body = document.getElementById('ldFollowupBody');
    try {
      const res = await fetch(`/api/leads/followups?requesterId=${user.id}`);
      const data = await res.json();
      if (!data.success) {
        body.innerHTML = `<p style="color:#dc2626; font-size:13px;">${escapeHtml(data.message || 'Failed to load follow-ups.')}</p>`;
        return;
      }
      followups = data;
      renderFollowups(body);
    } catch (err) {
      body.innerHTML = `<p style="color:#dc2626; font-size:13px;">Network error loading follow-ups.</p>`;
    }
  }

  function renderFollowups(body) {
    const total = followups.overdue.length + followups.dueToday.length + followups.upcoming.length;
    if (total === 0) {
      body.innerHTML = `<div class="ld-empty">No follow-ups require attention today.</div>`;
      return;
    }

    const groups = [
      { key: 'overdue', title: 'Overdue', items: followups.overdue, cls: 'ld-followup-overdue', color: '#dc2626' },
      { key: 'today', title: 'Due Today', items: followups.dueToday, cls: 'ld-followup-today', color: '#a16207' },
      { key: 'upcoming', title: 'Upcoming', items: followups.upcoming.slice(0, 8), cls: 'ld-followup-upcoming', color: '#475569' }
    ].filter(g => g.items.length > 0);

    body.innerHTML = `
      <div class="ld-followup-groups">
        ${groups.map(g => `
          <div>
            <div class="ld-followup-group-title" style="color:${g.color};">${g.title} (${g.items.length})</div>
            ${g.items.map(item => followupItemHtml(item, g.cls)).join('')}
          </div>
        `).join('')}
      </div>
    `;

    body.querySelectorAll('[data-lead-open]').forEach(el => {
      el.addEventListener('click', () => renderLeadDetail(el.dataset.leadOpen));
    });
  }

  function followupItemHtml(lead, cls) {
    return `
      <div class="ld-followup-item ${cls}" data-lead-open="${escapeHtml(lead.lead_number)}">
        <div class="ld-followup-main">
          <div class="ld-followup-lead-id">${escapeHtml(lead.lead_number)}</div>
          <div class="ld-followup-company">${escapeHtml(lead.company_name)}</div>
          <div class="ld-followup-meta">${escapeHtml(lead.contact_name || '')} · ${statusBadge(lead.status)} · Owner: ${escapeHtml(lead.owner_name || '—')}</div>
        </div>
        <div class="ld-followup-dates">
          <span>Last activity: ${formatDate(lead.updated_at)}</span>
          <span>Next follow-up: ${formatDate(lead.next_followup_at)}</span>
        </div>
        <button class="ld-btn-secondary ld-btn-mini" data-lead-open="${escapeHtml(lead.lead_number)}">Open</button>
      </div>
    `;
  }

  async function loadAnalytics() {
    const user = getCurrentUser();
    const body = document.getElementById('ldAnalyticsBody');
    try {
      const res = await fetch(`/api/leads/analytics?requesterId=${user.id}`);
      const data = await res.json();
      if (!data.success) {
        body.innerHTML = `<p style="color:#dc2626; font-size:13px;">${escapeHtml(data.message || 'Failed to load analytics.')}</p>`;
        return;
      }
      analytics = data;
      renderAnalytics(body);
    } catch (err) {
      body.innerHTML = `<p style="color:#dc2626; font-size:13px;">Network error loading analytics.</p>`;
    }
  }

  function renderAnalytics(body) {
    body.innerHTML = `
      <div class="ld-analytics-grid">
        <div class="ld-chart-box">
          <h4>Leads by Status</h4>
          ${donutChart(analytics.byStatus.map(s => ({ label: s.status, count: s.count, color: STATUS_COLORS[s.status] || '#94a3b8' })))}
        </div>
        <div class="ld-chart-box">
          <h4>Leads Created by Month</h4>
          ${barChart(analytics.byMonth)}
        </div>
        <div class="ld-chart-box">
          <h4>Opportunity / Service Mix</h4>
          ${hBarChart(analytics.byService)}
        </div>
      </div>
    `;
  }

  function donutChart(data) {
    const total = data.reduce((s, d) => s + d.count, 0);
    if (total === 0) return `<p style="color:#94a3b8; font-size:12px;">No data yet.</p>`;
    const size = 140, radius = size / 2 - 16, circumference = 2 * Math.PI * radius;
    let offset = 0;
    const segments = data.map(d => {
      const dash = (d.count / total) * circumference;
      const seg = `<circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="${d.color}" stroke-width="18" stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${size / 2} ${size / 2})"/>`;
      offset += dash;
      return seg;
    }).join('');
    const legend = data.map(d => `
      <div class="ld-legend-row"><span class="ld-legend-dot" style="background:${d.color};"></span>${escapeHtml(d.label)}: ${d.count}</div>
    `).join('');
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${segments}</svg><div class="ld-chart-legend">${legend}</div>`;
  }

  function barChart(data) {
    if (data.length === 0) return `<p style="color:#94a3b8; font-size:12px;">No data yet.</p>`;
    const width = 240, height = 130;
    const max = Math.max(...data.map(d => d.count), 1);
    const slot = width / data.length;
    const barWidth = Math.max(slot - 10, 8);
    const bars = data.map((d, i) => {
      const barHeight = (d.count / max) * (height - 26);
      const x = i * slot + (slot - barWidth) / 2;
      const y = height - 22 - barHeight;
      return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="3" fill="#1D78C4"/>
        <text x="${x + barWidth / 2}" y="${height - 8}" font-size="9" fill="#64748b" text-anchor="middle">${escapeHtml((d.month || '').slice(5))}</text>
      `;
    }).join('');
    return `<svg width="${width}" height="${height}">${bars}</svg>`;
  }

  function hBarChart(data) {
    if (data.length === 0) return `<p style="color:#94a3b8; font-size:12px;">No data yet.</p>`;
    const max = Math.max(...data.map(d => d.count), 1);
    return `<div style="text-align:left;">${data.map(d => `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <div style="width:110px;font-size:11px;color:#475569;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(d.service)}</div>
        <div style="flex:1;background:rgba(15,23,42,0.05);border-radius:4px;overflow:hidden;">
          <div style="width:${(d.count / max * 100)}%;background:#1D78C4;height:12px;border-radius:4px;"></div>
        </div>
        <div style="font-size:11px;color:#0f172a;width:18px;text-align:right;">${d.count}</div>
      </div>
    `).join('')}</div>`;
  }

  async function loadLeadList() {
    const user = getCurrentUser();
    const body = document.getElementById('ldListBody');
    try {
      const res = await fetch(`/api/leads?requesterId=${user.id}`);
      const data = await res.json();
      if (!data.success) {
        body.innerHTML = `<p style="color:#dc2626; font-size:13px;">${escapeHtml(data.message || 'Failed to load leads.')}</p>`;
        return;
      }
      allLeads = data.leads || [];
      renderLeadListUI(body);
    } catch (err) {
      body.innerHTML = `<p style="color:#dc2626; font-size:13px;">Network error loading leads.</p>`;
    }
  }

  function renderLeadListUI(body) {
    if (allLeads.length === 0) {
      body.innerHTML = `
        <div class="ld-empty">
          No leads have been created yet.<br><br>
          <button class="ld-btn-primary ld-btn-mini" id="ldCreateFirstBtn">Create First Lead</button>
        </div>
      `;
      document.getElementById('ldCreateFirstBtn').addEventListener('click', renderNewLeadForm);
      return;
    }

    const owners = [...new Set(allLeads.map(l => l.owner_name).filter(Boolean))];

    body.innerHTML = `
      <div class="ld-toolbar">
        <div class="ld-form-group" style="margin-bottom:0; min-width: 200px; flex: 1;">
          <label class="ld-label" for="ldSearch">Search</label>
          <input class="ld-input" id="ldSearch" type="text" placeholder="Lead ID, company, contact, email, opportunity..." value="${escapeHtml(filters.search)}">
        </div>
        <div class="ld-form-group" style="margin-bottom:0;">
          <label class="ld-label" for="ldFilterStatus">Status</label>
          <select class="ld-select" id="ldFilterStatus">
            <option value="">All</option>
            ${meta.statuses.map(s => `<option value="${s}" ${filters.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="ld-form-group" style="margin-bottom:0;">
          <label class="ld-label" for="ldFilterOwner">Owner</label>
          <select class="ld-select" id="ldFilterOwner">
            <option value="">All</option>
            ${owners.map(o => `<option value="${escapeHtml(o)}" ${filters.owner === o ? 'selected' : ''}>${escapeHtml(o)}</option>`).join('')}
          </select>
        </div>
        <div class="ld-form-group" style="margin-bottom:0;">
          <label class="ld-label" for="ldFilterService">Service</label>
          <select class="ld-select" id="ldFilterService">
            <option value="">All</option>
            ${meta.serviceCategories.map(s => `<option value="${s}" ${filters.service === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="ld-table-container">
        <table class="ld-table">
          <thead>
            <tr>
              <th>Lead ID</th>
              <th>Company</th>
              <th>Contact Person</th>
              <th>Status</th>
              <th>Next Follow-Up</th>
              <th>Owner</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody id="ldListTableBody"></tbody>
        </table>
      </div>
    `;

    document.getElementById('ldSearch').addEventListener('input', (e) => { filters.search = e.target.value; populateLeadRows(); });
    document.getElementById('ldFilterStatus').addEventListener('change', (e) => { filters.status = e.target.value; populateLeadRows(); });
    document.getElementById('ldFilterOwner').addEventListener('change', (e) => { filters.owner = e.target.value; populateLeadRows(); });
    document.getElementById('ldFilterService').addEventListener('change', (e) => { filters.service = e.target.value; populateLeadRows(); });

    populateLeadRows();
  }

  function populateLeadRows() {
    const tbody = document.getElementById('ldListTableBody');
    if (!tbody) return;

    const q = filters.search.trim().toLowerCase();
    let rows = allLeads.filter(l => {
      if (filters.status && l.status !== filters.status) return false;
      if (filters.owner && l.owner_name !== filters.owner) return false;
      if (filters.service && l.service_category !== filters.service) return false;
      if (q) {
        const haystack = [l.lead_number, l.company_name, l.contact_name, l.contact_email, l.opportunity].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const todayStr = new Date().toISOString().split('T')[0];
    function sortRank(l) {
      if (!l.next_followup_at || ['Won', 'Lost'].includes(l.status)) return 3;
      const d = l.next_followup_at.split('T')[0];
      if (d < todayStr) return 0;
      if (d === todayStr) return 1;
      return 2;
    }
    rows = rows.sort((a, b) => {
      const rankDiff = sortRank(a) - sortRank(b);
      if (rankDiff !== 0) return rankDiff;
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="ld-empty">No leads match the current filters.</td></tr>`;
      return;
    }

    tbody.innerHTML = rows.map(l => `
      <tr>
        <td><span class="ld-lead-link" data-lead-open="${escapeHtml(l.lead_number)}">${escapeHtml(l.lead_number)}</span></td>
        <td><span class="ld-lead-link" data-lead-open="${escapeHtml(l.lead_number)}">${escapeHtml(l.company_name)}</span></td>
        <td>${escapeHtml(l.contact_name || '')}</td>
        <td>${statusBadge(l.status)}</td>
        <td>${formatDate(l.next_followup_at)}</td>
        <td>${escapeHtml(l.owner_name || '—')}</td>
        <td>${formatDate(l.updated_at)}</td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-lead-open]').forEach(el => {
      el.addEventListener('click', () => renderLeadDetail(el.dataset.leadOpen));
    });
  }

  // ============================================================
  // NEW LEAD FORM
  // ============================================================
  function renderNewLeadForm() {
    const user = getCurrentUser();
    const root = document.getElementById('ldRoot');
    root.innerHTML = `
      <div class="ld-card">
        <div class="ld-header">
          <div>
            <h2>New Lead</h2>
            <p>Capture a new business development opportunity.</p>
          </div>
          <button class="ld-btn-secondary ld-btn-mini" id="ldBackBtn">Back</button>
        </div>
        <div class="ld-alert" id="ldAlert"></div>
        <form id="ldNewLeadForm">
          <div class="ld-section">
            <h4>Company</h4>
            <div class="ld-form-row">
              <div class="ld-form-group">
                <label class="ld-label" for="ldCompanyName">Company Name *</label>
                <input class="ld-input" id="ldCompanyName" type="text" required>
              </div>
              <div class="ld-form-group">
                <label class="ld-label" for="ldCompanyWebsite">Company Website</label>
                <input class="ld-input" id="ldCompanyWebsite" type="text" placeholder="https://...">
              </div>
            </div>
            <div class="ld-form-group">
              <label class="ld-label" for="ldCompanyLinkedin">Company LinkedIn Page</label>
              <input class="ld-input" id="ldCompanyLinkedin" type="text" placeholder="https://linkedin.com/company/...">
            </div>
          </div>

          <div class="ld-section">
            <h4>Contact</h4>
            <div class="ld-form-row">
              <div class="ld-form-group">
                <label class="ld-label" for="ldContactName">Contact Person *</label>
                <input class="ld-input" id="ldContactName" type="text" required>
              </div>
              <div class="ld-form-group">
                <label class="ld-label" for="ldContactRole">Job Title / Role</label>
                <input class="ld-input" id="ldContactRole" type="text">
              </div>
            </div>
            <div class="ld-form-row">
              <div class="ld-form-group">
                <label class="ld-label" for="ldContactEmail">Contact Email</label>
                <input class="ld-input" id="ldContactEmail" type="email">
              </div>
              <div class="ld-form-group">
                <label class="ld-label" for="ldContactPhone">Contact Phone</label>
                <input class="ld-input" id="ldContactPhone" type="text">
              </div>
            </div>
            <div class="ld-form-group">
              <label class="ld-label" for="ldContactLinkedin">Contact LinkedIn Profile</label>
              <input class="ld-input" id="ldContactLinkedin" type="text" placeholder="https://linkedin.com/in/...">
            </div>
          </div>

          <div class="ld-section">
            <h4>Opportunity</h4>
            <div class="ld-form-group">
              <label class="ld-label" for="ldOpportunity">Opportunity / Potential Work *</label>
              <textarea class="ld-textarea" id="ldOpportunity" required placeholder="e.g. Company appears to have T-Mobile FTTH work and may require additional network design or field engineering resources."></textarea>
            </div>
            <div class="ld-form-row">
              <div class="ld-form-group">
                <label class="ld-label" for="ldServiceCategory">Service Category</label>
                <select class="ld-select" id="ldServiceCategory">
                  <option value="">Select...</option>
                  ${meta.serviceCategories.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
              </div>
              <div class="ld-form-group">
                <label class="ld-label" for="ldEndCustomer">End Customer / Project</label>
                <input class="ld-input" id="ldEndCustomer" type="text" placeholder="e.g. T-Mobile, AT&T, Verizon...">
              </div>
            </div>
            <div class="ld-form-row-3">
              <div class="ld-form-group">
                <label class="ld-label" for="ldLocation">Location / Market</label>
                <input class="ld-input" id="ldLocation" type="text">
              </div>
              <div class="ld-form-group">
                <label class="ld-label" for="ldPriority">Priority</label>
                <select class="ld-select" id="ldPriority">
                  ${meta.priorities.map(p => `<option value="${p}" ${p === 'Normal' ? 'selected' : ''}>${p}</option>`).join('')}
                </select>
              </div>
              <div class="ld-form-group">
                <label class="ld-label" for="ldNextFollowup">Next Follow-Up Date</label>
                <input class="ld-input" id="ldNextFollowup" type="date">
              </div>
            </div>
            <div class="ld-form-group">
              <label class="ld-label" for="ldInitialNotes">Initial Notes</label>
              <textarea class="ld-textarea" id="ldInitialNotes"></textarea>
            </div>
            <div class="ld-form-group">
              <label class="ld-label" for="ldOwner">Lead Owner</label>
              <select class="ld-select" id="ldOwner">
                ${approversList.map(a => `<option value="${escapeHtml(a.username)}" data-name="${escapeHtml(a.fullName)}" ${a.username === user.id ? 'selected' : ''}>${escapeHtml(a.fullName)}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="ld-footer">
            <button type="button" class="ld-btn-secondary" id="ldCancelBtn">Cancel</button>
            <button type="submit" class="ld-btn-primary">Create Lead</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('ldBackBtn').addEventListener('click', renderDashboard);
    document.getElementById('ldCancelBtn').addEventListener('click', renderDashboard);
    document.getElementById('ldNewLeadForm').addEventListener('submit', handleCreateLead);
  }

  async function handleCreateLead(e) {
    e.preventDefault();
    const user = getCurrentUser();
    const alertBox = document.getElementById('ldAlert');
    alertBox.style.display = 'none';

    const ownerSelect = document.getElementById('ldOwner');
    const ownerOption = ownerSelect.options[ownerSelect.selectedIndex];

    const payload = {
      requesterId: user.id,
      companyName: document.getElementById('ldCompanyName').value.trim(),
      companyWebsite: document.getElementById('ldCompanyWebsite').value.trim(),
      companyLinkedin: document.getElementById('ldCompanyLinkedin').value.trim(),
      contactName: document.getElementById('ldContactName').value.trim(),
      contactRole: document.getElementById('ldContactRole').value.trim(),
      contactEmail: document.getElementById('ldContactEmail').value.trim(),
      contactPhone: document.getElementById('ldContactPhone').value.trim(),
      contactLinkedin: document.getElementById('ldContactLinkedin').value.trim(),
      opportunity: document.getElementById('ldOpportunity').value.trim(),
      serviceCategory: document.getElementById('ldServiceCategory').value,
      endCustomer: document.getElementById('ldEndCustomer').value.trim(),
      location: document.getElementById('ldLocation').value.trim(),
      priority: document.getElementById('ldPriority').value,
      nextFollowupAt: document.getElementById('ldNextFollowup').value,
      initialNotes: document.getElementById('ldInitialNotes').value.trim(),
      ownerId: ownerOption ? ownerOption.value : user.id,
      ownerName: ownerOption ? ownerOption.dataset.name : user.name
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        renderLeadDetail(data.lead.lead_number, 'Lead created successfully.');
      } else {
        alertBox.innerText = data.message || 'Failed to create lead.';
        alertBox.style.display = 'block';
      }
    } catch (err) {
      alertBox.innerText = 'Network error occurred.';
      alertBox.style.display = 'block';
    }
  }

  // ============================================================
  // LEAD DETAIL
  // ============================================================
  async function renderLeadDetail(leadNumber, successMessage) {
    const user = getCurrentUser();
    const root = document.getElementById('ldRoot');
    root.innerHTML = `<div class="ld-card"><p>Loading lead...</p></div>`;

    try {
      const res = await fetch(`/api/leads/${encodeURIComponent(leadNumber)}?requesterId=${user.id}`);
      const data = await res.json();
      if (!data.success) {
        root.innerHTML = `<div class="ld-card"><p style="color:#dc2626;">${escapeHtml(data.message || 'Lead not found.')}</p><button class="ld-btn-secondary" id="ldBackBtn2">Back</button></div>`;
        document.getElementById('ldBackBtn2').addEventListener('click', renderDashboard);
        return;
      }
      renderLeadDetailBody(data.lead, data.activities, successMessage);
    } catch (err) {
      root.innerHTML = `<div class="ld-card"><p style="color:#dc2626;">Network error loading lead.</p></div>`;
    }
  }

  function renderLeadDetailBody(lead, activities, successMessage) {
    const root = document.getElementById('ldRoot');
    const infoRows = [
      ['Company Website', lead.company_website],
      ['Company LinkedIn', lead.company_linkedin],
      ['Contact Role', lead.contact_role],
      ['Email', lead.contact_email],
      ['Phone', lead.contact_phone],
      ['Contact LinkedIn', lead.contact_linkedin],
      ['Service Category', lead.service_category],
      ['End Customer / Project', lead.end_customer],
      ['Location', lead.location],
      ['Owner', lead.owner_name],
      ['Created', formatDate(lead.created_at) + ' by ' + (lead.created_by || '—')],
      ['Last Updated', formatDate(lead.updated_at) + ' by ' + (lead.updated_by || '—')]
    ];

    root.innerHTML = `
      <div class="ld-card">
        <div class="ld-header">
          <div>
            <h2>${escapeHtml(lead.lead_number)} — ${escapeHtml(lead.company_name)}</h2>
            <p>${escapeHtml(lead.contact_name || '')} ${statusBadge(lead.status)} ${priorityBadge(lead.priority)}</p>
          </div>
          <button class="ld-btn-secondary ld-btn-mini" id="ldBackBtn">Back to Dashboard</button>
        </div>

        ${successMessage ? `<div class="ld-alert" style="display:block; background: rgba(22,163,74,0.08); border-color: rgba(22,163,74,0.2); color: #166534;">${escapeHtml(successMessage)}</div>` : ''}

        <div class="ld-section">
          <h3>Lead Information</h3>
          <p style="margin-bottom: 12px;">${escapeHtml(lead.opportunity)}</p>
          <div class="ld-detail-grid">
            ${infoRows.map(([label, val]) => `
              <div class="ld-detail-row"><span>${escapeHtml(label)}</span><span>${val ? escapeHtml(String(val)) : '—'}</span></div>
            `).join('')}
          </div>
          <div class="ld-footer" style="margin-top: 16px;">
            <button class="ld-btn-secondary ld-btn-mini" id="ldEditInfoBtn">Edit Lead Information</button>
          </div>
          <div id="ldEditInfoForm"></div>
        </div>

        <div class="ld-section">
          <h3>Actions / Current Status</h3>
          <div class="ld-alert" id="ldUpdateAlert"></div>
          <div class="ld-form-row">
            <div class="ld-form-group">
              <label class="ld-label" for="ldStatusSelect">Current Status</label>
              <select class="ld-select" id="ldStatusSelect">
                ${meta.statuses.map(s => `<option value="${s}" ${s === lead.status ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </div>
            <div class="ld-form-group">
              <label class="ld-label" for="ldFollowupSelect">Next Follow-Up Date</label>
              <input class="ld-input" id="ldFollowupSelect" type="date" value="${(lead.next_followup_at || '').split('T')[0]}">
            </div>
          </div>
          <div class="ld-form-group">
            <label class="ld-label" for="ldNoteInput">Add Note</label>
            <textarea class="ld-textarea" id="ldNoteInput" placeholder="e.g. Spoke with John. They expect new T-Mobile FTTH work in North Texas. Requested our capability statement. Follow up Friday."></textarea>
          </div>
          <div class="ld-footer" style="margin-top: 0;">
            <button class="ld-btn-primary ld-btn-mini" id="ldSaveUpdateBtn">Save Update</button>
          </div>
        </div>

        <div class="ld-section">
          <h3>AI Assistant</h3>
          <p style="margin-bottom: 12px;">Draft emails for human review — nothing is ever sent automatically.</p>
          <div style="display:flex; gap: 10px; margin-bottom: 12px;">
            <button class="ld-btn-secondary ld-btn-mini" id="ldAiIntroBtn">Draft Introduction</button>
            <button class="ld-btn-secondary ld-btn-mini" id="ldAiFollowupBtn">Draft Follow-Up</button>
          </div>
          <div id="ldAiOutput"></div>
        </div>

        <div class="ld-section">
          <h3>Activity Timeline</h3>
          <div class="ld-timeline" id="ldTimeline"></div>
        </div>
      </div>
    `;

    document.getElementById('ldBackBtn').addEventListener('click', renderDashboard);
    document.getElementById('ldEditInfoBtn').addEventListener('click', () => renderEditInfoForm(lead));
    document.getElementById('ldSaveUpdateBtn').addEventListener('click', () => handleSaveUpdate(lead));
    document.getElementById('ldAiIntroBtn').addEventListener('click', () => handleAiDraft(lead.lead_number, 'introduction'));
    document.getElementById('ldAiFollowupBtn').addEventListener('click', () => handleAiDraft(lead.lead_number, 'followup'));

    renderTimeline(activities);
  }

  function renderTimeline(activities) {
    const container = document.getElementById('ldTimeline');
    if (!activities || activities.length === 0) {
      container.innerHTML = `<div class="ld-empty">No activity yet.</div>`;
      return;
    }
    container.innerHTML = activities.map(a => `
      <div class="ld-timeline-item">
        <div class="ld-timeline-head"><span>${formatDateTime(a.created_at)}</span><span>${escapeHtml(a.created_by || '')}</span></div>
        <div class="ld-timeline-type">${activityLabel(a)}</div>
        ${a.note ? `<div class="ld-timeline-note">${escapeHtml(a.note)}</div>` : ''}
      </div>
    `).join('');
  }

  function activityLabel(a) {
    switch (a.activity_type) {
      case 'lead_created': return 'Lead created';
      case 'note_added': return 'Note added';
      case 'status_changed': return `Status changed: ${escapeHtml(a.old_value || '—')} → ${escapeHtml(a.new_value || '—')}`;
      case 'followup_changed': return `Follow-up date changed: ${escapeHtml(formatDate(a.old_value) || 'Not set')} → ${escapeHtml(formatDate(a.new_value) || 'Not set')}`;
      case 'lead_edited': return 'Lead information edited';
      case 'ai_draft_generated': return 'AI draft generated';
      case 'email_marked_sent': return 'Email marked as sent';
      default: return a.activity_type;
    }
  }

  async function handleSaveUpdate(lead) {
    const user = getCurrentUser();
    const alertBox = document.getElementById('ldUpdateAlert');
    alertBox.style.display = 'none';

    const payload = {
      requesterId: user.id,
      status: document.getElementById('ldStatusSelect').value,
      nextFollowupAt: document.getElementById('ldFollowupSelect').value,
      note: document.getElementById('ldNoteInput').value.trim()
    };

    try {
      const res = await fetch(`/api/leads/${encodeURIComponent(lead.lead_number)}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        renderLeadDetail(lead.lead_number);
      } else {
        alertBox.innerText = data.message || 'Failed to save update.';
        alertBox.style.display = 'block';
      }
    } catch (err) {
      alertBox.innerText = 'Network error occurred.';
      alertBox.style.display = 'block';
    }
  }

  function renderEditInfoForm(lead) {
    const container = document.getElementById('ldEditInfoForm');
    container.innerHTML = `
      <div class="ld-alert" id="ldEditAlert"></div>
      <div class="ld-form-row">
        <div class="ld-form-group"><label class="ld-label">Company Name</label><input class="ld-input" id="ldEditCompanyName" value="${escapeHtml(lead.company_name || '')}"></div>
        <div class="ld-form-group"><label class="ld-label">Company Website</label><input class="ld-input" id="ldEditCompanyWebsite" value="${escapeHtml(lead.company_website || '')}"></div>
      </div>
      <div class="ld-form-row">
        <div class="ld-form-group"><label class="ld-label">Company LinkedIn</label><input class="ld-input" id="ldEditCompanyLinkedin" value="${escapeHtml(lead.company_linkedin || '')}"></div>
        <div class="ld-form-group"><label class="ld-label">Contact Person</label><input class="ld-input" id="ldEditContactName" value="${escapeHtml(lead.contact_name || '')}"></div>
      </div>
      <div class="ld-form-row">
        <div class="ld-form-group"><label class="ld-label">Contact Role</label><input class="ld-input" id="ldEditContactRole" value="${escapeHtml(lead.contact_role || '')}"></div>
        <div class="ld-form-group"><label class="ld-label">Contact Email</label><input class="ld-input" id="ldEditContactEmail" value="${escapeHtml(lead.contact_email || '')}"></div>
      </div>
      <div class="ld-form-row">
        <div class="ld-form-group"><label class="ld-label">Contact Phone</label><input class="ld-input" id="ldEditContactPhone" value="${escapeHtml(lead.contact_phone || '')}"></div>
        <div class="ld-form-group"><label class="ld-label">Contact LinkedIn</label><input class="ld-input" id="ldEditContactLinkedin" value="${escapeHtml(lead.contact_linkedin || '')}"></div>
      </div>
      <div class="ld-form-group"><label class="ld-label">Opportunity</label><textarea class="ld-textarea" id="ldEditOpportunity">${escapeHtml(lead.opportunity || '')}</textarea></div>
      <div class="ld-form-row-3">
        <div class="ld-form-group">
          <label class="ld-label">Service Category</label>
          <select class="ld-select" id="ldEditServiceCategory">
            <option value="">Select...</option>
            ${meta.serviceCategories.map(s => `<option value="${s}" ${s === lead.service_category ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="ld-form-group"><label class="ld-label">End Customer</label><input class="ld-input" id="ldEditEndCustomer" value="${escapeHtml(lead.end_customer || '')}"></div>
        <div class="ld-form-group"><label class="ld-label">Location</label><input class="ld-input" id="ldEditLocation" value="${escapeHtml(lead.location || '')}"></div>
      </div>
      <div class="ld-form-group">
        <label class="ld-label">Priority</label>
        <select class="ld-select" id="ldEditPriority">
          ${meta.priorities.map(p => `<option value="${p}" ${p === lead.priority ? 'selected' : ''}>${p}</option>`).join('')}
        </select>
      </div>
      <div class="ld-footer">
        <button type="button" class="ld-btn-secondary" id="ldEditCancelBtn">Cancel</button>
        <button type="button" class="ld-btn-primary" id="ldEditSaveBtn">Save Changes</button>
      </div>
    `;

    document.getElementById('ldEditCancelBtn').addEventListener('click', () => { container.innerHTML = ''; });
    document.getElementById('ldEditSaveBtn').addEventListener('click', async () => {
      const user = getCurrentUser();
      const alertBox = document.getElementById('ldEditAlert');
      alertBox.style.display = 'none';
      const payload = {
        requesterId: user.id,
        companyName: document.getElementById('ldEditCompanyName').value.trim(),
        companyWebsite: document.getElementById('ldEditCompanyWebsite').value.trim(),
        companyLinkedin: document.getElementById('ldEditCompanyLinkedin').value.trim(),
        contactName: document.getElementById('ldEditContactName').value.trim(),
        contactRole: document.getElementById('ldEditContactRole').value.trim(),
        contactEmail: document.getElementById('ldEditContactEmail').value.trim(),
        contactPhone: document.getElementById('ldEditContactPhone').value.trim(),
        contactLinkedin: document.getElementById('ldEditContactLinkedin').value.trim(),
        opportunity: document.getElementById('ldEditOpportunity').value.trim(),
        serviceCategory: document.getElementById('ldEditServiceCategory').value,
        endCustomer: document.getElementById('ldEditEndCustomer').value.trim(),
        location: document.getElementById('ldEditLocation').value.trim(),
        priority: document.getElementById('ldEditPriority').value
      };
      try {
        const res = await fetch(`/api/leads/${encodeURIComponent(lead.lead_number)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          renderLeadDetail(lead.lead_number);
        } else {
          alertBox.innerText = data.message || 'Failed to save changes.';
          alertBox.style.display = 'block';
        }
      } catch (err) {
        alertBox.innerText = 'Network error occurred.';
        alertBox.style.display = 'block';
      }
    });
  }

  async function handleAiDraft(leadNumber, draftType) {
    const user = getCurrentUser();
    const output = document.getElementById('ldAiOutput');
    output.innerHTML = `<p style="font-size:13px; color:#94a3b8;">Working...</p>`;
    try {
      const res = await fetch(`/api/leads/${encodeURIComponent(leadNumber)}/ai/${draftType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterId: user.id })
      });
      const data = await res.json();
      if (!data.configured) {
        output.innerHTML = `<p style="font-size:13px; color:#94a3b8;">${escapeHtml(data.message || 'AI integration not configured.')}</p>`;
        return;
      }
      if (data.error) {
        output.innerHTML = `<p style="font-size:13px; color:#dc2626;">${escapeHtml(data.message || 'AI generation failed.')}</p>`;
        return;
      }
      output.innerHTML = `
        <div class="ld-form-group"><label class="ld-label">Subject</label><input class="ld-input" id="ldAiSubject" value="${escapeHtml(data.subject || '')}"></div>
        <div class="ld-form-group"><label class="ld-label">Body</label><textarea class="ld-textarea" id="ldAiBody" style="min-height:160px;">${escapeHtml(data.body || '')}</textarea></div>
        <div style="display:flex; gap:8px;">
          <button class="ld-btn-secondary ld-btn-mini" id="ldAiRegenBtn">Regenerate</button>
          <button class="ld-btn-secondary ld-btn-mini" id="ldAiCopyBtn">Copy</button>
          <button class="ld-btn-primary ld-btn-mini" id="ldAiSentBtn">Mark as Sent</button>
        </div>
      `;
      document.getElementById('ldAiRegenBtn').addEventListener('click', () => handleAiDraft(leadNumber, draftType));
      document.getElementById('ldAiCopyBtn').addEventListener('click', () => {
        const text = `${document.getElementById('ldAiSubject').value}\n\n${document.getElementById('ldAiBody').value}`;
        navigator.clipboard.writeText(text);
      });
      document.getElementById('ldAiSentBtn').addEventListener('click', async () => {
        await fetch(`/api/leads/${encodeURIComponent(leadNumber)}/email-sent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requesterId: user.id, summary: document.getElementById('ldAiSubject').value })
        });
        renderLeadDetail(leadNumber, 'Marked as sent.');
      });
    } catch (err) {
      output.innerHTML = `<p style="font-size:13px; color:#dc2626;">Network error contacting AI service.</p>`;
    }
  }

  // ============================================================
  // Helpers
  // ============================================================
  function statusBadge(status) {
    const color = STATUS_COLORS[status] || '#94a3b8';
    return `<span class="ld-badge" style="background:${color}22; color:${color}; border:1px solid ${color}55;">${escapeHtml(status)}</span>`;
  }

  function priorityBadge(priority) {
    const color = PRIORITY_COLORS[priority] || '#94a3b8';
    return `<span class="ld-badge" style="background:${color}22; color:${color}; border:1px solid ${color}55;">${escapeHtml(priority)}</span>`;
  }

  function formatDate(value) {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatDateTime(value) {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
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
