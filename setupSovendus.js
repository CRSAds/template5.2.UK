let hasInitialized = false;

export default function setupSovendus() {
  if (hasInitialized) {
    console.log("⚠️ setupSovendus al uitgevoerd — wordt overgeslagen");
    return;
  }
  hasInitialized = true;

  console.log("👉 setupSovendus gestart");

  const containerId = 'sovendus-container-1';
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`❌ Container #${containerId} niet gevonden`);
    return;
  }

  // ➕ Verwijder eventueel eerder iframe (herhaalbeveiliging)
  container.innerHTML = '';

  // Stap 1: Voeg tijdelijk laadbericht toe
  const loadingMessage = document.getElementById('sovendus-loading');
  if (!loadingMessage) {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'sovendus-loading';
    loadingDiv.style.textAlign = 'center';
    loadingDiv.style.padding = '16px';
    loadingDiv.innerHTML = `<p style="font-size: 16px;">Please wait… your reward is loading!</p>`;
    container.parentNode.insertBefore(loadingDiv, container);
  }

  // Stap 2: Gegevens ophalen uit localStorage
  const t_id = sessionStorage.getItem('t_id') || crypto.randomUUID();
  const gender = sessionStorage.getItem('gender') || '';
  const firstname = sessionStorage.getItem('firstname') || '';
  const lastname = sessionStorage.getItem('lastname') || '';
  const email = sessionStorage.getItem('email') || '';
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);

  // Stap 3: Zet global consumer object
  window.sovConsumer = {
    consumerSalutation: gender,
    consumerFirstName: firstname,
    consumerLastName: lastname,
    consumerEmail: email
  };

  // Stap 4: Zet global iframe configuratie
  window.sovIframes = window.sovIframes || [];
  window.sovIframes.push({
    trafficSourceNumber: '7675',
    trafficMediumNumber: '1',
    sessionId: t_id,
    timestamp: timestamp,
    orderId: '',
    orderValue: '',
    orderCurrency: '',
    usedCouponCode: '',
    iframeContainerId: containerId
  });

  // Stap 5: Laad flexibleIframe.js
  const script = document.createElement('script');
  script.src = 'https://api.sovendus.com/sovabo/common/js/flexibleIframe.js';
  script.async = true;

  script.onload = () => {
    console.log('✅ Sovendus → flexibleIframe.js geladen');

    // Verwijder laadbericht zodra iframe geladen is
    const loadingEl = document.getElementById('sovendus-loading');
    if (loadingEl) loadingEl.remove();
  };

  script.onerror = () => {
    console.error('❌ Fout bij laden van flexibleIframe.js');
  };

  document.body.appendChild(script);
}
