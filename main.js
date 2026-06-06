/* ============================================
   MAIN.JS — Portfolio Interactions & Animations
   ============================================ */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- Mobile hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ---- Animated Number Counter ----
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

// ---- Intersection Observer for animations ----
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(el => animateCounter(el));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

// Apply fade-in to all main elements
document.querySelectorAll(
  '.about-card, .skill-category, .project-card, .github-stats-card, .contact-card, .contact-cta-box'
).forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  fadeObserver.observe(el);
});

// Counter sections
const heroSection = document.querySelector('.hero');
const githubStatsSection = document.querySelector('.github-stats-grid');

if (heroSection) counterObserver.observe(heroSection);
if (githubStatsSection) counterObserver.observe(githubStatsSection);

// ---- Typewriter effect for hero subtitle ----
const typeTexts = [
  'Yapay Zeka & ML Geliştiricisi',
  'Computer Vision Tutkunu',
  'Deep Learning Araştırmacısı',
  'NLP & RAG Uzmanı',
  'AI for Good ❤️'
];

let typeIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeEl = document.getElementById('typeText');

function typeWriter() {
  if (!typeEl) return;

  const currentText = typeTexts[typeIndex];

  if (isDeleting) {
    typeEl.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typeEl.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 90;

  if (!isDeleting && charIndex === currentText.length) {
    delay = 2400;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typeIndex = (typeIndex + 1) % typeTexts.length;
    delay = 400;
  }

  setTimeout(typeWriter, delay);
}

setTimeout(typeWriter, 800);

// ---- Smooth scroll for nav links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Parallax effect on hero bg orbs ----
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  if (orb1) orb1.style.transform = `translateY(${scrollY * 0.3}px)`;
  if (orb2) orb2.style.transform = `translateY(${-scrollY * 0.15}px)`;

  // Hide scroll indicator after scrolling
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) {
    scrollIndicator.style.opacity = scrollY > 100 ? '0' : '1';
  }
}, { passive: true });

// ---- Project card hover: tilt effect ----
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.perspective = '800px';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ---- Avatar image error fallback ----
const avatarImg = document.getElementById('avatar-img');
if (avatarImg) {
  avatarImg.onerror = () => {
    avatarImg.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 220px; height: 220px; border-radius: 50%;
      background: linear-gradient(135deg, hsl(252,87%,35%), hsl(190,90%,30%));
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      display: flex; align-items: center; justify-content: center;
      font-size: 4rem; z-index: 2;
    `;
    placeholder.textContent = '👨‍💻';
    avatarImg.parentElement.appendChild(placeholder);
  };
}

// ---- Active nav link highlighting ----
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinksAll.forEach(link => {
        link.style.color = '';
        link.style.background = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'hsl(252,87%,75%)';
          link.style.background = 'hsla(252,87%,67%,0.1)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ---- Init entrance animations ----
document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-description, .hero-actions, .hero-stats').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.6s ease-out ${i * 100 + 100}ms, transform 0.6s ease-out ${i * 100 + 100}ms`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
});

// Hero visual entrance
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
  heroVisual.style.opacity = '0';
  heroVisual.style.transform = 'scale(0.9) translateX(30px)';
  heroVisual.style.transition = 'opacity 0.8s ease-out 400ms, transform 0.8s ease-out 400ms';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroVisual.style.opacity = '1';
      heroVisual.style.transform = 'scale(1) translateX(0)';
    });
  });
}

console.log('%c👋 Merhaba! Yasin İnal portfolyo sayfasına hoş geldiniz.', 'color: #818cf8; font-size: 14px; font-weight: bold;');
console.log('%c🚀 github.com/yasininal', 'color: #67e8f9; font-size: 12px;');
