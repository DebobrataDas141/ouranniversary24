(function () {
  'use strict';
  const init = () => {
    const form = document.getElementById('login-form');
    const email = document.getElementById('email');
    const pass = document.getElementById('password');
    const btn = document.getElementById('signin-btn');
    const err = document.getElementById('error');
    const toggle = document.getElementById('toggle-pw');
    if (!form || !email || !pass || !btn || !err) return;

    const showError = (message) => { err.textContent = message; err.classList.add('show'); };
    const clearError = () => { err.textContent = ''; err.classList.remove('show'); };

    toggle?.addEventListener('click', () => {
      const visible = pass.type === 'text';
      pass.type = visible ? 'password' : 'text';
      toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const e = email.value.trim().toLowerCase();
      const p = pass.value;
      clearError();
      if (!e || !p) { showError('Please enter your email and password.'); return; }
      btn.disabled = true;
      btn.innerHTML = 'Signing in…';
      window.setTimeout(() => {
        if (e === 'her@email.com' && p === 'ouranniversary2026') {
          sessionStorage.setItem('df_auth', '1');
          sessionStorage.removeItem('df_profile');
          document.body.classList.add('leaving');
          window.setTimeout(() => window.location.replace('profiles.html'), 420);
        } else {
          showError('Incorrect email or password.');
          pass.value = '';
          btn.disabled = false;
          btn.innerHTML = 'Sign In <span>→</span>';
          pass.focus();
        }
      }, 350);
    });
    [email, pass].forEach((input) => input.addEventListener('input', clearError));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
