// notas.js
// Tabela de notas renderizada 100% no navegador a partir de um JSON
// guardado em localStorage. Suporta inserir, editar, remover e filtrar.

const CHAVE_STORAGE = 'controleAcademico.notas';

const form = document.getElementById('form-nota');
const inputId = document.getElementById('nota-id');
const inputDisciplina = document.getElementById('disciplina');
const inputAv1 = document.getElementById('av1');
const inputAv2 = document.getElementById('av2');
const btnSalvar = document.getElementById('btn-salvar-nota');
const btnCancelar = document.getElementById('btn-cancelar-nota');
const inputFiltro = document.getElementById('filtro-notas');
const corpoTabela = document.getElementById('corpo-tabela-notas');
const mensagemVazia = document.getElementById('mensagem-vazia');

function lerNotas() {
  const dados = localStorage.getItem(CHAVE_STORAGE);
  if (!dados) {
    // Dados iniciais de exemplo, só na primeira visita
    const exemplo = [
      { id: cryptoId(), disciplina: 'Programação III', av1: 8, av2: 7.5 },
      { id: cryptoId(), disciplina: 'Banco de Dados I', av1: 9, av2: 8.5 },
    ];
    salvarNotas(exemplo);
    return exemplo;
  }
  return JSON.parse(dados);
}

function salvarNotas(notas) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(notas));
}

function cryptoId() {
  return 'n_' + Math.random().toString(36).slice(2, 10);
}

function calcularMedia(av1, av2) {
  return (Number(av1) + Number(av2)) / 2;
}

function renderizarTabela(filtro = '') {
  const notas = lerNotas();
  const termo = filtro.trim().toLowerCase();
  const notasFiltradas = termo
    ? notas.filter((n) => n.disciplina.toLowerCase().includes(termo))
    : notas;

  corpoTabela.innerHTML = '';

  // Renderização condicional: mensagem quando não há linhas para mostrar
  if (notasFiltradas.length === 0) {
    mensagemVazia.classList.remove('oculto');
  } else {
    mensagemVazia.classList.add('oculto');
  }

  notasFiltradas.forEach((nota) => {
    const media = calcularMedia(nota.av1, nota.av2);
    const aprovado = media >= 6;

    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${escaparHTML(nota.disciplina)}</td>
      <td>${Number(nota.av1).toFixed(1)}</td>
      <td>${Number(nota.av2).toFixed(1)}</td>
      <td>${media.toFixed(1)}</td>
      <td><span class="badge ${aprovado ? 'badge-ativo' : 'badge-trancado'}">${aprovado ? 'Aprovado' : 'Reprovado'}</span></td>
      <td class="acoes">
        <button type="button" class="btn-editar-nota" data-id="${nota.id}">Editar</button>
        <button type="button" class="btn-excluir" data-id="${nota.id}">Excluir</button>
      </td>
    `;
    corpoTabela.appendChild(linha);
  });
}

function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// ---------- INSERIR / EDITAR ----------
form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const notas = lerNotas();
  const id = inputId.value;

  if (id) {
    // edição de linha existente
    const indice = notas.findIndex((n) => n.id === id);
    if (indice !== -1) {
      notas[indice] = {
        id,
        disciplina: inputDisciplina.value,
        av1: inputAv1.value,
        av2: inputAv2.value,
      };
    }
  } else {
    // nova linha
    notas.push({
      id: cryptoId(),
      disciplina: inputDisciplina.value,
      av1: inputAv1.value,
      av2: inputAv2.value,
    });
  }

  salvarNotas(notas);
  form.reset();
  inputId.value = '';
  btnSalvar.value = 'Adicionar';
  btnCancelar.classList.add('oculto');
  renderizarTabela(inputFiltro.value);
});

btnCancelar.addEventListener('click', () => {
  form.reset();
  inputId.value = '';
  btnSalvar.value = 'Adicionar';
  btnCancelar.classList.add('oculto');
});

// ---------- EDITAR / EXCLUIR (delegação de evento) ----------
corpoTabela.addEventListener('click', (evento) => {
  const id = evento.target.dataset.id;
  if (!id) return;

  if (evento.target.classList.contains('btn-excluir')) {
    if (!confirm('Remover esta disciplina da tabela?')) return;
    const notas = lerNotas().filter((n) => n.id !== id);
    salvarNotas(notas);
    renderizarTabela(inputFiltro.value);
  }

  if (evento.target.classList.contains('btn-editar-nota')) {
    const nota = lerNotas().find((n) => n.id === id);
    if (!nota) return;
    inputId.value = nota.id;
    inputDisciplina.value = nota.disciplina;
    inputAv1.value = nota.av1;
    inputAv2.value = nota.av2;
    btnSalvar.value = 'Salvar alterações';
    btnCancelar.classList.remove('oculto');
    inputDisciplina.focus();
  }
});

// ---------- FILTRO POR TEXTO ----------
inputFiltro.addEventListener('input', () => {
  renderizarTabela(inputFiltro.value);
});

// ---------- INICIALIZAÇÃO ----------
renderizarTabela();
