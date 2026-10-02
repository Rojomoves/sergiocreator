(() => {
  'use strict';
  const menu = document.querySelector('#main-nav');
  const toggle = document.querySelector('.menu-toggle');
  if (menu && toggle) {
    document.body.classList.add('video-ready');
    toggle.hidden = false;
    const setMenu = open => {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', event => {
      if (!event.target.closest('.site-header')) setMenu(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(max-width:700px)').addEventListener('change', () => setMenu(false));
  }
  const videos = [...document.querySelectorAll('.reel-card video')];
  const players = [...document.querySelectorAll('[data-youtube]')].map(link => ({link, container: link.parentElement}));
  const resetYouTube = except => players.forEach(player => {
    if (player !== except && player.container.querySelector('iframe')) player.container.replaceChildren(player.link);
  });
  players.forEach(player => {
    player.link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      resetYouTube(player);
      videos.forEach(video => video.pause());
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${player.link.dataset.youtube}?autoplay=1`;
      frame.title = player.link.getAttribute('aria-label');
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      player.container.replaceChildren(frame);
      frame.focus();
    });
  });
  videos.forEach(video => {
    video.addEventListener('play', () => {
      resetYouTube();
      videos.forEach(other => { if (other !== video) other.pause(); });
    });
    video.addEventListener('error', () => {
      const fallback = video.closest('.reel-card').querySelector('.video-fallback');
      fallback.textContent = 'No se ha podido cargar. Abrir vídeo original ↗';
      fallback.setAttribute('role', 'status');
    });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach(video => video.pause());
  });
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
