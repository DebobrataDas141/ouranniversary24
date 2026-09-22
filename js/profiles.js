(function () {
  'use strict';
  const init = () => {
    if (sessionStorage.getItem('df_auth') !== '1') {
      window.location.replace('login.html');
      return;
    }
    const cards = Array.from(document.querySelectorAll('[data-profile]'));
    const toast = document.getElementById('toast');
    const manage = document.getElementById('manage-profile');
    if (!cards.length) return;

    const choose = (profile) => {
      sessionStorage.setItem('df_profile', profile);
      document.body.classList.add('profile-leave');
      window.setTimeout(() => window.location.replace('home.html'), 420);
    };

    cards.forEach((card) => card.addEventListener('click', () => choose(card.dataset.profile)));
    manage?.addEventListener('click', () => {
      if (toast) {
        toast.textContent = 'Profiles are ready — choose Debo or Her to continue.';
        toast.classList.add('show');
        window.setTimeout(() => toast.classList.remove('show'), 2200);
      }
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
