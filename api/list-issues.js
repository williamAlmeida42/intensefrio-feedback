module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({error:'Method not allowed'});
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const OWNER = process.env.GITHUB_REPO_OWNER || 'williams-projects-ded38909';
  const REPO = process.env.GITHUB_REPO_NAME || 'intensefrio-feedback';
  if (!GITHUB_TOKEN) return res.status(500).json({error:'Server misconfigured'});

  try {
    // List only approved mural issues (label: mural)
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues?labels=mural&state=open&per_page=100` , {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' }
    });
    const issues = await r.json();
    if (!Array.isArray(issues)) return res.status(500).json({error:issues});
    const simplified = issues.map(i=>({title:i.title, body:i.body, url:i.html_url, created_at:i.created_at}));
    return res.status(200).json({ok:true, issues: simplified});
  } catch (err) {
    console.error(err);
    return res.status(500).json({error:'Unexpected error'});
  }
};
