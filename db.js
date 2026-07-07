// db.js
// Camada simples de "persistência" baseada em arquivo JSON.
// Troca o MySQL da versão anterior (trabalho de BD1) por um arquivo local,
// já que aqui o foco da disciplina é o front-end/back-end com Express + EJS.

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

function lerBanco() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function salvarBanco(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

// ---------- CURSOS ----------
function listarCursos(filtroNome = '') {
  const db = lerBanco();
  const termo = filtroNome.trim().toLowerCase();
  if (!termo) return db.cursos;
  return db.cursos.filter((c) => c.nome.toLowerCase().includes(termo));
}

function buscarCursoPorId(id) {
  const db = lerBanco();
  return db.cursos.find((c) => c.id === Number(id));
}

function criarCurso({ nome, cargaHoraria, coordenador }) {
  const db = lerBanco();
  const novo = {
    id: db.nextCursoId,
    nome,
    cargaHoraria: Number(cargaHoraria),
    coordenador,
  };
  db.cursos.push(novo);
  db.nextCursoId += 1;
  salvarBanco(db);
  return novo;
}

function atualizarCurso(id, { nome, cargaHoraria, coordenador }) {
  const db = lerBanco();
  const curso = db.cursos.find((c) => c.id === Number(id));
  if (!curso) return null;
  curso.nome = nome;
  curso.cargaHoraria = Number(cargaHoraria);
  curso.coordenador = coordenador;
  salvarBanco(db);
  return curso;
}

function excluirCurso(id) {
  const db = lerBanco();
  const emUso = db.alunos.some((a) => a.cursoId === Number(id));
  if (emUso) return { erro: 'Existem alunos vinculados a este curso.' };
  db.cursos = db.cursos.filter((c) => c.id !== Number(id));
  salvarBanco(db);
  return { ok: true };
}

// ---------- ALUNOS ----------
function listarAlunos({ nome = '', cursoId = '' } = {}) {
  const db = lerBanco();
  let resultado = db.alunos;
  if (nome.trim()) {
    const termo = nome.trim().toLowerCase();
    resultado = resultado.filter((a) => a.nome.toLowerCase().includes(termo));
  }
  if (cursoId) {
    resultado = resultado.filter((a) => a.cursoId === Number(cursoId));
  }
  return resultado.map((a) => ({
    ...a,
    curso: db.cursos.find((c) => c.id === a.cursoId) || null,
  }));
}

function buscarAlunoPorId(id) {
  const db = lerBanco();
  const aluno = db.alunos.find((a) => a.id === Number(id));
  if (!aluno) return null;
  return { ...aluno, curso: db.cursos.find((c) => c.id === aluno.cursoId) || null };
}

function criarAluno({ nome, matricula, cursoId, dataIngresso, status }) {
  const db = lerBanco();
  const novo = {
    id: db.nextAlunoId,
    nome,
    matricula,
    cursoId: Number(cursoId),
    dataIngresso,
    status,
  };
  db.alunos.push(novo);
  db.nextAlunoId += 1;
  salvarBanco(db);
  return novo;
}

function atualizarAluno(id, { nome, matricula, cursoId, dataIngresso, status }) {
  const db = lerBanco();
  const aluno = db.alunos.find((a) => a.id === Number(id));
  if (!aluno) return null;
  aluno.nome = nome;
  aluno.matricula = matricula;
  aluno.cursoId = Number(cursoId);
  aluno.dataIngresso = dataIngresso;
  aluno.status = status;
  salvarBanco(db);
  return aluno;
}

function excluirAluno(id) {
  const db = lerBanco();
  db.alunos = db.alunos.filter((a) => a.id !== Number(id));
  salvarBanco(db);
  return { ok: true };
}

// ---------- RELATÓRIOS (equivalente às "consultas" do trabalho de BD1) ----------
function alunosPorCurso() {
  const db = lerBanco();
  return db.cursos.map((curso) => ({
    curso: curso.nome,
    total: db.alunos.filter((a) => a.cursoId === curso.id).length,
  }));
}

function alunosPorStatus() {
  const db = lerBanco();
  const statusList = ['ativo', 'trancado', 'concluido'];
  return statusList.map((status) => ({
    status,
    total: db.alunos.filter((a) => a.status === status).length,
  }));
}

module.exports = {
  listarCursos,
  buscarCursoPorId,
  criarCurso,
  atualizarCurso,
  excluirCurso,
  listarAlunos,
  buscarAlunoPorId,
  criarAluno,
  atualizarAluno,
  excluirAluno,
  alunosPorCurso,
  alunosPorStatus,
};
