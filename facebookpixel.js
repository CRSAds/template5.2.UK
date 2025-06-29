// facebookpixel.js

console.log('✅ facebookpixel.js geladen');

// Deze functie vuurt het Facebook 'Lead' event alleen als de URL afkomstig is van een FB-campagne
export function fireFacebookLeadEventIfNeeded() {
  const params = new URLSearchParams(window.location.search);
  const source = params.get('utm_source');

  if (source && source.toLowerCase() === 'facebook') {
    if (typeof fbq === 'function') {
      console.log("📌 Facebook pixel triggeren → Lead");
      fbq('track', 'Lead');
    } else {
      console.warn("⚠️ Facebook Pixel (fbq) is niet beschikbaar op deze pagina");
    }
  } else {
    console.log("ℹ️ Facebook pixel → niet getriggerd (utm_source is geen facebook)");
  }
}
