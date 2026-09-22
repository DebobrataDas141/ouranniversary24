(function () {
  'use strict';
  const init = () => {
    if (sessionStorage.getItem('df_auth') !== '1') { window.location.replace('login.html'); return; }

    const $ = (s, root = document) => root.querySelector(s);
    const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
    const opening = $('#opening'), movie = $('#movie-player'), song = $('#song-player');
    const cover = $('#cover-video'), main = $('#main-video'), songVideo = $('#song-video');
    const missing = $('#movie-missing'), songMissing = $('#song-missing'), profileSwitch = $('#profile-switch');
    const profile = sessionStorage.getItem('df_profile') || 'debo';
    const navAvatar = $('#nav-avatar'), navProfile = $('#nav-profile');
    if (!opening || !movie || !song || !cover || !main || !songVideo) return;

    if (profile === 'her') { navAvatar.textContent = '♥'; navProfile.textContent = 'Her'; }

    const overlays = [opening, movie, song];
    const setOpen = (el, open) => {
      overlays.forEach((item) => {
        if (item === el) return;
        item.classList.remove('open'); item.setAttribute('aria-hidden', 'true');
      });
      el.classList.toggle('open', open);
      el.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.classList.toggle('modal-open', open);
    };
    const stop = (media) => { try { media.pause(); } catch (_) {} };
    const stopAll = () => { stop(cover); };
    const closeAll = () => {
      overlays.forEach((el) => { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); });
      stopAll(); document.body.classList.remove('modal-open');
    };

    const openStory = () => {
      setOpen(opening, true);
      try { cover.currentTime = 0; } catch (_) {}
      cover.play().catch(() => {});
    };

    const openMovie = () => {
      stop(cover); setOpen(movie, true);
      // Viddler is embedded as an iframe, so playback is controlled by its own player.
      missing.classList.add('hidden');
    };

    const openSong = () => {
      stop(cover); setOpen(song, true);
      // Viddler handles playback inside the embedded player.
      songMissing?.classList.add('hidden');
    };

    // Hosted Viddler players expose their own playback controls, so the old
    // local <video> control handlers are intentionally not used here.
    $('#play-movie-now')?.addEventListener('click', openMovie);
    $('#skip-opening')?.addEventListener('click', openMovie);
    profileSwitch?.addEventListener('click', () => window.location.href = 'profiles.html');



    document.addEventListener('click', (event) => {
      const close = event.target.closest('[data-close]');
      if (close) { event.preventDefault(); closeAll(); return; }
      const target = event.target.closest('[data-content]');
      if (!target) return;
      const type = target.dataset.content;
      if (type === 'story') openStory();
      if (type === 'song') openSong();
    });

    $$('.title-card').forEach((card) => card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); card.dataset.content === 'story' ? openStory() : openSong();
      }
    }));

    $$('.title-card video').forEach((video) => {
      const card = video.closest('.title-card'); if (!card) return;
      card.addEventListener('mouseenter', () => video.play().catch(() => {}));
      card.addEventListener('mouseleave', () => { video.pause(); try { video.currentTime = 0; } catch (_) {} });
    });

    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeAll(); });
    window.addEventListener('scroll', () => $('#navbar')?.classList.toggle('scrolled', window.scrollY > 30), { passive: true });
    updateSongButton();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
