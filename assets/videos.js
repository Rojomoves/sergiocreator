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
  const videos = [...document.querySelectorAll('video')];
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
      const group = video.closest('[data-ba]');
      videos.forEach(other => { if (other !== video && !(group && group.contains(other))) other.pause(); });
    });
    video.addEventListener('error', () => {
      const fallback = video.closest('figure')?.querySelector('.video-fallback');
      if (!fallback) return;
      fallback.textContent = 'No se ha podido cargar. Abrir vídeo original ↗';
      fallback.setAttribute('role', 'status');
    });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach(video => video.pause());
  });
  // Carruseles de reels: flechas que avanzan una tarjeta y se desactivan al llegar a los extremos.
  document.querySelectorAll('.reel-carousel').forEach(carousel => {
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    controls.innerHTML = '<button type="button" data-dir="-1" aria-label="Ver proyectos anteriores">←</button><button type="button" data-dir="1" aria-label="Ver proyectos siguientes">→</button>';
    carousel.after(controls);
    const [prev, next] = controls.querySelectorAll('button');
    const step = () => carousel.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(carousel).columnGap);
    const update = () => {
      const max = carousel.scrollWidth - carousel.clientWidth - 2;
      prev.disabled = carousel.scrollLeft <= 2;
      next.disabled = carousel.scrollLeft >= max;
      controls.hidden = carousel.scrollWidth <= carousel.clientWidth + 2;
    };
    controls.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (button) carousel.scrollBy({ left: Number(button.dataset.dir) * step(), behavior: 'smooth' });
    });
    carousel.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
  // Antes vs después: el vídeo editado manda y el bruto (silenciado) le sigue; la cortina recorta el editado.
  const soundOn = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const soundOff = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/></svg>';
  document.querySelectorAll('[data-ba]').forEach(stage => {
    const before = stage.querySelector('.ba-before video');
    const after = stage.querySelector('.ba-after video');
    if (!before || !after) return;
    [before, after].forEach(video => video.removeAttribute('controls'));
    before.muted = true;
    stage.insertAdjacentHTML('beforeend', '<input class="ba-range" type="range" min="0" max="100" step="1" value="50" aria-label="Comparar antes y después"><div class="ba-divider" aria-hidden="true"><span class="ba-handle">↔</span></div><div class="ba-bar"><button class="ba-toggle" type="button" aria-pressed="false" aria-label="Reproducir comparación">▶</button><input class="ba-seek" type="range" min="0" max="1000" value="0" aria-label="Posición del vídeo" disabled><button class="ba-sound" type="button" aria-pressed="false" aria-label="Silenciar">' + soundOn + '</button></div>');
    stage.classList.add('is-ready');
    const range = stage.querySelector('.ba-range');
    const toggle = stage.querySelector('.ba-toggle');
    const seek = stage.querySelector('.ba-seek');
    const sound = stage.querySelector('.ba-sound');
    const align = () => { if (Number.isFinite(after.currentTime)) before.currentTime = Math.min(after.currentTime, before.duration || after.currentTime); };
    const setPos = value => {
      stage.style.setProperty('--ba-pos', `${value}%`);
      range.setAttribute('aria-valuetext', `${value}% antes, ${100 - value}% después`);
    };
    range.addEventListener('input', () => setPos(Number(range.value)));
    setPos(50);
    // Arrastre con ratón o dedo; en táctil solo se mueve tras un gesto horizontal para no estorbar al scroll.
    const dragTo = event => {
      const rect = stage.getBoundingClientRect();
      const value = Math.round(Math.min(100, Math.max(0, (event.clientX - rect.left) / rect.width * 100)));
      range.value = String(value);
      setPos(value);
    };
    stage.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('.ba-bar')) return;
      stage.setPointerCapture(event.pointerId);
      range.focus({ preventScroll: true });
      if (event.pointerType === 'mouse') dragTo(event);
    });
    stage.addEventListener('pointermove', event => { if (stage.hasPointerCapture(event.pointerId)) dragTo(event); });
    stage.addEventListener('pointerup', event => { if (event.pointerType !== 'mouse' && !event.target.closest('.ba-bar')) dragTo(event); });
    toggle.addEventListener('click', () => {
      if (after.paused || after.ended) after.play().catch(() => {});
      else after.pause();
    });
    sound.addEventListener('click', () => {
      after.muted = !after.muted;
      sound.setAttribute('aria-pressed', String(after.muted));
      sound.setAttribute('aria-label', after.muted ? 'Activar sonido' : 'Silenciar');
      sound.innerHTML = after.muted ? soundOff : soundOn;
    });
    after.addEventListener('loadedmetadata', () => { seek.disabled = false; });
    after.addEventListener('play', () => {
      align();
      before.play().catch(() => {});
      toggle.textContent = '❚❚';
      toggle.setAttribute('aria-pressed', 'true');
      toggle.setAttribute('aria-label', 'Pausar comparación');
    });
    after.addEventListener('pause', () => {
      before.pause();
      toggle.textContent = '▶';
      toggle.setAttribute('aria-pressed', 'false');
      toggle.setAttribute('aria-label', 'Reproducir comparación');
    });
    after.addEventListener('waiting', () => before.pause());
    after.addEventListener('playing', () => { align(); before.play().catch(() => {}); });
    after.addEventListener('seeked', align);
    after.addEventListener('timeupdate', () => {
      if (after.duration) seek.value = String(Math.round(after.currentTime / after.duration * 1000));
      if (!after.paused && Math.abs(before.currentTime - after.currentTime) > 0.25) align();
    });
    seek.addEventListener('input', () => {
      if (after.duration) after.currentTime = Number(seek.value) / 1000 * after.duration;
    });
  });
  // Carrusel de comparaciones: pestañas y flechas; al cambiar de diapositiva se pausa la que queda fuera.
  document.querySelectorAll('.ba-carousel').forEach(carousel => {
    const slides = [...carousel.children];
    if (slides.length < 2) return;
    const nav = document.createElement('div');
    nav.className = 'ba-nav';
    nav.innerHTML = '<div class="ba-tabs">' + slides.map((slide, i) => `<button type="button" data-index="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${slide.dataset.label}</button>`).join('') + '</div><div class="carousel-controls"><button type="button" data-dir="-1" aria-label="Comparación anterior">←</button><button type="button" data-dir="1" aria-label="Comparación siguiente">→</button></div>';
    carousel.before(nav);
    const tabs = [...nav.querySelectorAll('.ba-tabs button')];
    const [prev, next] = nav.querySelectorAll('.carousel-controls button');
    let current = 0;
    const indexNow = () => Math.round(carousel.scrollLeft / (slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(carousel).columnGap)));
    const goTo = index => carousel.scrollTo({ left: slides[Math.max(0, Math.min(slides.length - 1, index))].offsetLeft - slides[0].offsetLeft, behavior: 'smooth' });
    const update = () => {
      const index = Math.max(0, Math.min(slides.length - 1, indexNow()));
      if (index !== current) slides[current].querySelectorAll('video').forEach(video => video.pause());
      current = index;
      tabs.forEach((tab, i) => tab.setAttribute('aria-current', String(i === index)));
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    };
    nav.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      goTo(button.dataset.index !== undefined ? Number(button.dataset.index) : current + Number(button.dataset.dir));
    });
    carousel.addEventListener('keydown', event => {
      if (event.target !== carousel || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      goTo(current + (event.key === 'ArrowRight' ? 1 : -1));
    });
    carousel.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
