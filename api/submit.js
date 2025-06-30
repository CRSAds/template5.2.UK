let recentIps = new Map();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const {
      cid,
      sid,
      gender,
      firstname,
      lastname,
      dob_day,
      dob_month,
      dob_year,
      f_5_dob,
      email,
      f_6_address1,
      f_9_towncity,
      f_11_postcode,
      f_12_phone1,
      t_id,
      f_1322_transaction_id,
      f_2014_coreg_answer,
      f_1453_campagne_url,
      f_1684_sub_id,
      f_1685_aff_id,
      f_1687_offer_id,
      f_2047_EM_CO_sponsors
    } = req.body;

    console.log('📦 Long form data ontvangen (f_velden):', {
      f_6_address1,
      f_9_towncity,
      f_11_postcode,
      f_12_phone1
    });

    if (!cid || !sid) {
      return res.status(400).json({ success: false, message: 'Campagnegegevens ontbreken' });
    }

    const ipaddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '';
    const safeTId = f_1322_transaction_id || t_id || 'unknown';

    const ipKey = `${ipaddress}_${cid}_${sid}`;
    const now = Date.now();
    if (recentIps.get(ipKey) && now - recentIps.get(ipKey) < 60000) {
      return res.status(200).json({ success: false, blocked: true, reason: 'duplicate_ip' });
    }
    recentIps.set(ipKey, now);

    const emailLower = (email || '').toLowerCase();
    const suspiciousPatterns = [
      /(?:[a-z]{3,}@teleworm\.us)/i,
      /(?:michaeljm)+/i,
      /^[a-z]{3,12}jm.*@/i,
      /^[a-z]{4,}@gmail\.com$/i,
      /^[a-z]*[M]{2,}/i
    ];
    if (suspiciousPatterns.some(p => p.test(emailLower))) {
      return res.status(200).json({ success: false, blocked: true, reason: 'suspicious_email' });
    }

    const optindate = new Date().toISOString().split('.')[0] + '+0000';

    const params = new URLSearchParams({
      cid: String(cid),
      sid: String(sid),
      f_2_title: (gender || '').toString().trim(),
      f_3_firstname: (firstname || '').toString().trim(),
      f_4_lastname: (lastname || '').toString().trim(),
      f_1_email: (email || '').toString().trim(),
      f_5_dob: (f_5_dob || '').toString().trim(),
      f_6_address1: (f_6_address1 || '').toString().trim(),
      f_7_address2: '',
      f_9_towncity: (f_9_towncity || '').toString().trim(),
      f_11_postcode: (f_11_postcode || '').toString().trim(),
      f_12_phone1: (f_12_phone1 || '').toString().trim(),
      f_17_ipaddress: ipaddress,
      f_55_optindate: optindate,
      f_1322_transaction_id: safeTId,
      f_2014_coreg_answer: (f_2014_coreg_answer || '').toString().trim(),
      f_1453_campagne_url: (f_1453_campagne_url || '').toString().trim(),
      f_1684_sub_id: (f_1684_sub_id || '').toString().trim(),
      f_1685_aff_id: (f_1685_aff_id || '').toString().trim(),
      f_1687_offer_id: (f_1687_offer_id || '').toString().trim(),
      f_2047_EM_CO_sponsors: (f_2047_EM_CO_sponsors || '').toString().trim()
    });

    const response = await fetch('https://crsadvertising.databowl.com/api/v1/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: params.toString()
    });

    const result = await response.json();
    console.log('✅ Databowl antwoord:', result);

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('❌ Fout bij verzenden naar Databowl:', error);
    return res.status(500).json({ success: false, message: 'Interne fout bij verzenden' });
  }
}
