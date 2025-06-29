export function handleFooterDisplay() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");

  const footerOnline = document.querySelector(".footeronline");
  const footerLive = document.querySelector(".footerlive");
  const ivrSection = document.querySelector(".ivr-section");

  if (footerOnline) footerOnline.style.display = "none";
  if (footerLive) footerLive.style.display = "none";

  if (status === "online") {
    if (footerOnline) footerOnline.style.display = "block";

    // Hardere verwijdering: zowel uit DOM als met display none fallback
    if (ivrSection) {
      ivrSection.parentNode.removeChild(ivrSection); // Verwijder DOM-element
    }

  } else if (status === "live") {
    if (footerLive) footerLive.style.display = "block";
    // ivr blijft staan
  } else {
    // Onbekende status = blokkeren
    document.body.innerHTML = `
      <div style="padding:40px; text-align:center; font-family:sans-serif;">
        <h1>Pagina niet bereikbaar</h1>
        <p>Helaas, we kunnen deze pagina niet vinden.</p>
      </div>
    `;
    document.body.style.backgroundColor = "#f8d7da";
    document.body.style.color = "#721c24";
  }
}
