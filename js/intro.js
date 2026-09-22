(function () {
  'use strict';
  function init() {
    const bar = document.getElementById('loading-bar');
    const screen = document.getElementById('intro-screen');
    if (!bar || !screen) return;
    const total = 3000;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(100, ((now - start) / total) * 100);
      bar.style.width = progress + '%';
      if (progress < 100) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    setTimeout(() => {
      screen.classList.add('fade-out');
      setTimeout(() => window.location.replace('pages/login.html'), 750);
    }, total);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
