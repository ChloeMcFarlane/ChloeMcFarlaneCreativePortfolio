/* =================================
   Services page — mobile bottom nav
   (loads after script.js)
   ================================= */
   (function () {
    const dock  = document.getElementById('dock');
    const btn   = document.getElementById('dock-btn');
    const label = btn.querySelector('span');
    const links = dock.querySelectorAll('.dock-panel a[href^="#"]');
  
    function setOpen(open) {
      dock.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
      label.textContent = open ? 'Close' : 'Menu';
    }
  
    btn.addEventListener('click', () => setOpen(!dock.classList.contains('open')));
  
    // Tap a section: panel pops down, page scrolls smoothly (script.js handles the scroll)
    links.forEach(a => a.addEventListener('click', () => setOpen(false)));
  
    // Tap outside or press Escape to close
    document.addEventListener('click', e => { if (!dock.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  
    // Highlight the section currently in view
    const map = new Map();
    links.forEach(a => {
      const sec = document.querySelector(a.getAttribute('href'));
      if (sec) map.set(sec, a);
    });
  
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(l => l.classList.remove('active'));
        map.get(entry.target).classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
  
    map.forEach((_, sec) => spy.observe(sec));
  })();