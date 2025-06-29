export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { filePath, content, commitMessage = 'Automated update via API' } = req.body;

  if (!filePath || !content) {
    return res.status(400).json({ success: false, message: 'filePath en content zijn verplicht' });
  }

  const githubToken = process.env.github_token;
  const owner = 'CRSAds';            // ← pas aan naar jouw GitHub org/user
  const repo = 'template5.2';         // ← jouw repo naam
  const branch = 'main';              // ← of 'master'

  const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  try {
    const getRes = await fetch(`${fileUrl}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      }
    });

    const getData = await getRes.json();

    const updateRes = await fetch(fileUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: commitMessage,
        content: Buffer.from(content, 'utf8').toString('base64'),
        sha: getData.sha,
        branch
      })
    });

    const updateData = await updateRes.json();

    if (updateRes.ok) {
      return res.status(200).json({ success: true, message: 'Bestand geüpdatet in GitHub', url: updateData.content?.html_url });
    } else {
      return res.status(updateRes.status).json({ success: false, message: 'Fout bij GitHub update', details: updateData });
    }
  } catch (error) {
    console.error('GitHub update error:', error);
    return res.status(500).json({ success: false, message: 'Interne fout', error: String(error) });
  }
}
