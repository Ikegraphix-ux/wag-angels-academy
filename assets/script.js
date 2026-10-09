/* ============================================================
WAG ANGELS ACADEMY — script.js
Features: Smooth nav, hamburger, tabs, gallery filter,
            lightbox, testimonial slider, form validation,
            scroll reveal, back-to-top
   ============================================================ */

'use strict';

/* ============================================================
    1. NAVBAR — sticky scroll shadow + active link highlight
   ============================================================ */
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], div[id]');

  // Shadow on scroll
    window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightActiveLink();
    toggleBackToTop();
}, { passive: true });

  // Highlight nav link matching current viewport section
    function highlightActiveLink() {
    const scrollY = window.scrollY + 120;
    let current = '';
    sections.forEach(sec => {
        if (sec.offsetTop <= scrollY) current = sec.id;
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href === '#' + current) link.classList.add('active');
    });
}

  // Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = navbar.offsetHeight + 8;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // close mobile menu if open
        closeMobileMenu();
    });
});
})();

/* ============================================================
2. HAMBURGER / MOBILE MENU
   ============================================================ */
(function initHamburger() {
    const btn = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (!btn || !navLinks) return;

    btn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
});

  // Close on outside click
document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !navLinks.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });
})();

function closeMobileMenu() {
  const btn = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!btn || !navLinks) return;
  navLinks.classList.remove('open');
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ============================================================
   3. PROGRAM TABS
   ============================================================ */
(function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });
})();

/* ============================================================
   4. GALLERY FILTER + LIGHTBOX
   ============================================================ */
(function initGallery() {
  const filterBtns = document.querySelectorAll('.gal-btn');
  const galleryItems = document.querySelectorAll('.gal-item');
  const lightbox = document.getElementById('lightbox');
  const lbClose = document.getElementById('lbClose');
  const lbImgWrap = document.getElementById('lbImgWrap');
  const loadMoreBtn = document.getElementById('loadMore');

  // Filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach((item, i) => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          item.classList.remove('hidden');
          item.style.animationDelay = `${(i % 9) * 0.06}s`;
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Lightbox open
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgEl = item.querySelector('.gal-img');
      const icon = imgEl.querySelector('i') ? imgEl.querySelector('i').className : '';
      const label = imgEl.querySelector('span') ? imgEl.querySelector('span').textContent : '';
      const bg = window.getComputedStyle(imgEl).background;

      lbImgWrap.style.background = bg;
      lbImgWrap.innerHTML = `
        <div style="text-align:center;color:rgba(255,255,255,0.8);">
          <i class="${icon}" style="font-size:4rem;display:block;margin-bottom:12px;"></i>
          <p style="font-size:1rem;font-weight:600;">${label}</p>
          <p style="font-size:0.82rem;opacity:0.65;margin-top:6px;">WAG Angels Academy</p>
        </div>`;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Lightbox close
  if (lbClose) {
    lbClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Load More (simulated)
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadMoreBtn.textContent = '✓ All images loaded';
      loadMoreBtn.disabled = true;
      loadMoreBtn.style.opacity = '0.5';
    });
  }
})();

/* ============================================================
   5. TESTIMONIALS SLIDER
   ============================================================ */
(function initTestimonials() {
  const track = document.getElementById('testiTrack');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');

  if (!track) return;

  let current = 0;
  const total = track.children.length;
  let autoInterval;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(autoInterval); prev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(autoInterval); next(); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { clearInterval(autoInterval); goTo(i); startAuto(); });
  });

  function startAuto() {
    autoInterval = setInterval(next, 5000);
  }

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
  }, { passive: true });

  startAuto();
})();

/* ============================================================
   6. CONTACT FORM VALIDATION
   ============================================================ */
function handleContact(e) {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('cName');
  const email = document.getElementById('cEmail');
  const msg = document.getElementById('cMsg');

  const errName = document.getElementById('errName');
  const errEmail = document.getElementById('errEmail');
  const errMsg = document.getElementById('errMsg');

  // Reset
  [name, email, msg].forEach(el => el.classList.remove('error'));
  [errName, errEmail, errMsg].forEach(el => el.textContent = '');

  if (!name.value.trim() || name.value.trim().length < 2) {
    name.classList.add('error');
    errName.textContent = 'Please enter your full name (at least 2 characters).';
    valid = false;
  }

  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.classList.add('error');
    errEmail.textContent = 'Please enter a valid email address.';
    valid = false;
  }

  if (!msg.value.trim() || msg.value.trim().length < 10) {
    msg.classList.add('error');
    errMsg.textContent = 'Please enter a message (at least 10 characters).';
    valid = false;
  }

  if (!valid) {
    const firstError = document.querySelector('.form-group input.error, .form-group textarea.error');
    if (firstError) firstError.focus();
    return;
  }

  // Simulate submission
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = form.querySelector('button[type="submit"]');

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'block';
  }, 1200);
}

/* ============================================================
   7. NEWSLETTER FORM
   ============================================================ */
function handleNewsletter() {
  const input = document.getElementById('nlEmail');
  if (!input) return;

  const email = input.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    input.style.borderColor = 'var(--red)';
    input.placeholder = 'Please enter a valid email';
    setTimeout(() => {
      input.style.borderColor = '';
      input.placeholder = 'Enter your email address';
    }, 2500);
    return;
  }

  input.value = '';
  input.placeholder = '✓ Subscribed! Thank you.';
  input.style.borderColor = 'var(--green)';
  setTimeout(() => {
    input.placeholder = 'Enter your email address';
    input.style.borderColor = '';
  }, 4000);
}

/* ============================================================
   8. SCROLL REVEAL
   ============================================================ */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger children in the same batch
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (idx % 6) * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

/* ============================================================
   9. BACK TO TOP
   ============================================================ */
function toggleBackToTop() {
  const btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('show', window.scrollY > 400);
}

document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   10. ACTIVE NAV ON LOAD
   ============================================================ */
window.addEventListener('load', () => {
  // trigger scroll to highlight correct nav
  window.dispatchEvent(new Event('scroll'));
});

/* ============================================================
   11. GALLERY ITEM ANIMATION RESET ON FILTER
   ============================================================ */
(function initGalleryAnimation() {
  // Re-trigger fade when items appear after filter
  const style = document.createElement('style');
  style.textContent = `
    .gal-item:not(.hidden) {
      animation: gal-fade 0.4s ease both;
    }
    @keyframes gal-fade {
      from { opacity: 0; transform: scale(0.95); }
      to   { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   12. SMOOTH HOVER on WHY CARDS (keyboard accessible)
   ============================================================ */
document.querySelectorAll('.why-card, .mvv-card, .program-card, .staff-card').forEach(card => {
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') card.click();
  });
});