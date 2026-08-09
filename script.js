/* ================================================================
   ALDRIDGE UTC @MEDIACITY — SCRIPT.JS

   1. Hamburger / mobile menu toggle
   2. Hero photo slider — dots, auto-advance, swipe, keyboard
   3. Navbar shrink on scroll
   4. Back-to-top button
   5. Scroll reveal — cards and sections
================================================================ */

document.addEventListener('DOMContentLoaded', () => {


  /* ============================================================
     1. HAMBURGER / MOBILE MENU
  ============================================================ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navbar     = document.getElementById('navbar');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navbar && !navbar.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on nav link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ============================================================
     2. HERO PHOTO SLIDER
     ─────────────────────────────────────────────────────────
     Reads ALL .hero-slide elements from index.html.

     HOW TO ADD OR REMOVE SLIDES:
       Edit the .hero-slide blocks in index.html.
       This script counts them automatically — no changes here.

     Features:
       · Horizontal dots at bottom centre of hero card
       · Auto-advances every 5 seconds
       · Pauses on hover
       · Touch / swipe support
       · Left / Right keyboard arrows when focused
  ============================================================ */
  const heroTrack = document.getElementById('heroTrack');
  const heroDots  = document.getElementById('heroDots');

  if (heroTrack && heroDots) {
    const slides = Array.from(heroTrack.querySelectorAll('.hero-slide'));
    const total  = slides.length;
    let   cur    = 0;
    let   timer  = null;

    /* ── Build one dot per slide ── */
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'hdot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
      btn.addEventListener('click', () => { goTo(i); resetTimer(); });
      heroDots.appendChild(btn);
    });

    function getDots() { return heroDots.querySelectorAll('.hdot'); }

    /* ── Go to a specific slide ── */
    function goTo(index) {
      cur = (index + total) % total;
      heroTrack.style.transform = `translateX(-${cur * 100}%)`;
      getDots().forEach((d, i) => {
        d.classList.toggle('active', i === cur);
        d.setAttribute('aria-current', i === cur ? 'true' : 'false');
      });
    }

    /* ── Timer ── */
    function startTimer() { timer = setInterval(() => goTo(cur + 1), 5000); }
    function stopTimer()  { clearInterval(timer); }
    function resetTimer() { stopTimer(); startTimer(); }

    /* ── Pause on hover ── */
    const heroCard = document.getElementById('heroCard');
    if (heroCard) {
      heroCard.addEventListener('mouseenter', stopTimer);
      heroCard.addEventListener('mouseleave', startTimer);
    }

    /* ── Touch / swipe ── */
    let touchX = 0;
    heroTrack.addEventListener('touchstart', e => {
      touchX = e.touches[0].clientX;
    }, { passive: true });
    heroTrack.addEventListener('touchend', e => {
      const delta = touchX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 44) {
        goTo(delta > 0 ? cur + 1 : cur - 1);
        resetTimer();
      }
    });

    /* ── Keyboard ── */
    heroTrack.setAttribute('tabindex', '0');
    heroTrack.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { goTo(cur + 1); resetTimer(); }
      if (e.key === 'ArrowLeft')  { goTo(cur - 1); resetTimer(); }
    });

    startTimer();
  }


  /* ============================================================
     3. NAVBAR — shadow deepens on scroll
  ============================================================ */
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.style.boxShadow = '0 8px 32px rgba(27,58,107,.45)';
      } else {
        navbar.style.boxShadow = '0 4px 24px rgba(27,58,107,.35)';
      }
    }, { passive: true });
  }


  /* ============================================================
     4. BACK-TO-TOP BUTTON
  ============================================================ */
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ============================================================
     5. SCROLL REVEAL
     Cards and section elements fade + slide up on scroll.
     Skipped if user prefers reduced motion.
  ============================================================ */
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!REDUCED) {
    const revealEls = document.querySelectorAll(
      '.explore-card, .news-card, .event-item, .why-feat, .future-card, .future-photo, .why-photo'
    );

    revealEls.forEach((el, i) => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition =
        `opacity .5s ease ${(i % 6) * 65}ms,
         transform .5s ease ${(i % 6) * 65}ms`;
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }


});
/* ── end script.js ── */
