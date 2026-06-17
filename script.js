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

  // Track mouse position globally
  document.addEventListener('mousemove', e => {
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

  // Attach listeners to every work card that has a data-preview attribute
  document.querySelectorAll('.work-card[data-preview]').forEach(card => {
    card.addEventListener('mouseenter', () => {
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
      activeCard = null;
      popup.classList.remove('visible');
    });
  });
})();