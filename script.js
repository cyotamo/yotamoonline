// ====== Dados editáveis (troca pelos teus) ======
const updates = [
  { data: "18/12/2025", texto: "Publicadas orientações para submissão de trabalhos (PDF) na disciplina X." },
  { data: "15/12/2025", texto: "Aberta chamada para o Grupo de Pesquisa em Políticas Públicas e Desenvolvimento." },
  { data: "10/12/2025", texto: "Novos temas sugeridos para monografias: inovação, descentralização, empregabilidade." },
];

const pesquisa = [
  { tipo: "artigo", titulo: "Microfinanças e empoderamento económico: revisão teórica", ano: 2025, resumo: "Síntese de literatura e principais abordagens.", link: "#" },
  { tipo: "projecto", titulo: "Parcerias público-privadas e transparência em Moçambique", ano: 2025, resumo: "Linha de investigação sobre governação e accountability.", link: "#" },
  { tipo: "capitulo", titulo: "Economia Digital e Estado: desafios para a administração pública", ano: 2024, resumo: "Capítulo com enfoque em transformação digital.", link: "#" },
  { tipo: "projecto", titulo: "Empregabilidade pós-formação: estudo quantitativo", ano: 2025, resumo: "Instrumentos, variáveis e desenho metodológico.", link: "#" },
];

const grupos = [
  { titulo: "Grupo: Políticas Públicas & Governação", resumo: "Discussão de temas de descentralização, accountability e reforma do Estado.", contacto: "teuemail@exemplo.com" },
  { titulo: "Grupo: Economia & Desenvolvimento Local", resumo: "Pesquisa aplicada em empreendedorismo, finanças e desenvolvimento regional.", contacto: "teuemail@exemplo.com" },
];

const disciplinas = [
  { titulo: "Governo Electrónico", resumo: "Conceitos, serviços digitais, interoperabilidade, dados e cidadania digital.", materiais: "#" },
  { titulo: "Políticas Públicas", resumo: "Ciclo de políticas públicas, implementação, monitoria e avaliação.", materiais: "#" },
  { titulo: "Economia Digital", resumo: "Plataformas, inovação, mercados digitais e impactos económicos.", materiais: "#" },
];

// ====== Helpers UI ======
const el = (sel) => document.querySelector(sel);

function renderList() {
  // Ano no rodapé
  el("#year").textContent = new Date().getFullYear();

  // Updates
  const ul = el("#updatesList");
  ul.innerHTML = "";
  updates.slice(0, 4).forEach(u => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${u.data}</strong><br>${u.texto}`;
    ul.appendChild(li);
  });

  // Cards: Pesquisa
  renderCards(pesquisa, "#pesquisaCards", (item) => `
    <div class="card">
      <div class="card-title">${escapeHtml(item.titulo)}</div>
      <p><strong>Tipo:</strong> ${escapeHtml(item.tipo)} • <strong>Ano:</strong> ${item.ano}</p>
      <p>${escapeHtml(item.resumo)}</p>
      <a class="link" href="${item.link}" target="_blank" rel="noreferrer">Ver detalhe →</a>
    </div>
  `);

  // Cards: Grupos
  renderCards(grupos, "#gruposCards", (g) => `
    <div class="card">
      <div class="card-title">${escapeHtml(g.titulo)}</div>
      <p>${escapeHtml(g.resumo)}</p>
      <p><strong>Contacto:</strong> <a class="link" href="mailto:${g.contacto}">${g.contacto}</a></p>
    </div>
  `);

  // Cards: Disciplinas
  renderCards(disciplinas, "#disciplinasCards", (d) => `
    <div class="card">
      <div class="card-title">${escapeHtml(d.titulo)}</div>
      <p>${escapeHtml(d.resumo)}</p>
      <a class="link" href="${d.materiais}" target="_blank" rel="noreferrer">Materiais →</a>
    </div>
  `);

  // Stats
  el("#statProjetos").textContent = String(pesquisa.length);
  el("#statGrupos").textContent = String(grupos.length);
  el("#statDisciplinas").textContent = String(disciplinas.length);
}

function renderCards(arr, target, templateFn) {
  const box = el(target);
  box.innerHTML = arr.map(templateFn).join("");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ====== Pesquisa + filtro ======
function bindSearch() {
  const input = el("#searchInput");
  const select = el("#filterSelect");

  function apply() {
    const q = (input.value || "").trim().toLowerCase();
    const tipo = select.value;

    const filtered = pesquisa.filter(item => {
      const matchTipo = (tipo === "todos") ? true : item.tipo === tipo;
      const matchText =
        item.titulo.toLowerCase().includes(q) ||
        item.resumo.toLowerCase().includes(q) ||
        String(item.ano).includes(q);
      return matchTipo && (q ? matchText : true);
    });

    renderCards(filtered, "#pesquisaCards", (item) => `
      <div class="card">
        <div class="card-title">${escapeHtml(item.titulo)}</div>
        <p><strong>Tipo:</strong> ${escapeHtml(item.tipo)} • <strong>Ano:</strong> ${item.ano}</p>
        <p>${escapeHtml(item.resumo)}</p>
        <a class="link" href="${item.link}" target="_blank" rel="noreferrer">Ver detalhe →</a>
      </div>
    `);
  }

  input.addEventListener("input", apply);
  select.addEventListener("change", apply);
}

// ====== Menu mobile ======
function bindNav() {
  const btn = el("#navToggle");
  const nav = el("#nav");

  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });

  // fecha menu ao clicar num link
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

// ====== Submissão (fase 1: simulação) ======
function bindForm() {
  const form = el("#submissaoForm");
  const result = el("#formResult");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const nome = (data.get("nome") || "").toString().trim();
    const numero = (data.get("numero") || "").toString().trim();
    const curso = (data.get("curso") || "").toString().trim();
    const tipo = (data.get("tipo") || "").toString().trim();
    const titulo = (data.get("titulo") || "").toString().trim();
    const ficheiro = data.get("ficheiro");

    if (!nome || !numero || !curso || !tipo || !titulo) {
      result.textContent = "Por favor, preenche os campos obrigatórios.";
      return;
    }

    const temAnexo = ficheiro && ficheiro.name;
    const ref = `SUB-${Date.now().toString().slice(-6)}`;

    result.innerHTML = `
      ✅ Submissão registada (simulação).<br>
      <strong>Referência:</strong> ${ref}<br>
      <strong>Estudante:</strong> ${escapeHtml(nome)} (${escapeHtml(numero)})<br>
      <strong>Curso:</strong> ${escapeHtml(curso)}<br>
      <strong>Tipo:</strong> ${escapeHtml(tipo)}<br>
      <strong>Anexo:</strong> ${temAnexo ? escapeHtml(ficheiro.name) : "não anexado"}<br><br>
      Próximo passo: ligar este formulário a Google Drive/Firebase para guardar os dados e o PDF.
    `;

    form.reset();
  });
}

// ====== init ======
renderList();
bindSearch();
bindNav();
bindForm();
