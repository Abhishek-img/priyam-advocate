/**
 * PALM LEGAL - Core Frontend Interactions
 * Vanilla JavaScript (No frameworks, No build step)
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize Lucide Icons if loaded
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Bar Council of India Mandatory Disclaimer Modal
  initDisclaimer();

  // 2. Navigation & Sticky Header
  initHeaderAndNav();

  // 3. FAQ Accordion Interaction
  initFaqAccordion();

  // 4. Contact Form Handling
  initContactForm();

  // 5. Scroll Reveal & Scroll To Top
  initScrollEffects();

  // 6. Practice Areas Filter (if present)
  initPracticeFilter();

  // 7. Hero Section Slider
  initHeroSlider();
});

/* ==========================================================================
   1. DISCLAIMER MODAL
   ========================================================================== */
function initDisclaimer() {
  const overlay = document.getElementById('disclaimer-overlay');
  const agreeBtn = document.getElementById('btn-disclaimer-agree');
  const openLinks = document.querySelectorAll('.trigger-disclaimer-modal');

  if (!overlay) return;

  const storageKey = 'palm_legal_disclaimer_accepted';
  let hasAgreed = false;
  try {
    hasAgreed = localStorage.getItem(storageKey) === 'true' || sessionStorage.getItem(storageKey) === 'true';
  } catch (e) {
    hasAgreed = false;
  }

  if (hasAgreed) {
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  } else {
    // Only show if user has not yet agreed
    overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  if (agreeBtn) {
    agreeBtn.addEventListener('click', function () {
      try {
        localStorage.setItem(storageKey, 'true');
        sessionStorage.setItem(storageKey, 'true');
      } catch (e) {}

      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.style.opacity = '1';
        document.body.classList.remove('overflow-hidden');
      }, 300);
    });
  }

  // Allow clicking footer "Disclaimer" link to view disclaimer anytime
  openLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      overlay.classList.remove('hidden');
      overlay.style.opacity = '1';
      document.body.classList.add('overflow-hidden');
    });
  });
}

/* ==========================================================================
   2. HEADER & NAVIGATION
   ========================================================================== */
function initHeaderAndNav() {
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-menu-close');
  const mobileBackdrop = document.getElementById('mobile-menu-backdrop');

  // Sticky Header elevation on scroll
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Mobile Menu Drawer Toggle
  const openMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('translate-x-full');
    if (mobileBackdrop) mobileBackdrop.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add('translate-x-full');
    if (mobileBackdrop) mobileBackdrop.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMenu);

  // Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === currentPath ||
      (currentPath === '' && (href === 'index.html' || href === '/')) ||
      (currentPath === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active', 'text-amber-400');
      link.classList.remove('text-slate-300');
    }
  });
}

/* ==========================================================================
   3. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');

      // Close other accordions for clean single-view experience
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const chevron = other.querySelector('.faq-chevron');
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
      });

      if (isAlreadyActive) {
        item.classList.remove('active');
        const chevron = item.querySelector('.faq-chevron');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      } else {
        item.classList.add('active');
        const chevron = item.querySelector('.faq-chevron');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      }
    });

    // Keyboard accessibility (Enter / Space)
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });
}

/* ==========================================================================
   4. CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('palm-contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const feedbackMsg = document.getElementById('form-feedback');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Send Enquiry';

    // Basic HTML5 validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Processing Enquiry...
        </span>
      `;
    }

    // Client-side simulation of successful receipt without server dependencies
    setTimeout(() => {
      form.reset();
      if (submitBtn) {
        submitBtn.innerHTML = `<span>✓ Enquiry Received Confidentially</span>`;
        submitBtn.classList.remove('bg-amber-600', 'hover:bg-amber-700');
        submitBtn.classList.add('bg-emerald-700', 'text-white');
      }

      if (feedbackMsg) {
        feedbackMsg.classList.remove('hidden');
        feedbackMsg.innerHTML = `
          <div class="p-4 bg-emerald-900/40 border border-emerald-500/50 rounded-lg text-emerald-200 text-sm">
            <p class="font-semibold text-emerald-300 mb-1">Thank you for your informational enquiry.</p>
            <p>Our chamber office will review your request confidentially and get in touch within 24 working hours. Per Bar Council of India rules, this enquiry does not create an advocate-client relationship.</p>
          </div>
        `;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.classList.remove('bg-emerald-700');
          submitBtn.classList.add('bg-amber-600', 'hover:bg-amber-700');
        }
      }, 6000);
    }, 1000);
  });
}

/* ==========================================================================
   5. SCROLL EFFECTS & BACK TO TOP
   ========================================================================== */
function initScrollEffects() {
  // Intersection Observer for scroll reveal animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // Scroll to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   6. PRACTICE AREAS FILTER
   ========================================================================== */
function initPracticeFilter() {
  const filterButtons = document.querySelectorAll('.practice-filter-btn');
  const practiceCards = document.querySelectorAll('.practice-item');

  if (!filterButtons.length || !practiceCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      // Update button active styles
      filterButtons.forEach(b => {
        b.classList.remove('bg-amber-600', 'text-white', 'border-amber-600');
        b.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      });
      btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
      btn.classList.add('bg-amber-600', 'text-white', 'border-amber-600');

      // Filter cards
      practiceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   7. HERO SECTION SLIDER
   ========================================================================== */
function initHeroSlider() {
  const slider = document.getElementById('hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');
  const counterCurrent = document.getElementById('hero-counter-current');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 6000;

  function showSlide(index) {
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('bg-gold', 'w-8');
        dot.classList.remove('bg-white/40', 'w-3');
      } else {
        dot.classList.remove('bg-gold', 'w-8');
        dot.classList.add('bg-white/40', 'w-3');
      }
    });

    if (counterCurrent) {
      counterCurrent.textContent = `0${currentSlide + 1}`;
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, slideDuration);
  }

  function stopAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startAutoPlay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide'), 10);
      if (!isNaN(idx)) {
        showSlide(idx);
        startAutoPlay();
      }
    });
  });

  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      showSlide(currentSlide + 1);
      startAutoPlay();
    } else if (touchEndX - touchStartX > 50) {
      showSlide(currentSlide - 1);
      startAutoPlay();
    }
  }, { passive: true });

  showSlide(0);
  startAutoPlay();
}
