// server.js
// Trabalho de Programação III - IFRJ Campus Niterói
// Framework: Express.js | Template engine: EJS

const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- CONFIGURAÇÃO ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // ler dados de <form>
app.use(express.json());

// deixa a rota atual disponível em todas as views (usado no menu ativo)
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// ---------- HOME / DASHBOARD ----------
app.get('/', (req, res) => {
  const cursos = db.listarCursos();
  const alunos = db.listarAlunos();
  res.render('index', {
    titulo: 'Início',
    totalCursos: cursos.length,
    totalAlunos: alunos.length,
    alunosAtivos: alunos.filter((a) => a.status === 'ativo').length,
    ultimosAlunos: alunos.slice(-3).reverse(),
  });
});

// ---------- CURSOS ----------
app.get('/cursos', (req, res) => {
  const { busca = '' } = req.query;
  const cursos = db.listarCursos(busca);
  res.render('cursos', { titulo: 'Cursos', cursos, busca });
});

app.get('/cursos/novo', (req, res) => {
  res.render('curso-form', { titulo: 'Novo Curso', curso: null, erro: null });
});

app.post('/cursos', (req, res) => {
  db.criarCurso(req.body);
  res.redirect('/cursos');
});

app.get('/cursos/:id/editar', (req, res) => {
  const curso = db.buscarCursoPorId(req.params.id);
  if (!curso) return res.redirect('/cursos');
  res.render('curso-form', { titulo: 'Editar Curso', curso, erro: null });
});

app.post('/cursos/:id', (req, res) => {
  db.atualizarCurso(req.params.id, req.body);
  res.redirect('/cursos');
});

app.post('/cursos/:id/excluir', (req, res) => {
  const resultado = db.excluirCurso(req.params.id);
  if (resultado.erro) {
    const cursos = db.listarCursos();
    return res.render('cursos', { titulo: 'Cursos', cursos, busca: '', erro: resultado.erro });
  }
  res.redirect('/cursos');
});

// ---------- ALUNOS ----------
app.get('/alunos', (req, res) => {
  const { busca = '', curso = '' } = req.query;
  const alunos = db.listarAlunos({ nome: busca, cursoId: curso });
  const cursos = db.listarCursos();
  res.render('alunos', { titulo: 'Alunos', alunos, cursos, busca, cursoSelecionado: curso });
});

app.get('/alunos/novo', (req, res) => {
  const cursos = db.listarCursos();
  res.render('aluno-form', { titulo: 'Novo Aluno', aluno: null, cursos });
});

app.post('/alunos', (req, res) => {
  db.criarAluno(req.body);
  res.redirect('/alunos');
});

app.get('/alunos/:id/editar', (req, res) => {
  const aluno = db.buscarAlunoPorId(req.params.id);
  const cursos = db.listarCursos();
  if (!aluno) return res.redirect('/alunos');
  res.render('aluno-form', { titulo: 'Editar Aluno', aluno, cursos });
});

app.post('/alunos/:id', (req, res) => {
  db.atualizarAluno(req.params.id, req.body);
  res.redirect('/alunos');
});

app.post('/alunos/:id/excluir', (req, res) => {
  db.excluirAluno(req.params.id);
  res.redirect('/alunos');
});

// ---------- RELATÓRIOS ----------
app.get('/relatorios', (req, res) => {
  res.render('relatorios', {
    titulo: 'Relatórios',
    porCurso: db.alunosPorCurso(),
    porStatus: db.alunosPorStatus(),
  });
});

// ---------- NOTAS (tabela client-side em localStorage) ----------
app.get('/notas', (req, res) => {
  res.render('notas', { titulo: 'Minhas Notas' });
});

// ---------- SOBRE / CONTATO ----------
app.get('/sobre', (req, res) => {
  res.render('sobre', { titulo: 'Sobre', enviado: false });
});

app.post('/sobre', (req, res) => {
  // Não persiste em lugar nenhum: apenas demonstra o uso de <form> + POST
  // e a renderização condicional de uma mensagem de sucesso.
  res.render('sobre', { titulo: 'Sobre', enviado: true, nome: req.body.nome });
});

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).render('404', { titulo: 'Página não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
