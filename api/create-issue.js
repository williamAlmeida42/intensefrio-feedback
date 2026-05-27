module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const { nome, cidade, nota, mensagem } = req.body || {};
  if (!mensagem || !nome) return res.status(400).json({error:'Missing fields'});

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const OWNER = process.env.GITHUB_REPO_OWNER || 'williams-projects-ded38909';
  const REPO = process.env.GITHUB_REPO_NAME || 'intensefrio-feedback';

  if (!GITHUB_TOKEN) return res.status(500).json({error:'Server misconfigured'});

  const title = `Elogio — ${nome}${cidade?` (${cidade})`:''}`;
  const body = `**Nome:** ${nome}\n**Cidade:** ${cidade || '—'}\n**Nota:** ${nota || '—'}\n\n${mensagem}`;

  try {
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, body, labels: ['mural'] })
    });
    const data = await r.json();
    if (!r.ok) return res.status(500).json({error: data});
    return res.status(200).json({ok:true, issue: data.html_url});
  } catch (err) {
    console.error(err);
    return res.status(500).json({error:'Unexpected error'});
  }
};
