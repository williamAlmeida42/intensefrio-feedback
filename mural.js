const REPO_OWNER = 'williams-projects-ded38909';
const REPO_NAME = 'intensefrio-feedback';

async function fetchElogios() {
  const list = document.getElementById('mural-list');
  list.innerHTML = '<p class="muted">Carregando elogios...</p>';
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=mural&state=open`);
    const issues = await res.json();
    if (!Array.isArray(issues)) throw new Error('Erro ao buscar');
    if (issues.length === 0) {
      list.innerHTML = '<p class="muted">Seja o primeiro a deixar um elogio!</p>';
      return;
    }
    list.innerHTML = issues.map(i => `
      <article class="mural-item">
        <h3>${escapeHtml(i.title)}</h3>
        <p>${escapeHtml(i.body)}</p>
        <small class="muted">Publicado</small>
      </article>
    `).join('');
  } catch (err) {
    list.innerHTML = '<p class="muted">Não foi possível carregar os elogios.</p>';
    console.error(err);
  }
}

function escapeHtml(str){
  if(!str) return '';
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]);
}

document.getElementById('mural-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const status = document.getElementById('mural-status');
  status.textContent = 'Enviando...';
  const data = {
    nome: document.getElementById('nome').value.trim(),
    cidade: document.getElementById('cidade').value.trim(),
    nota: document.getElementById('nota').value,
    mensagem: document.getElementById('mensagem').value.trim()
  };
  try {
    const res = await fetch('/api/create-issue', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao enviar');
    status.textContent = 'Elogio enviado — obrigado!';
    document.getElementById('mural-form').reset();
    setTimeout(()=> status.textContent = '', 4000);
    fetchElogios();
  } catch (err) {
    status.textContent = 'Erro ao enviar. Tente novamente.';
    console.error(err);
  }
});

// carregar ao abrir
fetchElogios();
