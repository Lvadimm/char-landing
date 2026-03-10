/* ═══════════════════════════════════════════════════
   CHAR Landing Page — Main JavaScript
   ═══════════════════════════════════════════════════
   
   Dependencies:
   - GSAP 3.12+ with ScrollTrigger
   ═══════════════════════════════════════════════════ */

'use strict';

// ─── Wait for DOM ───
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavigation();
  initMobileMenu();
  initRevealAnimations();
  initCounterAnimations();
  initBentoCardGlow();
  initFAQ();
  initCursorGlow();
  initMarqueeSpeed();
});

/* ═══════════════════════════════════════════════════
   LOADER
   ═══════════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  const bar = loader?.querySelector('.loader__bar');
  if (!loader || !bar) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 25 + 10;
    if (progress > 100) progress = 100;
    bar.style.width = `${progress}%`;
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('loader--hidden');
        document.body.style.overflow = '';
        // Trigger hero entrance after loader
        animateHeroEntrance();
      }, 400);
    }
  }, 200);

  // Safety: remove loader after 3s max
  setTimeout(() => {
    if (!loader.classList.contains('loader--hidden')) {
      bar.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('loader--hidden');
        document.body.style.overflow = '';
        animateHeroEntrance();
      }, 300);
    }
  }, 3000);
}



/* ═══════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════ */
function initNavigation() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // Scroll detection
  let lastScroll = 0;
  const scrollHandler = () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', scrollHandler, { passive: true });
  scrollHandler(); // Initial check

  // Smooth scroll to anchors
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      
      e.preventDefault();
      
      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu?.classList.contains('mobile-menu--open')) {
        closeMobileMenu();
      }

      const navHeight = document.getElementById('nav')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ═══════════════════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════════════════ */
function initMobileMenu() {
  const btn = document.getElementById('nav-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('mobile-menu--open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}

function openMobileMenu() {
  const btn = document.getElementById('nav-menu-btn');
  const menu = document.getElementById('mobile-menu');
  btn.classList.add('nav__menu-btn--active');
  btn.setAttribute('aria-expanded', 'true');
  menu.classList.add('mobile-menu--open');
  menu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const btn = document.getElementById('nav-menu-btn');
  const menu = document.getElementById('mobile-menu');
  btn.classList.remove('nav__menu-btn--active');
  btn.setAttribute('aria-expanded', 'false');
  menu.classList.remove('mobile-menu--open');
  menu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════════
   HERO ENTRANCE ANIMATION
   ═══════════════════════════════════════════════════ */
function animateHeroEntrance() {
  if (typeof gsap === 'undefined') {
    // Fallback: just make everything visible
    document.querySelectorAll('.reveal-up, .reveal-right, .reveal-scale').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'all 0.6s ease-out';
    });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1 } });

  // Hero elements
  tl.to('.hero .reveal-up', {
    y: 0,
    opacity: 1,
    stagger: 0.12,
    duration: 0.9,
  })
  .to('.hero .reveal-scale', {
    scale: 1,
    opacity: 1,
    duration: 1.2,
  }, '-=0.6');
}

/* ═══════════════════════════════════════════════════
   SCROLL REVEAL ANIMATIONS (GSAP ScrollTrigger)
   ═══════════════════════════════════════════════════ */
function initRevealAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: use IntersectionObserver
    initRevealFallback();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Reveal Up
  const revealUpElements = document.querySelectorAll('.reveal-up:not(.hero .reveal-up)');
  revealUpElements.forEach(el => {
    const delay = parseFloat(el.dataset.delay) || 0;
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      delay,
      ease: 'expo.out',
    });
  });

  // Reveal Right
  const revealRightElements = document.querySelectorAll('.reveal-right');
  revealRightElements.forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'expo.out',
    });
  });

  // Reveal Scale
  const revealScaleElements = document.querySelectorAll('.reveal-scale:not(.hero .reveal-scale)');
  revealScaleElements.forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: 'expo.out',
    });
  });

  // Hero phone parallax
  const heroPhone = document.querySelector('.hero__phone-wrapper');
  if (heroPhone) {
    gsap.to(heroPhone, {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: 80,
      rotateX: 5,
      scale: 0.95,
      ease: 'none',
    });
  }
}

function initRevealFallback() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay) || 0;
        setTimeout(() => {
          el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          el.style.opacity = '1';
          el.style.transform = 'none';
        }, delay * 1000);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal-up:not(.hero .reveal-up), .reveal-right, .reveal-scale:not(.hero .reveal-scale)').forEach(el => {
    observer.observe(el);
  });
}

/* ═══════════════════════════════════════════════════
   COUNTER ANIMATIONS
   ═══════════════════════════════════════════════════ */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quad
    const easedProgress = 1 - (1 - progress) * (1 - progress);
    const current = Math.round(easedProgress * target);
    el.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/* ═══════════════════════════════════════════════════
   BENTO CARD GLOW EFFECT
   ═══════════════════════════════════════════════════ */
function initBentoCardGlow() {
  const cards = document.querySelectorAll('.bento__card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ═══════════════════════════════════════════════════
   FAQ ACCORDION
   ═══════════════════════════════════════════════════ */
function initFAQ() {
  const items = document.querySelectorAll('.faq__item');
  
  items.forEach(item => {
    const btn = item.querySelector('.faq__question');
    if (!btn) return;
    
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq__item--open');
      
      // Close all
      items.forEach(i => {
        i.classList.remove('faq__item--open');
        i.querySelector('.faq__question')?.setAttribute('aria-expanded', 'false');
      });
      
      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('faq__item--open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   CURSOR GLOW (Desktop)
   ═══════════════════════════════════════════════════ */
function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow || window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.classList.add('cursor-glow--visible');
  });

  document.addEventListener('mouseleave', () => {
    glow.classList.remove('cursor-glow--visible');
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(animate);
  }

  animate();
}

/* ═══════════════════════════════════════════════════
   MARQUEE SPEED ON HOVER
   ═══════════════════════════════════════════════════ */
function initMarqueeSpeed() {
  const marquee = document.querySelector('.marquee');
  const content = document.querySelector('.marquee__content');
  if (!marquee || !content) return;

  marquee.addEventListener('mouseenter', () => {
    content.style.animationDuration = '60s';
  });

  marquee.addEventListener('mouseleave', () => {
    content.style.animationDuration = '40s';
  });
}
