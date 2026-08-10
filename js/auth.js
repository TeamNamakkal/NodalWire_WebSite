(function () {
  // --- CSS Injections ---
  const css = `
    .wh-btn {
      cursor: pointer;
    }
    .wh-nav-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

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

    .wh-card {
      background: rgba(7, 16, 31, 0.95);
      border: 1px solid rgba(29, 120, 196, 0.22);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      width: 92%;
      max-width: 480px;
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

    .wh-card::-webkit-scrollbar { width: 6px; }
    .wh-card::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
    .wh-card::-webkit-scrollbar-thumb { background: rgba(29, 120, 196, 0.3); border-radius: 3px; }
    .wh-card::-webkit-scrollbar-thumb:hover { background: rgba(29, 120, 196, 0.5); }

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
    .wh-input:focus {
      border-color: #1D78C4;
      box-shadow: 0 0 0 3px rgba(29, 120, 196, 0.2);
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
    .wh-btn-mini {
      padding: 6px 12px;
      font-size: 13px;
      border-radius: 6px;
    }

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

    @media (max-width: 600px) {
      .wh-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.innerHTML = css;
  document.head.appendChild(styleEl);

  // --- Nav button ---
  const btn = document.createElement('a');
  btn.href = '#';
  btn.className = 'nav-cta wh-btn';
  btn.textContent = 'Employee Login';

  const navCta = document.querySelector('.nav-cta');
  let navActions;
  if (navCta && navCta.parentNode) {
    navActions = document.createElement('div');
    navActions.className = 'wh-nav-actions';
    navCta.parentNode.insertBefore(navActions, navCta);
    navActions.appendChild(btn);
    navActions.appendChild(navCta);
  } else {
    document.body.appendChild(btn);
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

  function openModal() {
    overlay.classList.add('open');
    renderLogin(document.getElementById('whCard'));
  }

  function closeModal() {
    overlay.classList.remove('open');
  }

  function refreshButtonState() {
    currentUser = JSON.parse(localStorage.getItem('wh_user') || 'null');
    btn.textContent = currentUser ? `Log Out (${currentUser.name.split(' ')[0]})` : 'Employee Login';
  }
  refreshButtonState();

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentUser) {
      if (confirm('Log out?')) {
        localStorage.removeItem('wh_user');
        refreshButtonState();
      }
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
          <a href="#" id="whForgotPasswordLink" style="color: #7a9bbf; font-size: 12px; text-decoration: underline;">Forgot password?</a>
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
        alertBox.style.color = '#7a9bbf';
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
