(() => {
  'use strict';

  let language = 'es';
  let activeFilter = 'all';
  let selectedTopic = 'idea';
  let activeImage = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const translatedElements = [...document.querySelectorAll('[data-en], [data-en-alt], [data-en-aria]')];
  const originals = new Map(translatedElements.map(element => [element, {
    text: element.textContent,
    alt: element.getAttribute('alt'),
    aria: element.getAttribute('aria-label')
  }]));
  const titles = {
    es: 'Sergio — Estrategia, contenido y crecimiento digital',
    en: 'Sergio — Strategy, content & digital growth'
  };
  const descriptions = {
    es: 'Sergio convierte atención en confianza, conversaciones y crecimiento con estrategia, contenido y experiencias digitales diseñadas para mover negocio.',
    en: 'Sergio turns attention into trust, enquiries and growth through strategy, content and digital experiences designed to move business.'
  };
  const topicMessages = {
    es: {
      web: 'Hola Sergio, me gustaría hablar contigo sobre una web para mi negocio.',
      content: 'Hola Sergio, me gustaría hablar contigo sobre contenido y estrategia para mi marca.',
      product: 'Hola Sergio, tengo una idea de producto digital y me gustaría hablar contigo.',
      idea: 'Hola Sergio, me gustaría hablar contigo sobre un proyecto.'
    },
    en: {
      web: "Hi Sergio, I'd like to talk about a website for my business.",
      content: "Hi Sergio, I'd like to talk about content and strategy for my brand.",
      product: "Hi Sergio, I have a digital product idea and I'd like to talk about it.",
      idea: "Hi Sergio, I'd like to talk about a project."
    }
  };

  const cards = [...document.querySelectorAll('.project-card')];
  const gallery = document.querySelector('.evidence-gallery');
  const galleryLinks = [...document.querySelectorAll('.evidence')];
  const dialog = document.querySelector('.lightbox');
  const menu = document.querySelector('.main-nav');
  const menuToggle = document.querySelector('.menu-toggle');

  function updateCount() {
    const count = cards.filter(card => !card.hidden).length;
    document.querySelector('.work-count').textContent = `${String(count).padStart(2, '0')} ${language === 'es' ? 'proyectos' : 'projects'}`;
  }

  function setTopic(topic) {
    selectedTopic = topic;
    document.querySelectorAll('[data-topic]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.topic === topic));
    });
    document.querySelector('#whatsapp-link').href = `https://wa.me/34643105522?text=${encodeURIComponent(topicMessages[language][topic])}`;
  }

  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', language === 'es' ? (open ? 'Cerrar menú' : 'Abrir menú') : (open ? 'Close menu' : 'Open menu'));
  }

  function showImage(index) {
    activeImage = (index + galleryLinks.length) % galleryLinks.length;
    const link = galleryLinks[activeImage];
    const image = link.querySelector('img');
    const preview = dialog.querySelector('.lightbox-image');
    preview.src = link.href;
    preview.alt = image.alt;
    dialog.querySelector('#lightbox-caption').textContent = `${activeImage + 1} / ${galleryLinks.length} — ${link.querySelector('span > span').textContent}`;
  }

  function setLanguage(nextLanguage) {
    if (!Object.hasOwn(titles, nextLanguage)) return;
    language = nextLanguage;
    translatedElements.forEach(element => {
      const original = originals.get(element);
      if (element.hasAttribute('data-en')) element.textContent = language === 'en' ? element.dataset.en : original.text;
      if (element.hasAttribute('data-en-alt')) element.alt = language === 'en' ? element.dataset.enAlt : original.alt;
      if (element.hasAttribute('data-en-aria')) element.setAttribute('aria-label', language === 'en' ? element.dataset.enAria : original.aria);
    });
    document.documentElement.lang = language;
    document.title = titles[language];
    document.querySelector('meta[name="description"]').content = descriptions[language];
    document.querySelector('meta[property="og:title"]').content = titles[language];
    document.querySelector('meta[property="og:description"]').content = descriptions[language];
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
    updateCount();
    setTopic(selectedTopic);
    setMenu(menuToggle.getAttribute('aria-expanded') === 'true');
    if (dialog.open) showImage(activeImage);
    try { localStorage.setItem('sergio-portfolio-language', language); } catch { /* Local files may have storage disabled. */ }
  }

  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  });
  window.matchMedia('(max-width: 700px)').addEventListener('change', () => setMenu(false));

  document.querySelector('.filters').hidden = false;
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
      cards.forEach(card => { card.hidden = activeFilter !== 'all' && card.dataset.category !== activeFilter; });
      document.querySelector('.project-grid').classList.toggle('is-filtered', activeFilter !== 'all');
      updateCount();
    });
  });

  document.querySelector('.contact-topics').hidden = false;
  document.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => setTopic(button.dataset.topic)));
  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => setTopic(link.dataset.service)));

  function updateGalleryControls() {
    document.querySelector('[data-gallery-direction="-1"]').disabled = gallery.scrollLeft <= 2;
    document.querySelector('[data-gallery-direction="1"]').disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2;
  }
  document.querySelector('.gallery-controls').hidden = false;
  document.querySelectorAll('[data-gallery-direction]').forEach(button => {
    button.addEventListener('click', () => gallery.scrollBy({ left: Number(button.dataset.galleryDirection) * gallery.clientWidth * .8, behavior: reducedMotion.matches ? 'instant' : 'smooth' }));
  });
  gallery.addEventListener('scroll', updateGalleryControls, { passive: true });
  window.addEventListener('resize', updateGalleryControls, { passive: true });
  updateGalleryControls();

  if (typeof dialog.showModal === 'function') {
    galleryLinks.forEach((link, index) => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showImage(index);
      dialog.showModal();
      document.body.classList.add('modal-open');
    }));
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        showImage(activeImage + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    dialog.querySelectorAll('[data-lightbox-direction]').forEach(button => button.addEventListener('click', () => showImage(activeImage + Number(button.dataset.lightboxDirection))));
  }

  if ('IntersectionObserver' in window) {
    const navLinks = [...menu.querySelectorAll('a')];
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('main > section[id]').forEach(section => navObserver.observe(section));
  }

  document.querySelector('#year').textContent = String(new Date().getFullYear());
  let savedLanguage;
  try { savedLanguage = localStorage.getItem('sergio-portfolio-language'); } catch { /* Spanish remains the default. */ }
  setLanguage(savedLanguage || 'es');
})();
