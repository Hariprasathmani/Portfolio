/* =============================================
   HARI PRASATH MANI — PORTFOLIO JAVASCRIPT
   ============================================= */

'use strict';

// ===== RESUME DOWNLOAD GUARD =====
// Intercept resume buttons — if resume.pdf is a placeholder (<2KB),
// show a toast instead of attempting to open a broken PDF.
function showResumeToast() {
  let toast = document.getElementById('resumeToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'resumeToast';
    toast.style.cssText = `
      position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);
      background:#131c35;border:1px solid rgba(0,212,255,0.35);color:#f0f4ff;
      padding:14px 24px;border-radius:12px;font-family:'Sora',sans-serif;
      font-size:0.88rem;z-index:99999;box-shadow:0 8px 32px rgba(0,0,0,0.5);
      display:flex;align-items:center;gap:10px;
      opacity:0;transition:all 0.35s cubic-bezier(0.4,0,0.2,1);
    `;
    toast.innerHTML = '<i class="fas fa-info-circle" style="color:#00d4ff"></i> Resume PDF not uploaded yet — please replace <code style="background:rgba(0,212,255,0.1);padding:2px 6px;border-radius:4px">resume.pdf</code> in the portfolio folder.';
    document.body.appendChild(toast);
  }
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 4500);
}

function interceptResumeButtons() {
  const btns = document.querySelectorAll('#resumeDownloadBtn, #navResumeBtn');
  btns.forEach(btn => {
    btn.addEventListener('click', async function(e) {
      try {
        const res = await fetch('resume.pdf', { method: 'HEAD' });
        const size = parseInt(res.headers.get('content-length') || '0', 10);
        // If less than 2KB it's a placeholder
        if (size < 2048) {
          e.preventDefault();
          showResumeToast();
        }
      } catch {
        e.preventDefault();
        showResumeToast();
      }
    });
  });
}
interceptResumeButtons();

// ===== PAGE LOADER =====
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 1600);
});
document.body.style.overflow = 'hidden';

// ===== TYPED TEXT ANIMATION =====
const roles = [
  'Full Stack Developer',
  'React Developer',
  'Problem Solver',
  'CS Student @ SJCE',
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeEffect() {
  if (!typedEl) return;
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typedEl.textContent = currentRole.slice(0, charIndex);

  let delay = isDeleting ? 50 : 80;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }

  setTimeout(typeEffect, delay);
}
setTimeout(typeEffect, 1800);

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu on nav link click
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (navLink) {
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinkItems.forEach(l => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
}

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger animation for sibling elements
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((sib, index) => {
          if (sib === entry.target) delay = index * 80;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const htmlEl = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  if (!themeIcon) return;
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = document.querySelector('.navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== CONTACT FORM =====
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');

  // Simulate sending
  btn.innerHTML = '<span>Sending...</span><i class="fas fa-circle-notch fa-spin"></i>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
    success.classList.add('show');
    document.getElementById('contactForm').reset();
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1800);
}

// ===== STAT COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const text = counter.textContent;
    const target = parseInt(text.replace(/\D/g, ''), 10);
    const suffix = text.replace(/[\d]/g, '');
    let current = 0;
    const duration = 1200;
    const step = target / (duration / 16);

    const update = () => {
      current = Math.min(current + step, target);
      counter.textContent = Math.floor(current) + suffix;
      if (current < target) requestAnimationFrame(update);
    };
    update();
  });
}

const aboutSection = document.getElementById('about');
let countersAnimated = false;
const counterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersAnimated) {
    countersAnimated = true;
    animateCounters();
    counterObserver.disconnect();
  }
}, { threshold: 0.3 });

if (aboutSection) counterObserver.observe(aboutSection);

// ===== SKILL BADGE RIPPLE =====
document.querySelectorAll('.skill-badge').forEach(badge => {
  badge.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;width:80px;height:80px;
      background:rgba(0,212,255,0.2);border-radius:50%;
      transform:scale(0);animation:ripple 0.6s linear;
      left:${e.offsetX - 40}px;top:${e.offsetY - 40}px;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to { transform: scale(2); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ===== CURSOR GLOW (optional desktop effect) =====
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;width:300px;height:300px;
    border-radius:50%;background:radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%);
    pointer-events:none;z-index:9998;transform:translate(-50%,-50%);
    transition:left 0.15s ease,top 0.15s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// ===== NAVBAR HIDE ON SCROLL DOWN / SHOW ON SCROLL UP (optional) =====
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    // Scrolling down — slight shrink
    navbar.style.transform = 'translateY(-4px)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScrollY = currentScrollY;
}, { passive: true });

console.log('%c⚡ Portfolio by Hari Prasath Mani', 'color:#00d4ff;font-size:14px;font-weight:bold;');
console.log('%cgithub.com/Hariprasathmani', 'color:#8892b0;font-size:12px;');
