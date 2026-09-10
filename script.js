/* ==========================================================================
   Ken Madera Portfolio — Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Loading Screen ---------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 900);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader.classList.add('hidden'), 2500);

  /* ---------------- Set current year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Custom Cursor + Mouse Glow ---------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const mouseGlow = document.getElementById('mouseGlow');
  const isTouch = window.matchMedia('(hover: none)').matches;

  if (!isTouch) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, glowX = 0, glowY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateFollowers() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      mouseGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateFollowers);
    }
    animateFollowers();

    const hoverTargets = document.querySelectorAll('a, button, .service-card, .portfolio-card, .masonry-item, .tool-chip, .why-card');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
    });
  } else {
    cursorDot?.remove();
    cursorRing?.remove();
    mouseGlow?.remove();
  }

  /* ---------------- Scroll Progress Bar ---------------- */
  const progressBar = document.getElementById('scrollProgressBar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress);
  updateProgress();

  /* ---------------- Sticky Navbar ---------------- */
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', updateNavbar);
  updateNavbar();

  /* ---------------- Mobile Menu ---------------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ---------------- Back to Top ---------------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- Scroll Reveal (IntersectionObserver) ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------------- Animated Counters ---------------- */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  /* ---------------- Hero Typing Animation ---------------- */
  const typeLine = document.getElementById('typeLine');
  const fullText = 'Creating Visual Stories';
  if (typeLine) {
    typeLine.textContent = '';
    let i = 0;
    function typeChar() {
      if (i <= fullText.length) {
        typeLine.textContent = fullText.slice(0, i);
        i++;
        setTimeout(typeChar, 45);
      }
    }
    setTimeout(typeChar, 700);
  }

  /* ---------------- FAQ Accordion ---------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach((i) => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------------- Testimonial Carousel ---------------- */
  const track = document.getElementById('testimonialTrack');
  const cards = track ? Array.from(track.children) : [];
  const dotsWrap = document.getElementById('testimonialDots');
  let activeIndex = 0;
  let carouselTimer;

  if (cards.length) {
    cards.forEach((card, i) => {
      const dot = document.createElement('button');
      if (i === 0) { card.classList.add('active'); dot.classList.add('active'); }
      dot.addEventListener('click', () => setActive(i));
      dotsWrap.appendChild(dot);
    });

    function setActive(index) {
      cards[activeIndex].classList.remove('active');
      dotsWrap.children[activeIndex].classList.remove('active');
      activeIndex = index;
      cards[activeIndex].classList.add('active');
      dotsWrap.children[activeIndex].classList.add('active');
    }

    function nextSlide() {
      setActive((activeIndex + 1) % cards.length);
    }

    function startCarousel() {
      carouselTimer = setInterval(nextSlide, 5500);
    }
    startCarousel();

    track.addEventListener('mouseenter', () => clearInterval(carouselTimer));
    track.addEventListener('mouseleave', startCarousel);
  }

  /* ---------------- Masonry Lightbox ---------------- */
  const masonryItems = document.querySelectorAll('.masonry-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');

  masonryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const imgSrc = item.getAttribute('data-img');
      const imgAlt = item.querySelector('img')?.getAttribute('alt') || '';
      lightboxContent.innerHTML = imgSrc ? `<img src="${imgSrc}" alt="${imgAlt}">` : '';
      lightbox.classList.add('open');
    });
  });

  function closeLightbox() { lightbox.classList.remove('open'); }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------------- Smooth anchor scroll for older browsers ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const offset = 80;
          const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

});
