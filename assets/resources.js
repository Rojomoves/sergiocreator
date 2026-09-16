(() => {
  'use strict';
  document.querySelectorAll('[data-copy]').forEach(button => {
    const original = button.innerHTML;
    const target = document.getElementById(button.dataset.copy);
    const status = button.closest('.resource-container').querySelector('.copy-status');
    let resetTimer;
    button.addEventListener('click', async () => {
      clearTimeout(resetTimer);
      try {
        await navigator.clipboard.writeText(target.textContent);
        button.textContent = '✓ Copiado';
        status.textContent = 'Listo. Pégalo en tu herramienta de IA para empezar.';
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(target);
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = 'Texto seleccionado. Usa la opción Copiar de tu dispositivo o Ctrl/Cmd + C.';
        target.focus({ preventScroll: true });
      }
      resetTimer = setTimeout(() => { button.innerHTML = original; }, 3000);
    });
  });
  const applied = document.querySelector('#applyBtn');
  if (applied) {
    applied.addEventListener('click', () => {
      const next = applied.getAttribute('aria-pressed') !== 'true';
      applied.setAttribute('aria-pressed', String(next));
      applied.classList.toggle('applied', next);
      applied.textContent = next ? '¡Aplicado con éxito! ✓' : 'Marcar como aplicado ✓';
    });
  }
})();
