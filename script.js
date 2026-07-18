// =========================================================
// DIZZAH MEDIA — shared site behavior
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile nav toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // --- Mark active nav link based on current page ---
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

  // --- Duplicate the debe-strip content so the marquee loops seamlessly ---
  document.querySelectorAll('.debe-strip .track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });

  // --- Reveal-on-scroll for cards/sections ---
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // --- Contact form (no backend yet — friendly placeholder confirmation) ---
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('.form-note');
      if (note) {
        note.textContent = 'Asante! Ujumbe wako umepokelewa (fomu hii bado haijaunganishwa na barua pepe/database — tutaunganisha hatua ijayo).';
        note.style.color = '#FFB020';
      }
      form.reset();
    });
  }

});
