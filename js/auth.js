(function () {
  // --- Portal registration API (other modules call window.NWPortal.register) ---
  window.NWPortal = window.NWPortal || { items: [] };
  window.NWPortal.register = function (label, onClick, opts) {
    window.NWPortal.items.push({ label, onClick, adminOnly: !!(opts && opts.adminOnly) });
    if (window.NWPortal._render) window.NWPortal._render();
  };

  // --- CSS Injections (light theme for all employee-facing UI) ---
  const css = `
    .wh-btn { cursor: pointer; }
    .wh-nav-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .wh-portal-wrap {
      position: relative;
    }
    .wh-portal-menu {
      display: none;
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.1);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.18);
      min-width: 220px;
      overflow: hidden;
      z-index: 10000;
    }
    .wh-portal-menu.open { display: block; }
    .wh-portal-item {
      display: block;
      width: 100%;
      text-align: left;
      background: none;
      border: none;
      padding: 12px 18px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: #1e293b;
      cursor: pointer;
      border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    }
    .wh-portal-item:last-child { border-bottom: none; }
    .wh-portal-item:hover { background: rgba(29, 120, 196, 0.08); }
    .wh-portal-item.wh-portal-logout { color: #dc2626; font-weight: 600; }

    .wh-overlay {
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
    .wh-overlay.open {
      display: flex;
      opacity: 1;
    }

    .wh-card {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
      width: 92%;
      max-width: 480px;
      max-height: 85vh;
      overflow-y: auto;
      padding: 32px;
      color: #1e293b;
      font-family: 'Inter', sans-serif;
      transform: scale(0.92) translateY(10px);
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .wh-overlay.open .wh-card {
      transform: scale(1) translateY(0);
    }

    .wh-card::-webkit-scrollbar { width: 6px; }
    .wh-card::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.03); }
    .wh-card::-webkit-scrollbar-thumb { background: rgba(29, 120, 196, 0.25); border-radius: 3px; }
    .wh-card::-webkit-scrollbar-thumb:hover { background: rgba(29, 120, 196, 0.4); }

    .wh-card h2, .wh-card h3 {
      font-family: 'Lato', sans-serif;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .wh-card h2 { font-size: 24px; margin-bottom: 8px; }
    .wh-card h3 { font-size: 18px; margin-bottom: 16px; }
    .wh-card p {
      font-size: 14px;
      color: #64748b;
      line-height: 1.6;
    }

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
    .wh-input {
      background: #f8fafc;
      border: 1px solid rgba(15, 23, 42, 0.12);
      border-radius: 8px;
      padding: 10px 14px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: #0f172a;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .wh-input:focus {
      border-color: #1D78C4;
      box-shadow: 0 0 0 3px rgba(29, 120, 196, 0.15);
    }

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
      box-shadow: 0 6px 20px rgba(29, 120, 196, 0.35);
    }
    .wh-btn-secondary {
      background: rgba(15, 23, 42, 0.05);
      border: 1px solid rgba(15, 23, 42, 0.12);
      color: #1e293b;
      font-family: 'Lato', sans-serif;
      font-weight: 700;
      font-size: 14px;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.15s ease;
    }
    .wh-btn-secondary:hover {
      background: rgba(15, 23, 42, 0.08);
      transform: translateY(-1px);
    }
    .wh-btn-mini {
      padding: 6px 12px;
      font-size: 13px;
      border-radius: 6px;
    }

    .wh-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(15, 23, 42, 0.08);
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .wh-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      border-top: 1px solid rgba(15, 23, 42, 0.08);
      padding-top: 16px;
      margin-top: 24px;
    }
    .wh-alert {
      background: rgba(220, 38, 38, 0.08);
      border: 1px solid rgba(220, 38, 38, 0.2);
      border-radius: 8px;
      padding: 12px;
      color: #b91c1c;
      font-size: 13px;
      margin-bottom: 16px;
      display: none;
    }

    @media (max-width: 600px) {
      .wh-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      .wh-portal-menu {
        right: auto;
        left: 0;
      }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.innerHTML = css;
  document.head.appendChild(styleEl);

  // --- Nav button + dropdown wrapper ---
  const wrap = document.createElement('div');
  wrap.className = 'wh-portal-wrap';

  const btn = document.createElement('a');
  btn.href = '#';
  btn.className = 'nav-cta wh-btn';
  btn.textContent = 'Employee Login';
  wrap.appendChild(btn);

  const menu = document.createElement('div');
  menu.className = 'wh-portal-menu';
  wrap.appendChild(menu);

  const navCta = document.querySelector('.nav-cta');
  if (navCta && navCta.parentNode) {
    const navActions = document.createElement('div');
    navActions.className = 'wh-nav-actions';
    navCta.parentNode.insertBefore(navActions, navCta);
    navActions.appendChild(wrap);
    navActions.appendChild(navCta);
  } else {
    document.body.appendChild(wrap);
  }

  // --- Modal ---
  const overlay = document.createElement('div');
  overlay.className = 'wh-overlay';
  overlay.innerHTML = `<div class="wh-card" id="whCard"></div>`;
  document.body.appendChild(overlay);

  let currentUser = JSON.parse(localStorage.getItem('wh_user') || 'null');

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) menu.classList.remove('open');
  });

  function openModal() {
    overlay.classList.add('open');
    renderLogin(document.getElementById('whCard'));
  }

  function closeModal() {
    overlay.classList.remove('open');
  }

  function renderMenu() {
    if (!currentUser) {
      menu.innerHTML = '';
      menu.classList.remove('open');
      return;
    }
    const visibleItems = window.NWPortal.items.filter(item => !item.adminOnly || currentUser.role === 'admin');
    menu.innerHTML = visibleItems.map((item, idx) => {
      const label = typeof item.label === 'function' ? item.label(currentUser) : item.label;
      return `<button type="button" class="wh-portal-item" data-idx="${idx}">${label}</button>`;
    }).join('')
      + `<button type="button" class="wh-portal-item wh-portal-logout" id="whPortalLogout">Log Out</button>`;

    visibleItems.forEach((item, idx) => {
      const el = menu.querySelector(`[data-idx="${idx}"]`);
      if (el) el.addEventListener('click', () => {
        menu.classList.remove('open');
        item.onClick();
      });
    });
    const logoutBtn = document.getElementById('whPortalLogout');
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
      menu.classList.remove('open');
      if (confirm('Log out?')) {
        localStorage.removeItem('wh_user');
        refreshButtonState();
      }
    });
  }
  window.NWPortal._render = renderMenu;

  function refreshButtonState() {
    currentUser = JSON.parse(localStorage.getItem('wh_user') || 'null');
    btn.textContent = currentUser ? `${currentUser.name.split(' ')[0]}'s Portal` : 'Employee Login';
    renderMenu();
  }
  refreshButtonState();

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentUser) {
      menu.classList.toggle('open');
    } else {
      openModal();
    }
  });

  // --- Login screen ---
  function renderLogin(container) {
    container.innerHTML = `
      <div class="wh-header">
        <div>
          <h2>Employee Login</h2>
          <p>Please authenticate to access your tools.</p>
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
        <div style="text-align: right; margin-bottom: 8px;">
          <a href="#" id="whForgotPasswordLink" style="color: #64748b; font-size: 12px; text-decoration: underline;">Forgot password?</a>
        </div>
        <div class="wh-footer">
          <button type="button" class="wh-btn-secondary" id="whLoginCloseBtn">Close</button>
          <button type="submit" class="wh-btn-primary">Login</button>
        </div>
      </form>
    `;

    document.getElementById('whCloseBtn').addEventListener('click', closeModal);
    document.getElementById('whLoginCloseBtn').addEventListener('click', closeModal);
    document.getElementById('whForgotPasswordLink').addEventListener('click', (e) => {
      e.preventDefault();
      renderForgotPassword(container);
    });
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
          refreshButtonState();
          closeModal();
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

  // --- Forgot password screen ---
  function renderForgotPassword(container) {
    container.innerHTML = `
      <div class="wh-header">
        <div>
          <h2>Reset Password</h2>
          <p>Enter your username and we'll email you a reset link if an email is on file.</p>
        </div>
        <button class="wh-btn-secondary wh-btn-mini" id="whCloseBtn">Close</button>
      </div>
      <div class="wh-alert" id="whForgotAlert"></div>
      <form id="whForgotForm">
        <div class="wh-form-group">
          <label class="wh-label" for="whForgotUsername">Username</label>
          <input class="wh-input" id="whForgotUsername" type="text" required placeholder="Username" autocomplete="off">
        </div>
        <div class="wh-footer">
          <button type="button" class="wh-btn-secondary" id="whForgotBackBtn">Back to Login</button>
          <button type="submit" class="wh-btn-primary">Send Reset Link</button>
        </div>
      </form>
    `;

    document.getElementById('whCloseBtn').addEventListener('click', closeModal);
    document.getElementById('whForgotBackBtn').addEventListener('click', () => renderLogin(container));
    document.getElementById('whForgotForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('whForgotUsername').value.trim();
      const alertBox = document.getElementById('whForgotAlert');
      alertBox.style.display = 'none';

      try {
        const response = await fetch('/api/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
        });
        const data = await response.json();
        alertBox.style.color = '#1e40af';
        alertBox.style.background = 'rgba(29, 120, 196, 0.08)';
        alertBox.style.borderColor = 'rgba(29, 120, 196, 0.25)';
        alertBox.innerText = data.message || 'If that account exists, a reset link has been sent.';
        alertBox.style.display = 'block';
      } catch (err) {
        alertBox.innerText = 'Network error. Please try again.';
        alertBox.style.display = 'block';
      }
    });
  }
})();
