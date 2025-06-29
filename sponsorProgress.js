document.addEventListener("DOMContentLoaded", () => {
  const sponsorSteps = Array.from(document.querySelectorAll('.sponsor-step'));
  if (!sponsorSteps.length) return;

  const total = sponsorSteps.length;
  const wrapper = document.createElement('div');
  wrapper.id = 'sponsor-progress-wrapper';
  wrapper.innerHTML = `
    <div id="sponsor-progress-text">Bijna klaar, nog enkele vragen</div>
    <div id="sponsor-progress-container">
      <div id="sponsor-progress-fill"></div>
    </div>
  `;
  document.body.appendChild(wrapper);

  const fill = document.getElementById('sponsor-progress-fill');
  const label = document.getElementById('sponsor-progress-text');

  function updateProgress(index) {
    const percent = Math.round(((index + 1) / total) * 100);
    fill.style.width = `${percent}%`;
    label.textContent = `Bijna klaar, nog enkele vragen ${index + 1}/${total}`;
  }

  const observer = new MutationObserver(() => {
    // Gebruik setTimeout om DOM update af te wachten
    setTimeout(() => {
      const visible = sponsorSteps.find(s => s.offsetParent !== null);
      if (visible) {
        const index = sponsorSteps.indexOf(visible);
        updateProgress(index);
        wrapper.style.display = 'block';
      } else {
        wrapper.style.display = 'none';
      }
    }, 30); // 30ms is voldoende, eerder 50ms getest
  });

  observer.observe(document.body, { attributes: true, childList: true, subtree: true });

  // Initiele update (ook met vertraging)
  setTimeout(() => {
    const visible = sponsorSteps.find(s => s.offsetParent !== null);
    if (visible) {
      const index = sponsorSteps.indexOf(visible);
      updateProgress(index);
      wrapper.style.display = 'block';
    }
  }, 100); // init iets ruimer (100ms) zodat Swipe Pages zijn eerste sectie kan tonen
});
