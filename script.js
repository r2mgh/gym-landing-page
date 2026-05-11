// ========================================
// POWERFIT — script.js
// Vanilla JavaScript — No libraries
// ========================================


// ===== NAVBAR: SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// ===== MOBILE MENU TOGGLE =====
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');
const navLinks  = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
  // Lock body scroll when menu is open
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu when clicking outside of it
document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});


// ===== SMOOTH SCROLLING =====
// Handles all anchor links that start with "#"
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const allLinks = document.querySelectorAll('.nav-link');

const activeLinkObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      allLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  root: null,
  rootMargin: `-${navbar.offsetHeight + 20}px 0px -60% 0px`,
  threshold: 0
});

sections.forEach(section => activeLinkObserver.observe(section));


// ===== SCROLL REVEAL ANIMATIONS =====
// Elements with class "reveal" fade in when they enter the viewport
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger sibling cards for a cascading entrance effect
      const siblings = Array.from(entry.target.parentElement.children);
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(idx * 0.1, 0.4)}s`;

      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate once only
    }
  });
}, {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
});

revealElements.forEach(el => revealObserver.observe(el));


// ===== COUNTER ANIMATION =====
// Animate number counters when they scroll into view
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800; // ms
  const start    = performance.now();

  function update(timestamp) {
    const elapsed  = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic for a natural deceleration
    const eased    = 1 - Math.pow(1 - progress, 3);

    el.textContent = Math.round(eased * target);

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// Hero stat numbers also animate on page load
document.querySelectorAll('.hero-stat-num[data-target]').forEach(el => {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  heroObserver.observe(el);
});


// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer   = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isOpen = question.getAttribute('aria-expanded') === 'true';

    // Close every other open item first
    faqItems.forEach(other => {
      const otherQ = other.querySelector('.faq-question');
      const otherA = other.querySelector('.faq-answer');
      otherQ.setAttribute('aria-expanded', 'false');
      otherA.classList.remove('open');
    });

    // Toggle the clicked item
    if (!isOpen) {
      question.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});


// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Required fields validation
  if (!name || !email || !message) {
    shakeForm();
    return;
  }

  // Email format validation
  if (!isValidEmail(email)) {
    const emailInput = document.getElementById('email');
    emailInput.focus();
    emailInput.style.borderColor = '#e8000b';
    emailInput.style.boxShadow   = '0 0 0 3px rgba(232,0,11,0.2)';
    setTimeout(() => {
      emailInput.style.borderColor = '';
      emailInput.style.boxShadow   = '';
    }, 2500);
    return;
  }

  // Simulate async form submission
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled    = true;

  setTimeout(() => {
    contactForm.reset();
    formSuccess.classList.add('show');
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled    = false;

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      formSuccess.classList.remove('show');
    }, 5000);
  }, 1200);
});

// Helper: basic email regex check
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper: shake the form on failed validation attempt
function shakeForm() {
  contactForm.style.animation = 'none';
  void contactForm.offsetHeight; // force reflow
  contactForm.style.animation  = 'shake 0.45s ease';
}

// Inject shake keyframe dynamically (keeps CSS clean)
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0);   }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px);  }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px);  }
  }
`;
document.head.appendChild(shakeStyle);

// Clear email error styling when the user starts retyping
document.getElementById('email').addEventListener('input', function () {
  this.style.borderColor = '';
  this.style.boxShadow   = '';
});
