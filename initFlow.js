import { reloadImages } from './imageFix.js';
import { fetchLead, buildPayload } from './formSubmit.js';
import sponsorCampaigns from './sponsorCampaigns.js';
import setupSovendus from './setupSovendus.js';
import { fireFacebookLeadEventIfNeeded } from './facebookpixel.js';

const longFormCampaigns = [];
window.longFormCampaigns = longFormCampaigns;
let hasSubmittedShortForm = false;

function isSuspiciousLead(email) {
  const suspiciousPatterns = [
    /@teleworm\.us$/i,
    /michaeljm/i,
    /[a-z]{3,12}jm.*@/i,
    /[Mm]{3,}/
  ];
  return suspiciousPatterns.some(pattern => pattern.test(email));
}

function validateForm(form) {
  let valid = true;
  let messages = [];

  if (form.id === 'lead-form') {
    const gender = form.querySelector('input[name="gender"]:checked');
    const firstname = form.querySelector('#firstname')?.value.trim();
    const lastname = form.querySelector('#lastname')?.value.trim();
    const dob_day = form.querySelector('#dob-day')?.value.trim();
    const dob_month = form.querySelector('#dob-month')?.value.trim();
    const dob_year = form.querySelector('#dob-year')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();

    if (!gender) messages.push('Please select a title');
    if (!firstname) messages.push('Enter first name');
    if (!lastname) messages.push('Enter last name');
    if (!dob_day || !dob_month || !dob_year) messages.push('Enter complete date of birth');
    if (!email || !email.includes('@') || !email.includes('.')) {
      messages.push('Enter a valid email address');
    }

    valid = messages.length === 0;
  }

  if (form.id === 'long-form') {
    const postcode = form.querySelector('#postcode')?.value.trim();
    const address3 = form.querySelector('#address3')?.value.trim();
    const towncity = form.querySelector('#towncity')?.value.trim();
    const phone1 = form.querySelector('#phone1')?.value.trim();

    if (!address3) messages.push('Enter your address');
    if (!towncity) messages.push('Enter your town or city');
    if (!postcode) messages.push('Enter postcode');
    if (!phone1) messages.push('Enter phone number');
    else if (phone1.length > 11) messages.push('Phone number can be max. 11 digits');

    valid = messages.length === 0;
  }

  if (!valid) {
    alert('Please complete all fields correctly:\n' + messages.join('\n'));
  }

  return valid;
}

