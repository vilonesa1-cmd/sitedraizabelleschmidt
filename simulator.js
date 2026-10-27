(() => {
  const form = document.getElementById('appointment-form');
  const wizard = document.getElementById('procedure-wizard');
  if (!form || !wizard) return;
  const panels = Array.from(form.querySelectorAll('.wizard-panel'));
  const progressItems = Array.from(wizard.querySelectorAll('.wizard-progress li'));
  const progressFill = document.getElementById('wizard-progress-fill');
  const back = document.getElementById('wizard-back');
  const next = document.getElementById('wizard-next');
  const submit = document.getElementById('wizard-submit');
  const details = document.getElementById('booking-details');
  const count = document.getElementById('booking-char-count');
  let step = 1;

  const selectedProcedures = () => Array.from(form.querySelectorAll('input[name="procedures"]:checked')).map(input => input.value);
  const selectedPeriod = () => form.querySelector('input[name="period"]:checked')?.value || '';
  const updateSummary = () => {
    document.getElementById('summary-procedures').textContent = selectedProcedures().join(', ') || '—';
    document.getElementById('summary-period').textContent = selectedPeriod() || '—';
    document.getElementById('summary-details').textContent = details.value.trim() || 'Não informado';
  };
  const showStep = (target, moveFocus = true) => {
    step = Math.max(1, Math.min(panels.length, target));
    panels.forEach((panel, index) => { panel.hidden = index + 1 !== step; });
    progressItems.forEach((item, index) => {
      if (index + 1 === step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
      item.classList.toggle('is-done', index + 1 < step);
    });
    progressFill.style.width = `${((step - 1) / (panels.length - 1)) * 100}%`;
    back.hidden = step === 1;
    next.hidden = step === panels.length;
    submit.hidden = step !== panels.length;
    if (step === panels.length) updateSummary();
    if (moveFocus) {
      const heading = panels[step - 1].querySelector('h3');
      if (heading) heading.focus({ preventScroll: true });
    }
  };
  const validate = () => {
    if (step === 1 && selectedProcedures().length === 0) {
      document.getElementById('procedure-error').hidden = false;
      form.querySelector('input[name="procedures"]').focus();
      return false;
    }
    if (step === 2 && !selectedPeriod()) {
      document.getElementById('period-error').hidden = false;
      form.querySelector('input[name="period"]').focus();
      return false;
    }
    return true;
  };

  form.querySelectorAll('input[name="procedures"]').forEach(input => input.addEventListener('change', () => {
    const unsure = form.querySelector('input[value="Ainda não sei por onde começar"]');
    if (input === unsure && input.checked) form.querySelectorAll('input[name="procedures"]').forEach(other => { if (other !== unsure) other.checked = false; });
    else if (input.checked && unsure.checked) unsure.checked = false;
    document.getElementById('procedure-error').hidden = selectedProcedures().length > 0;
  }));
  form.querySelectorAll('input[name="period"]').forEach(input => input.addEventListener('change', () => { document.getElementById('period-error').hidden = true; }));
  details.addEventListener('input', () => { count.textContent = String(details.value.length); });
  next.addEventListener('click', () => { if (validate()) showStep(step + 1); });
  back.addEventListener('click', () => showStep(step - 1));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (step !== panels.length) return;
    updateSummary();
    const message = [
      'Olá! Vi o site da Dra Izabelle e gostaria de saber mais sobre uma avaliação.',
      `Procedimentos ou interesses: ${selectedProcedures().join(', ')}.`,
      `Período preferido: ${selectedPeriod()}.`,
      details.value.trim() ? `O que gostaria de conversar: ${details.value.trim()}` : ''
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/553190967816?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
  showStep(1, false);
})();


