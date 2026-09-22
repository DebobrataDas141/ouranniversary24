(function () {
  'use strict';
  function init() {
    if (!sessionStorage.getItem('df_auth')) { window.location.replace('login.html'); return; }

    const pages = Array.from(document.querySelectorAll('.book-page'));
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const counter = document.getElementById('page-counter');
    if (!pages.length || !prevBtn || !nextBtn || !counter) return;

    const labels = ['Cover', 'Page 1–2', 'Page 3–4', 'Page 5–6', 'Page 7–8', 'Page 9 / End'];
    let current = -1;

    function updateZIndex() {
      pages.forEach((page, i) => {
        page.style.zIndex = page.classList.contains('flipped') ? String(i + 1) : String(pages.length - i + 1);
      });
    }

    function render() {
      pages.forEach((page, i) => page.classList.toggle('flipped', i <= current));
      updateZIndex();
      prevBtn.disabled = current < 0;
      nextBtn.disabled = current >= pages.length - 1;
      counter.textContent = labels[current + 1] || labels[0];
    }

    function next() { if (current < pages.length - 1) { current++; render(); } }
    function prev() { if (current >= 0) { current--; render(); } }

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    pages.forEach((page) => {
      page.addEventListener('click', (e) => {
        // Never hijack clicks on real controls/links inside scrapbook pages.
        if (e.target.closest('a,button,input,video,audio')) return;
        const rect = page.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (!page.classList.contains('flipped') && x > rect.width / 2) next();
        else if (page.classList.contains('flipped') && x <= rect.width / 2) prev();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
    });

    // Swipe support for phones/tablets.
    let startX = null;
    const book = document.getElementById('book-container');
    if (book) {
      book.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
      book.addEventListener('touchend', (e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 45) dx < 0 ? next() : prev();
        startX = null;
      }, { passive: true });
    }
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
