export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clickId, email } = Object.fromEntries(new URLSearchParams(await req.text()));

  if (!clickId || !email) {
    return res.status(400).json({ error: 'Missing clickId or email' });
  }

  try {
    const response = await fetch('https://www.sovendus-connect.com/banner/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        trafficSourceNumber: '5592',
        trafficMediumNumber: '2',
        sessionId: clickId,
        email: email
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: 'Sovendus token fetch failed', detail: text });
    }

    const data = await response.json();

    if (data.sovToken && data.sessionUuid && data.identifier) {
      return res.status(200).json({
        sovToken: data.sovToken,
        sessionUuid: data.sessionUuid,
        identifier: data.identifier
      });
    } else {
      return res.status(500).json({ error: 'Sovendus response incomplete', data });
    }
  } catch (err) {
    console.error('Fout in proxy:', err);
    return res.status(500).json({ error: 'Proxy error', detail: err.message });
  }
}
