(() => {
  const carousel = document.getElementById('procedure-carousel');
  const track = document.getElementById('treatment-track');
  const current = document.getElementById('treatment-current');
  const cards = track ? Array.from(track.querySelectorAll('.treatment-card')) : [];
  if (!carousel || !track || !current || cards.length === 0) return;

  const previous = document.getElementById('treatment-prev');
  const next = document.getElementById('treatment-next');
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const activeIndex = () => {
    const left = carousel.getBoundingClientRect().left;
    let nearest = 0;
    let distance = Infinity;
    cards.forEach((card, index) => {
      const delta = Math.abs(card.getBoundingClientRect().left - left);
      if (delta < distance) { distance = delta; nearest = index; }
    });
    return nearest;
  };

  const goTo = index => {
    const targetIndex = Math.max(0, Math.min(cards.length - 1, index));
    const targetLeft = cards[targetIndex].getBoundingClientRect().left - carousel.getBoundingClientRect().left + carousel.scrollLeft;
    carousel.scrollTo({ left: targetLeft, behavior: reducedMotion() ? 'auto' : 'smooth' });
    current.textContent = String(targetIndex + 1).padStart(2, '0');
  };

  const update = () => { current.textContent = String(activeIndex() + 1).padStart(2, '0'); };
  carousel.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });

  // Capture navigation before the legacy handlers so each click advances exactly one card.
  document.addEventListener('click', event => {
    const button = event.target.closest('#treatment-prev, #treatment-next');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    goTo(activeIndex() + (button.id === 'treatment-next' ? 1 : -1));
  }, true);

  carousel.addEventListener('keydown', event => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    goTo(activeIndex() + (event.key === 'ArrowRight' ? 1 : -1));
  });
  update();
})();

