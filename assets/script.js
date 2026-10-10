(() => {
  'use strict';

  const images = [
    { src: 'assets/media/GRADUATION%20PIC.jpeg', alt: 'A school graduation gathering' },
    { src: 'assets/media/dance.jpg', alt: 'A school community activity' },
    { src: 'assets/media/exc.jpg', alt: 'A school outing' }
  ];

  function addImage(slide, item, caption) {
    const figure = document.createElement('figure');
    figure.className = 'slide-art';
    const image = document.createElement('img');
    image.src = item.src;
    image.alt = item.alt;
    image.loading = 'lazy';
    figure.append(image);
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = caption;
    figure.append(figcaption);
    slide.append(figure);
  }

  function addTextSlide(slides, title, copy, href, label, image, caption, index) {
    const slide = document.createElement('article');
    slide.className = 'hero-slide';
    slide.dataset.index = String(index);
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', (index + 1) + ' of 3');

    const layout = document.createElement('div');
    layout.className = 'slide-layout wrap';
    const content = document.createElement('div');
    content.className = 'slide-copy';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = 'WAG Angels Academy';
    const heading = document.createElement('h2');
    heading.textContent = title;
    const paragraph = document.createElement('p');
    paragraph.className = 'lead';
    paragraph.textContent = copy;
    const link = document.createElement('a');
    link.className = 'button button-primary';
    link.href = href;
    link.textContent = label + ' →';
    content.append(eyebrow, heading, paragraph, link);
    layout.append(content);
    addImage(layout, image, caption);
    slide.append(layout);
    slides.append(slide);
    return slide;
  }

  function initHeroCarousel(section) {
    const isHome = section.classList.contains('home-hero');
    const original = section.querySelector(isHome ? '.hero-grid' : '.page-hero-content, .wrap.narrow');
    if (!original) return;

    section.classList.add('hero-carousel');
    section.setAttribute('role', 'region');
    section.setAttribute('aria-roledescription', 'carousel');
    section.setAttribute('aria-label', 'Featured school information');

    const viewport = document.createElement('div');
    viewport.className = 'hero-viewport';
    const first = document.createElement('article');
    first.className = 'hero-slide is-active';
    first.dataset.index = '0';
    first.setAttribute('role', 'group');
    first.setAttribute('aria-roledescription', 'slide');
    first.setAttribute('aria-label', '1 of 3');

    if (isHome) {
      first.append(original);
    } else {
      original.classList.remove('narrow', 'wrap');
      original.classList.add('slide-copy');
      const layout = document.createElement('div');
      layout.className = 'slide-layout wrap';
      layout.append(original);
      addImage(layout, images[0], 'Learning and growing together');
      first.append(layout);
    }
    viewport.append(first);

    addTextSlide(viewport,
      'Learning, one stage at a time.',
      'From early years through primary and junior high, ask us about the right next step for your child.',
      'academics.html',
      'Explore academics',
      images[1],
      'A moment from school life',
      1);

    addTextSlide(viewport,
      'Let’s start with a conversation.',
      'Talk with the school about admissions, class availability, a campus visit or any questions your family has.',
      'contact.html',
      'Contact the school',
      images[2],
      'A school outing',
      2);

    const controls = document.createElement('div');
    controls.className = 'carousel-controls wrap';
    controls.setAttribute('aria-label', 'Slide controls');
    const previous = document.createElement('button');
    previous.type = 'button';
    previous.className = 'carousel-arrow';
    previous.setAttribute('aria-label', 'Previous slide');
    previous.textContent = '←';
    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    dots.setAttribute('role', 'group');
    dots.setAttribute('aria-label', 'Choose a slide');
    const slideNodes = [...viewport.children];
    slideNodes.forEach((slide, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot' + (index === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Show slide ' + (index + 1));
      dot.setAttribute('aria-pressed', String(index === 0));
      dot.addEventListener('click', () => show(index));
      dots.append(dot);
    });
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'carousel-arrow';
    next.setAttribute('aria-label', 'Next slide');
    next.textContent = '→';
    const pause = document.createElement('button');
    pause.type = 'button';
    pause.className = 'carousel-pause';
    pause.textContent = 'Pause';
    pause.setAttribute('aria-label', 'Pause automatic slides');
    controls.append(previous, dots, next, pause);
    section.replaceChildren(viewport, controls);

    let current = 0;
    let timer = null;
    let manuallyPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let temporarilyPaused = false;
    if (manuallyPaused) {
      pause.textContent = 'Play';
      pause.setAttribute('aria-label', 'Play automatic slides');
    }

    function clearTimer() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }
    function schedule() {
      clearTimer();
      if (!manuallyPaused && !temporarilyPaused && !document.hidden) {
        timer = window.setInterval(() => show((current + 1) % slideNodes.length), 6500);
      }
    }
    function show(index) {
      current = (index + slideNodes.length) % slideNodes.length;
      slideNodes.forEach((slide, i) => {
        const active = i === current;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.querySelectorAll('button').forEach((dot, i) => {
        const active = i === current;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-pressed', String(active));
      });
      schedule();
    }

    previous.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    pause.addEventListener('click', () => {
      manuallyPaused = !manuallyPaused;
      pause.textContent = manuallyPaused ? 'Play' : 'Pause';
      pause.setAttribute('aria-label', manuallyPaused ? 'Play automatic slides' : 'Pause automatic slides');
      schedule();
    });
    section.addEventListener('mouseenter', () => { temporarilyPaused = true; clearTimer(); });
    section.addEventListener('mouseleave', () => { temporarilyPaused = false; schedule(); });
    section.addEventListener('focusin', () => { temporarilyPaused = true; clearTimer(); });
    section.addEventListener('focusout', event => {
      if (!section.contains(event.relatedTarget)) { temporarilyPaused = false; schedule(); }
    });
    document.addEventListener('visibilitychange', schedule);
    slideNodes.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== 0)));
    schedule();
  }

  document.querySelectorAll('.home-hero, .page-hero').forEach(initHeroCarousel);

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  if (toggle && nav) {
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('is-open');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 800) close(); });
  }

  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });

  const form = document.querySelector('#contactForm');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const name = document.querySelector('#cName');
      const email = document.querySelector('#cEmail');
      const subject = document.querySelector('#cSubject');
      const message = document.querySelector('#cMsg');
      const feedback = document.querySelector('#contactFeedback');
      const validName = name.value.trim().length > 1;
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      const validMessage = message.value.trim().length > 0;
      [[name, validName], [email, validEmail], [message, validMessage]].forEach(([field, valid]) => {
        if (valid) field.removeAttribute('aria-invalid');
        else field.setAttribute('aria-invalid', 'true');
      });
      if (!validName || !validEmail || !validMessage) {
        feedback.textContent = 'Please enter your name, a valid email address and a message.';
        return;
      }
      const body = [
        'Name: ' + name.value.trim(),
        'Email: ' + email.value.trim(),
        '',
        'Message:',
        message.value.trim()
      ].join('\n');
      feedback.textContent = 'Your email app should open with this message. Send it there to contact the school.';
      window.location.href = 'mailto:info@wagangelsacademy.edu.gh?subject=' +
        encodeURIComponent('WAG Angels Academy — ' + subject.value) +
        '&body=' + encodeURIComponent(body);
    });
  }

  const tabList = document.querySelector('[role="tablist"]');
  if (tabList) {
    const tabs = [...tabList.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    const activate = (index, moveFocus) => {
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
        panels[i].classList.toggle('is-active', active);
      });
      if (moveFocus) tabs[index].focus();
    };
    tabs.forEach((tab, index) => tab.addEventListener('click', () => activate(index, false)));
    const hashPanel = tabs.findIndex(tab => tab.getAttribute('aria-controls') === window.location.hash.slice(1));
    if (hashPanel > 0) activate(hashPanel, false);
    tabList.addEventListener('keydown', event => {
      const index = tabs.indexOf(document.activeElement);
      if (index < 0) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); activate((index + 1) % tabs.length, true); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); activate((index - 1 + tabs.length) % tabs.length, true); }
      if (event.key === 'Home') { event.preventDefault(); activate(0, true); }
      if (event.key === 'End') { event.preventDefault(); activate(tabs.length - 1, true); }
    });
  }

  const galleryFilters = [...document.querySelectorAll('.gallery-filter')];
  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  galleryFilters.forEach(filter => filter.addEventListener('click', () => {
    galleryFilters.forEach(button => {
      const active = button === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    galleryItems.forEach(item => {
      item.hidden = filter.dataset.filter !== 'all' && item.dataset.category !== filter.dataset.filter;
    });
  }));

  const newsletter = document.querySelector('#newsletterForm');
  if (newsletter) {
    newsletter.addEventListener('submit', event => {
      event.preventDefault();
      const email = document.querySelector('#newsletterEmail');
      const feedback = document.querySelector('#newsletterFeedback');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email.setAttribute('aria-invalid', 'true');
        feedback.textContent = 'Enter a valid email address to request updates.';
        email.focus();
        return;
      }
      email.removeAttribute('aria-invalid');
      feedback.textContent = 'Your email app should open with a request. Send it there to contact the school.';
      window.location.href = 'mailto:info@wagangelsacademy.edu.gh?subject=' +
        encodeURIComponent('Request for WAG Angels Academy email updates') +
        '&body=' + encodeURIComponent('Please contact me about school email updates. My email address is ' + email.value.trim() + '.');
    });
  }
})();