export default function initFlow() {
  const params = new URLSearchParams(window.location.search);
  const statusParam = params.get('status');

  const longFormSection = document.getElementById('long-form-section');
  if (longFormSection) {
    longFormSection.style.display = 'none';
    longFormSection.setAttribute('data-displayed', 'false');
  }

  const steps = Array.from(document.querySelectorAll('.flow-section, .coreg-section'))
    .filter(step => {
      if (statusParam === 'online') {
        return !step.classList.contains('status-live') && !step.classList.contains('ivr-section');
      }
      if (statusParam === 'live') return true;
      return false;
    });

  longFormCampaigns.length = 0;

  if (!window.location.hostname.includes("swipepages.com")) {
    steps.forEach((el, i) => el.style.display = i === 0 ? 'block' : 'none');
    document.querySelectorAll('.hide-on-live, #long-form-section').forEach(el => {
      el.style.display = 'none';
    });
  }

  steps.forEach((step, stepIndex) => {
    step.querySelectorAll('.flow-next').forEach(btn => {
      btn.addEventListener('click', () => {
        const skipNext = btn.classList.contains('skip-next-section');
        const isFinalCoreg = btn.classList.contains('final-coreg');

        if (isFinalCoreg && longFormCampaigns.length === 0) {
          step.style.display = 'none';
          const next = steps[stepIndex + 2];
          if (next) {
            next.style.display = 'block';
            reloadImages(next);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        const campaignId = step.id?.startsWith('campaign-') ? step.id : null;
        const campaign = sponsorCampaigns[campaignId];

        if (campaign?.coregAnswerKey && btn.classList.contains('sponsor-next')) {
          sessionStorage.setItem(campaign.coregAnswerKey, btn.innerText.trim());
        }

        if (step.id === 'voorwaarden-section' && !btn.id) {
          sessionStorage.removeItem('sponsor_optin');
        }

        const form = step.querySelector('form');
        const isShortForm = form?.id === 'lead-form';

        if (form && !validateForm(form)) return;

        if (form) {
          const gender = form.querySelector('input[name="gender"]:checked')?.value || '';
          const firstname = form.querySelector('#firstname')?.value.trim() || '';
          const lastname = form.querySelector('#lastname')?.value.trim() || '';
          const dob_day = form.querySelector('#dob-day')?.value || '';
          const dob_month = form.querySelector('#dob-month')?.value || '';
          const dob_year = form.querySelector('#dob-year')?.value || '';
          const email = form.querySelector('#email')?.value.trim() || '';
          const urlParams = new URLSearchParams(window.location.search);
          const t_id = urlParams.get('t_id') || crypto.randomUUID();

          sessionStorage.setItem('gender', gender);
          sessionStorage.setItem('firstname', firstname);
          sessionStorage.setItem('lastname', lastname);
          sessionStorage.setItem('dob_day', dob_day);
          sessionStorage.setItem('dob_month', dob_month);
          sessionStorage.setItem('dob_year', dob_year);
          sessionStorage.setItem('email', email);
          sessionStorage.setItem('t_id', t_id);

          if (isShortForm && !hasSubmittedShortForm) {
            hasSubmittedShortForm = true;
            const includeSponsors = !(step.id === 'voorwaarden-section' && !btn.id);
            const payload = buildPayload(sponsorCampaigns["campaign-leadsuk"], { includeSponsors });

            console.log("📦 Payload voor verzending:", payload);

            if (!payload.f_1453_campagne_url?.includes('?status=online')) {
              console.error("❌ URL mist status=online:", payload.f_1453_campagne_url);
              return;
            }

            if (isSuspiciousLead(email)) {
              console.warn("⛔ Verdachte lead geblokkeerd (short form):", email);
              step.style.display = 'none';
              const next = skipNext ? steps[stepIndex + 2] : steps[stepIndex + 1];
              if (next) {
                next.style.display = 'block';
                reloadImages(next);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
              return;
            }

            fetchLead(payload).then(() => {
              fireFacebookLeadEventIfNeeded();
              step.style.display = 'none';
              const next = skipNext ? steps[stepIndex + 2] : steps[stepIndex + 1];
              if (next) {
                next.style.display = 'block';
                reloadImages(next);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            });
          }

          if (form.id === 'long-form') {
            const payload = buildPayload(longFormCampaigns[0]);
            fetchLead(payload);
          }
        }

        // === BEGIN DROPDOWN SUPPORT ===
        // Voor coreg sponsors met een dropdown: waarde opslaan bij button click (Scottish Power & Life Insurance)
        if (
          campaign &&
          campaign.hasCoregFlow &&
          campaign.answerFieldKey === "f_2575_coreg_answer_dropdown"
        ) {
          // Zoek de dropdown in de huidige sectie
          const dropdown = step.querySelector('select[name="coreg-dropdown"]');
          if (dropdown) {
            const dropdownValue = dropdown.value;
            sessionStorage.setItem(`dropdown_answer_${campaignId}`, dropdownValue);
          }
        }
        // === END DROPDOWN SUPPORT ===

        step.style.display = 'none';
        const next = skipNext ? steps[stepIndex + 2] : steps[stepIndex + 1];
        if (next) {
          next.style.display = 'block';
          reloadImages(next);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // Select-eventhandlers (voor dropdowns) mogen blijven zoals ze zijn!

  });

  Object.entries(sponsorCampaigns).forEach(([campaignId, config]) => {
    if (config.hasCoregFlow && config.coregAnswerKey) {
      initGenericCoregSponsorFlow(campaignId, config.coregAnswerKey);
    }
  });

  const sovendusSection = document.getElementById('sovendus-section');
  const nextAfterSovendus = sovendusSection?.nextElementSibling;

  if (sovendusSection && nextAfterSovendus) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log("👀 Sovendus-sectie in beeld — setup en timer gestart");
          obs.unobserve(entry.target);

          setupSovendus();

          setTimeout(() => {
            console.log("⏱️ Timer afgelopen — doorgaan naar volgende sectie na Sovendus");
            sovendusSection.style.display = 'none';
            nextAfterSovendus.style.display = 'block';
            reloadImages(nextAfterSovendus);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 10000);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(sovendusSection);
  }
}

const coregAnswers = {};
window.coregAnswers = coregAnswers;

function initGenericCoregSponsorFlow(sponsorId, coregAnswerKey) {
  coregAnswers[sponsorId] = [];

  const allSections = document.querySelectorAll(`[id^="campaign-${sponsorId}"]`);
  allSections.forEach((section, index) => {
    const buttons = section.querySelectorAll('.flow-next');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const answerText = button.innerText.trim();
        coregAnswers[sponsorId].push(answerText);

        const isPositive = button.classList.contains('sponsor-optin') || button.classList.contains('sponsor-next');
        if (!isPositive) return;

        let nextStepId = '';
        button.classList.forEach(cls => {
          if (cls.startsWith('next-step-')) {
            nextStepId = cls.replace('next-step-', '');
          }
        });

        section.style.display = 'none';

        if (nextStepId) {
          const nextSection = document.getElementById(nextStepId);
          if (nextSection) {
            nextSection.style.display = 'block';
            reloadImages(nextSection);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
        }

        // Als dit de laatste stap is → combineer antwoorden en ga naar volgende coreg
        const isLastStep = index === allSections.length - 1;
        if (isLastStep) {
          handleGenericNextCoregSponsor(sponsorId, coregAnswerKey);
        } else {
          const next = allSections[index + 1];
          if (next) {
            next.style.display = 'block';
            reloadImages(next);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      });
    });
  });
}
