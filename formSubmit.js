// formSubmit.js
import { reloadImages } from './imageFix.js';
import sponsorCampaigns from './sponsorCampaigns.js';

window.sponsorCampaigns = sponsorCampaigns;
window.submittedCampaigns = window.submittedCampaigns || new Set(); // aangepast

const sponsorOptinUK = `crs_ja wowcher_ja superescapes_ja goodlifeplus_ja gogroopie_ja firstprizelottos_ja discountexperts_ja outspot_ja adviceglobal_ja scottishpower_ja prizereactor_ja utilita_ja Hutchison_ja britishgas_ja skyuk_ja yourlottoservice_ja onefamily_ja auramediagroup_ja secureforlife_ja protectyourfamily_ja`;

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('accept-sponsors-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      sessionStorage.setItem('sponsor_optin', sponsorOptinText);
    });
  }

  const day = document.getElementById("dob-day");
  const month = document.getElementById("dob-month");
  const year = document.getElementById("dob-year");

  if (day) {
    day.addEventListener("input", () => {
      if (day.value.length === 2 || parseInt(day.value[0], 10) >= 4) month.focus();
    });
  }

  if (month) {
    month.addEventListener("input", () => {
      if (month.value.length === 2 || parseInt(month.value[0], 10) >= 2) year.focus();
    });
  }
});

export function buildPayload(campaign, options = { includeSponsors: true }) {
  const urlParams = new URLSearchParams(window.location.search);
  const t_id = urlParams.get("t_id") || crypto.randomUUID();
  const aff_id = urlParams.get("aff_id") || '';
  const sub_id = urlParams.get("sub_id") || '';
  const offer_id = urlParams.get("offer_id") || '';

  const campaignUrl = `${window.location.origin}${window.location.pathname}?status=online`;

  const dob_day = sessionStorage.getItem('dob_day');
  const dob_month = sessionStorage.getItem('dob_month');
  const dob_year = sessionStorage.getItem('dob_year');
  const dob_iso = dob_year && dob_month && dob_day
    ? `${dob_year.padStart(4, '0')}-${dob_month.padStart(2, '0')}-${dob_day.padStart(2, '0')}`
    : '';

  const isShortForm = campaign.cid === 1123;

  const payload = {
    cid: campaign.cid,
    sid: campaign.sid,
    gender: sessionStorage.getItem('gender'),
    firstname: sessionStorage.getItem('firstname'),
    lastname: sessionStorage.getItem('lastname'),
    email: sessionStorage.getItem('email'),
    dob_day,
    dob_month,
    dob_year,
    f_5_dob: dob_iso,
    campaignId: Object.keys(sponsorCampaigns).find(key => sponsorCampaigns[key].cid === campaign.cid),
    f_1453_campagne_url: campaignUrl,
    f_1322_transaction_id: t_id,
    f_1684_sub_id: sub_id,
    f_1685_aff_id: aff_id,
    f_1687_offer_id: offer_id
  };

if (!isShortForm) {
  payload.postcode = sessionStorage.getItem('postcode') || '';
  payload.address3 = sessionStorage.getItem('address3') || '';
  payload.towncity = sessionStorage.getItem('towncity') || '';
  payload.phone1 = sessionStorage.getItem('phone1') || '';
}

  if (campaign.coregAnswerKey) {
    payload.f_2014_coreg_answer = sessionStorage.getItem(campaign.coregAnswerKey) || '';
  }

  if (campaign.cid === 925 && options.includeSponsors) {
    const optin = sessionStorage.getItem('sponsor_optin');
    if (optin) {
      payload.f_2047_EM_CO_sponsors = optin;
    }
  }

  console.log("📦 Payload opgebouwd voor campaign:", campaign.cid, payload);
  return payload;
}

export async function fetchLead(payload) {
  const key = `${payload.cid}_${payload.sid}`;

  // Extra logging
  console.log("🔎 submittedCampaigns inhoud:", [...window.submittedCampaigns]);
  console.log("🔍 Controle op key:", key);

  // ✅ Check of al verzonden
  if (window.submittedCampaigns.has(key)) {
    console.log("✅ Lead al verzonden, overslaan");
    return Promise.resolve({ skipped: true });
  }

  try {
    const response = await fetch('https://template5-2.vercel.app/api/submit', {      
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log("✅ API antwoord:", result);

    // ✅ Pas hier markeren als verzonden, na succesvolle API call
    window.submittedCampaigns.add(key);

    return result;
  } catch (error) {
    console.error("❌ Fout bij API call:", error);
    throw error;
  }
}

export function validateLongForm(form) {
  let valid = true;
  let messages = [];

  const postcode = form.querySelector('#postcode')?.value.trim();
  const address3 = form.querySelector('#address3')?.value.trim();
  const towncity = form.querySelector('#towncity')?.value.trim();
  const phone1 = form.querySelector('#phone1')?.value.trim();

  if (!address3) messages.push('Enter your address');
  if (!towncity) messages.push('Enter your town or city');
  if (!postcode) messages.push('Enter postcode');
  if (!phone1) messages.push('Enter phone number');
  else if (phone1.length > 11) messages.push('Phone number can be max. 11 digits');

  if (messages.length > 0) {
    alert('Please complete all fields correctly:\n' + messages.join('\n'));
    valid = false;
  }

  return valid;
}

export function setupFormSubmit() {
  const btn = document.getElementById('submit-long-form');
  const section = document.getElementById('long-form-section');
  if (!btn || !section) return;

  btn.addEventListener('click', () => {
    const form = section.querySelector('form');
    if (!validateLongForm(form)) return;

['postcode', 'address3', 'towncity', 'phone1'].forEach(id => {
  const val = document.getElementById(id)?.value.trim();
  if (val) sessionStorage.setItem(id, val);
});

    if (Array.isArray(window.longFormCampaigns)) {
      window.longFormCampaigns.forEach(campaign => {
        const answer = sessionStorage.getItem(campaign.coregAnswerKey || '');
        const isPositive = answer && ['ja', 'yes', 'akkoord'].some(word =>
          answer.toLowerCase().includes(word)
        );

        console.log("📨 Long form verwerking:", {
          campaignId: campaign.cid,
          coregAnswerKey: campaign.coregAnswerKey,
          antwoord: answer,
          isPositive
        });

        if (isPositive) {
          const payload = buildPayload(campaign);
          fetchLead(payload);
        } else {
          console.log(`⛔️ Lead NIET verstuurd voor ${campaign.cid} → antwoord was:`, answer);
        }
      });
    }

    section.style.display = 'none';
    const steps = Array.from(document.querySelectorAll('.flow-section, .coreg-section'));
    const idx = steps.findIndex(s => s.id === 'long-form-section');
    const next = steps[idx + 1];

    if (next) {
      next.classList.remove('hide-on-live');
      next.style.removeProperty('display');
      reloadImages(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}
