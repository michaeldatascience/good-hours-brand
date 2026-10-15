function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

ready(() => {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  if (header && toggle) {
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('is-open');
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        header.classList.remove('is-open');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('[data-sub-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('[data-sub]');
      if (!item) return;
      const open = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const slides = [...gallery.querySelectorAll('[data-slide]')];
    const thumbs = [...gallery.querySelectorAll('[data-thumb]')];
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const index = Number(thumb.getAttribute('data-thumb'));
        slides.forEach((slide, slideIndex) => {
          slide.hidden = slideIndex !== index;
        });
        thumbs.forEach((item, thumbIndex) => {
          item.setAttribute('aria-current', String(thumbIndex === index));
        });
      });
    });
  });

  document.querySelectorAll('[data-swatches]').forEach((group) => {
    const name = group.querySelector('[data-swatch-name]');
    group.querySelectorAll('[data-swatch]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.hasAttribute('disabled')) return;
        if (name) name.textContent = button.getAttribute('data-name') ?? '';
        group.querySelectorAll('[data-swatch]').forEach((item) => {
          item.setAttribute('aria-pressed', String(item === button));
        });
      });
    });
  });
});
