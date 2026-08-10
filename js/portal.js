(function () {
  const user = window.NWAuth.getCurrentUser();
  if (!user) {
    window.location.href = '/index.html';
    return;
  }

  document.getElementById('portalUserName').textContent = `${user.name} (${user.role})`;
  document.getElementById('portalLogoutBtn').addEventListener('click', () => {
    if (confirm('Log out?')) {
      window.NWAuth.logout();
      window.location.href = '/index.html';
    }
  });

  window.NWPortal = window.NWPortal || { items: [] };
  let activeIdx = 0;

  function visibleItems() {
    return window.NWPortal.items.filter(item => {
      if (item.adminOnly && user.role !== 'admin') return false;
      if (item.approverOnly && !window.NWAuth.isApprover(user)) return false;
      return true;
    });
  }

  function renderSidebar() {
    const nav = document.getElementById('portalSidebar');
    const items = visibleItems();
    nav.innerHTML = items.map((item, idx) => {
      const label = typeof item.label === 'function' ? item.label(user) : item.label;
      return `<button class="portal-nav-item ${idx === activeIdx ? 'active' : ''}" data-idx="${idx}">${label}</button>`;
    }).join('');
    items.forEach((item, idx) => {
      nav.querySelector(`[data-idx="${idx}"]`).addEventListener('click', () => {
        activeIdx = idx;
        renderSidebar();
        renderActive();
      });
    });
    if (!document.getElementById('portalMain').dataset.rendered && items.length) {
      renderActive();
    }
  }

  function renderActive() {
    const items = visibleItems();
    const main = document.getElementById('portalMain');
    main.dataset.rendered = 'true';
    const item = items[activeIdx];
    if (item) item.onClick(main);
  }

  window.NWPortal._render = renderSidebar;
  renderSidebar();
})();
