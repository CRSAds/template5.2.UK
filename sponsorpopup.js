const imageBaseUrl = "https://template5-2.vercel.app/assets/sponsorlogo/";

window.renderSponsorPopup = function (container) {
  const sponsorData = {
    heading: "Sponsors",
    intro: `Hieronder vindt u de sponsors van deze campagne welke u graag hun allerbeste deals en aanbiedingen willen laten zien. U kunt per sponsor aangeven of zij uw data mogen ontvangen, vink simpelweg het vakje naast of onder hun naam aan. Per sponsor is duidelijk aangegeven waarvoor zij contact met u willen opnemen, hoe vaak zij contact met u willen opnemen en via welke manier u gecontacteerd gaat worden (telefoon of email). Tevens staat er bij elke sponsor een link naar hun privacy voorwaarden. Wij raden aan dat u deze privacy voorwaarden doorneemt.`,
    sections: [
      {
        title: "\ud83d\udcde Telemarketing sponsors",
        sponsors: [
          {
            name: "My Collections",
            description: "My Collections biedt u vele voordelen...",
            logo: "mycollections.png",
            address: "My Collections BV\nOosteinde 137\n2271 EE Voorburg\nNederland",
            privacyLink: "https://mycollections.com/nl/klantenservice/privacy-statement",
            checkboxLabel: "Ik deel mijn gegevens met My Collections"
          },
          {
            name: "Raadselgids",
            description: "Wij brengen elke dag...",
            logo: "raadselgids.png",
            address: "Premium Services B.V\nBredaseweg 185\n4872LA, Etten-Leur\nNederland",
            privacyLink: "https://raadselgids.com/privacy-verklaring",
            checkboxLabel: "Ik deel mijn gegevens met Raadselgids"
          },
          {
            name: "Consubeheer",
            description: "Bespaar met onze energie specialisten...",
            logo: "consubeheer.png",
            address: "Jan Rebelstraat 14A\n1069CC Amsterdam\nNederland",
            privacyLink: "https://raadselgids.com/privacy-verklaring",
            checkboxLabel: "Ik deel mijn gegevens met Consubeheer"
          }
        ]
      },
      {
        title: "\ud83d\udce7 Email sponsors",
        sponsors: [
        {
  name: "Kiosk",
  description: "Ontvang nu de nieuwsbrief van Kiosk.nl met daarin de leukste artikelen, aanbiedingen en prijsvragen!",
  logo: "kiosk.png",
  address: "DPG Media BV\nVan der Madeweg 40\n1114AM Amsterdam-Duivendrecht",
  privacyLink: "https://privacy.dpgmedia.nl/nl/document/privacy-policy",
  checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
},
{
  name: "AD",
  description: "Ontvang dagelijks de nieuwsbrief van het Algemeen Dagblad met een overzicht van het belangrijkste nieuws.",
  logo: "ad.png",
  address: "DPG Media BV\nVan der Madeweg 40\n1114AM Amsterdam-Duivendrecht",
  privacyLink: "https://privacy.dpgmedia.nl/nl/document/privacy-policy",
  checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
},
{
  name: "De Volkskrant",
  description: "Ontvang dagelijks per email het laatste nieuws, scherpe analyses en achtergrondverhalen van de Volkskrant.",
  logo: "devolkskrant.png",
  address: "DPG Media BV\nVan der Madeweg 40\n1114AM Amsterdam-Duivendrecht",
  privacyLink: "https://privacy.dpgmedia.nl/nl/document/privacy-policy",
  checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
},
{
  name: "Spaar Actief",
  description: "SpaarActief is een van de populairste cashbackwebsites in Nederland. Verdien geld door aankopen, klikken of inschrijven.",
  logo: "spaaractief.png",
  address: "Spaaractief B.V.\nPostbus 216\n9600 AE, Hoogezand",
  privacyLink: "https://www.snelverdienen.nl/pages/privacy-policy/",
  checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
},
{
  name: "Direct Deals",
  description: "Direct Deals: de digitale nieuwsbrief met exclusieve deals en aanbiedingen rechtstreeks in je inbox.",
  logo: "directdeals.png",
  address: "Lead2Sale\nGestelsestraat 28\n5615 LE Eindhoven\nNederland",
  privacyLink: "http://www.direct-deals.nl/privacy/",
  checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
},
{
  name: "Qliqs",
  description: "Krijg cashback op je online aankopen, ontvang beloningen voor het bekijken van aanbiedingen en meer met Qliqs.",
  logo: "qliqs.png",
  address: "Postbus 216\n9600 AE, Hoogezand",
  privacyLink: "https://www.qlics.nl/pages/privacy-policy/",
  checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
},
{
  name: "Outspot",
  description: "Outspot is een online aanbiedingensite met dagelijkse nieuwe deals op het gebied van reizen, gadgets, mode en meer.",
  logo: "outspot.png",
  address: "Dorp 16\n9830 Sint-Martens-Latem\nBelgië",
  privacyLink: "https://www.outspot.be/nl/privacybeleid",
  checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
},
          {
          name: "OnlineActies",
          description: "Onlineacties.com verbindt consumenten met interessante aanbiedingen van  uiteenlopende bedrijven. De aanbiedingen worden direct op de internetpagina aangeboden of later via e-mail, sms, whatsapp of telefoon.",
          logo: "onlineacties.png",
          address: "Papaverweg 177\n1032 KE Amsterdam",
          privacyLink: "https://www.onlineacties.com/",
          checkboxLabel: "Ja. Ik deel mijn gegevens met Online Acties"
        },
        {
          name: "AOW.nu",
          description: "AOW.nu mag u benaderen via email over het laatste AOW-nieuws, zoals AOW-bedragen, vakantiegeld, de stand van zaken bij de grootste pensioenfondsen en speciale (voordeel)acties voor 65-plussers.",
          logo: "aownu.png",
          address: "Tiengemetenstraat 19\n5628 KM Eindhoven",
          privacyLink: "https://www.aow.nu/privacyverklaring-eu/",
          checkboxLabel: "Ja. Ik deel mijn gegevens met AOW.nu"
        },
        {
          name: "BeterVrouw",
          description: "BeterVROUW is dé gratis wekelijkse nieuwsbrief voor vrouwen in Nederland met daarin onder andere inspirerende artikelen, uitgaanstips, exclusieve aanbiedingen, opinie peilingen en jouw week horoscoop.",
          logo: "betervrouw.png",
          address: "Papaverweg 177\n1032 KE Amsterdam",
          privacyLink: "https://betervrouw.nl/",
          checkboxLabel: "Ja. Ik deel mijn gegevens met Beter Vrouw"
        },
        {
          name: "iPay",
          description: "OrangeBuddies is gespecialiseerd in online cashback & loyalty portals met als doel toegevoegde waarde te bieden voor zowel consumenten als adverteerders.",
          logo: "ipay.png",
          address: "Bruggestraat 49-2\n3841 CM Harderwijk",
          privacyLink: "https://www.ipay.nl/static/privacy",
          checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
        },
        {
          name: "Cashback Korting",
          description: "CashbackKorting is hét startpunt voor online shoppen met korting. Met een aanbod van ruim 35.000 webshops, uitgebreide winkelinformatie, producttrends, inspiratie en korting bij alle aangesloten webshops.",
          logo: "cashbackkorting.png",
          address: "Deventerweg 1C\n3843 GA Harderwijk",
          privacyLink: "https://www.cashbackkorting.nl/privacy",
          checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
        },
        {
          name: "Cash Hier",
          description: "Hier krijg je betaalt voor elke muisklik, je kunt bijvoorbeeld dagelijks klikken op advertenties, meedoen aan acties, aankopen met cashback doen en vergeet de referrals niet.",
          logo: "cashhier.png",
          address: "Postbus 216\n9600 AE, Hoogezand",
          privacyLink: "https://www.cashhier.nl/pages/privacy-policy/",
          checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
        },
        {
          name: "MyClics",
          description: "MyClics is een online loyaliteitsprogramma. Maak snel een account aan, en je kunt direct beginnen met online geld verdienen en besparen.",
          logo: "myclics.png",
          address: "Postbus 216\n9600 AE, Hoogezand",
          privacyLink: "https://www.myclics.nl/pages/privacy-policy/",
          checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
        },
        {
          name: "Seniorenvoordeelpas",
          description: "Online shoppen via Seniorenvoordeelpas werkt eenvoudig: wanneer u via onze website een aankoop doet, ontvangen wij een verkoopcommissie van de webshop, die wij aan u teruggeven.",
          logo: "seniorenvoordeelpas.png",
          address: "Deventerweg 1C\n3843 GA\nHarderwijk",
          privacyLink: "https://www.seniorenvoordeelpas.nl/privacy-statementnl",
          checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
        },
        {
          name: "Favoriete Acties",
          description: "Blijf altijd op de hoogte van de beste aanbiedingen! Schrijf je in en ontvang regelmatig de scherpste deals direct in je inbox.",
          logo: "favorieteacties.png",
          address: "Weena 788\n3014 DA\nRotterdam",
          privacyLink: "https://favorieteacties.nl/privacy",
          checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
        },
        {
          name: "Spaar Online",
          description: "Verdien en bespaar op je online aankopen en breng vrienden en/of familie aan. Verdien ook geld door te klikken op banners en emails.",
          logo: "spaaronline.png",
          address: "Postbus 15\n5750AA DEURNE\nNederland",
          privacyLink: "https://www.spaar-online.nl/pages/privacy-policy/",
          checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
        },
        {
          name: "Cashback Acties",
          description: "Bij Cashback acties begrijpen we dat iedereen op zoek is naar de beste deals en besparingen. Daarom bieden we een eenvoudige en effectieve manier om geld terug te krijgen bij uw online aankopen.",
          logo: "cashbackacties.png",
          address: "Postbus 15\n5750AA DEURNE\nNederland",
          privacyLink: "https://www.cashbackacties.nl/pages/privacy-policy/",
          checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
        },
        {
          name: "Woolsocks",
          description: "Woolsocks mag u benaderen via email met informatie en promoties gerelateerd aan de Woolstocks producten en diensten.",
          logo: "woolsocks.png",
          address: "Woolsocks AG\nNeustadtstrasse 7\n6003 Luzern\nSwitzerland",
          privacyLink: "https://woolsocks.eu/privacy-and-cookie-statement/index.html",
          checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
        },
        {
          name: "Dealdonkey",
          description: "DealDonkey is het online platform om dagelijks de scherpste dagdeals te scoren. Dealdonkey stuurt een dagelijkse nieuwsbrief met de scherpste en meest voordelige aanbiedingen.",
          logo: "dealdonkey.png",
          address: "DealDonkey\nHaverstraat 31\n2153 GB\nNieuw-Vennep\nKvK: 52030873",
          privacyLink: "https://woolsocks.eu/privacy-and-cookie-statement/index.html",
          checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
        },
        {
          name: "Yuccies",
          description: "Yuccies biedt een online spaarprogramma, waarmee Gebruikers geld kunnen verdienen door bijvoorbeeld het lezen van commerciële e-mails of het uitproberen van producten.",
          logo: "yuccies.png",
          address: "CY Online B.V.\nH.o.d.n. Yuccies\nPostbus 161\n1440 AD Purmerend",
          privacyLink: "https://www.yuccies.nl/pages/privacy-policy/",
          checkboxLabel: "Ja. Ik wil de emailnieuwsbrief ontvangen"
          }
        ]
      }
    ]
  };

  if (!container) return;

  const html = sponsorData.sections.map(section => {
    const sponsorsHTML = section.sponsors.map(s => `
      <div class="sponsor-entry" style="margin-bottom:24px;">
        <h3>${s.name}</h3>
        <p>${s.description}</p>
        <img src="${imageBaseUrl + s.logo}" alt="${s.name} logo" style="max-width:100px;margin:10px 0;">
        <p>${s.address.replace(/\n/g, '<br>')}</p>
        <a href="${s.privacyLink}" target="_blank">Privacy Policy</a><br>
        <label><input type="checkbox" name="sponsor-${s.name}"> ${s.checkboxLabel}</label>
      </div>
    `).join('');

    return `
      <section>
        <h2>${section.title}</h2>
        ${sponsorsHTML}
      </section>
    `;
  }).join('');

  container.innerHTML = `
    <div class="sponsor-popup-content">
      <h1>${sponsorData.heading}</h1>
      <p>${sponsorData.intro}</p>
      ${html}
    </div>
  `;
};
