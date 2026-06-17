/* =================================
   Chloe M. Studio — script.js
   ================================= */

// =================================
// Custom Cursor
// =================================
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// =================================
// Preloader
// =================================
const preloader = document.getElementById('preloader');
const preloaderLine = document.getElementById('preloader-line');

setTimeout(() => {
  preloaderLine.style.width = '240px';
}, 100);

setTimeout(() => {
  preloader.classList.add('done');
}, 1800);

// =================================
// Nav — Scroll Shadow
// =================================
const nav = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// =================================
// Scroll Reveal
// =================================
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

reveals.forEach(el => revealObserver.observe(el));

// =================================
// Smooth Scroll for Anchor Links
// =================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


// =================================
// Work Card Preview Popup
// =================================
(function () {
  // Create the single shared popup element
  const popup = document.createElement('div');
  popup.className = 'work-preview-popup';
  popup.innerHTML = `<img src="" alt="" /><div class="work-preview-label"></div>`;
  document.body.appendChild(popup);

  const popupImg   = popup.querySelector('img');
  const popupLabel = popup.querySelector('.work-preview-label');

  // Offset from the cursor so it doesn't sit directly under it
  const OFFSET_X = 24;
  const OFFSET_Y = -320; // above the cursor by default

  let mouseX = 0, mouseY = 0;
  let activeCard = null;
  let isMobile = false;

  // Simple check to evaluate device interaction capability
  const checkDevice = () => {
    isMobile = window.matchMedia('(max-width: 900px)').matches || ('ontouchstart' in window);
  };
  checkDevice();
  window.addEventListener('resize', checkDevice);

  // Track mouse position globally (Desktop ONLY logic)
  document.addEventListener('mousemove', e => {
    if (isMobile) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (activeCard) positionPopup();
  });

  function positionPopup() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pw = 400, ph = 300;

    let x = mouseX + OFFSET_X;
    let y = mouseY + OFFSET_Y;

    // Flip horizontally if too close to the right edge
    if (x + pw > vw - 12) x = mouseX - pw - OFFSET_X;
    // Flip vertically if too close to the top edge
    if (y < 12) y = mouseY + 20;

    popup.style.left = x + 'px';
    popup.style.top  = y + 'px';
  }

  // Close popup globally when tapping outside on mobile
  document.addEventListener('touchstart', e => {
    if (!isMobile) return;
    if (!e.target.closest('.work-card') && !e.target.closest('.work-preview-popup')) {
      popup.classList.remove('visible');
      activeCard = null;
    }
  });

  // Attach listeners to every work card that has a data-preview attribute
  document.querySelectorAll('.work-card[data-preview]').forEach(card => {
    
    // DESKTOP: Hover States
    card.addEventListener('mouseenter', () => {
      if (isMobile) return;
      const src   = card.dataset.preview;
      const label = card.dataset.previewLabel || '';
      popupImg.src     = src;
      popupImg.alt     = label;
      popupLabel.textContent = label;
      activeCard = card;
      positionPopup();
      popup.classList.add('visible');
    });

    card.addEventListener('mouseleave', () => {
      if (isMobile) return;
      activeCard = null;
      popup.classList.remove('visible');
    });

    // MOBILE: Intercept touch click step
    card.addEventListener('click', e => {
      if (!isMobile) return;

      // If this card isn't active yet, show the preview first and prevent navigation
      if (activeCard !== card) {
        e.preventDefault();
        
        const src   = card.dataset.preview;
        const label = card.dataset.previewLabel || '';
        popupImg.src     = src;
        popupImg.alt     = label;
        popupLabel.textContent = label;
        
        activeCard = card;
        popup.classList.add('visible');
      }
      // If it's already active, a second tap follows through with the default link navigation
    });
  });
})();