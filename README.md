# Controle Acadêmico v2 — Trabalho de Programação III

Evolução do projeto `controle-academico-bd1` (feito para Banco de Dados I),
agora atendendo aos requisitos do trabalho de **Programação III** (IFRJ Campus
Niterói, Prof. Luiz).

## Stack

- **Node.js + Express** (framework obrigatório)
- **EJS** (template engine)
- **CSS externo** puro (sem `<style>` nem atributo `style`)
- **JavaScript client-side puro** para a tabela de notas em `localStorage`
- Persistência simples em arquivo `data/db.json` (sem banco externo — o foco
  aqui é front-end/back-end com Express, não SQL)

## Como rodar localmente

```bash
npm install
npm start
```

Abra **http://localhost:3000**.

## Estrutura de pastas

```
controle-academico-v2/
├── server.js              # rotas Express
├── db.js                  # camada de dados (lê/escreve data/db.json)
├── data/db.json            # "banco" em JSON (cursos e alunos)
├── views/                  # templates EJS
│   ├── partials/header.ejs # menu, com classe "ativo" condicional
│   ├── partials/footer.ejs
│   ├── index.ejs            # dashboard
│   ├── cursos.ejs            # lista + busca
│   ├── curso-form.ejs        # criar/editar curso
│   ├── alunos.ejs             # lista + busca + filtro por curso
│   ├── aluno-form.ejs          # criar/editar aluno
│   ├── relatorios.ejs           # tabelas agregadas
│   ├── notas.ejs                 # tabela localStorage (CRUD + filtro)
│   ├── sobre.ejs                  # formulário de contato
│   └── 404.ejs
└── public/
    ├── css/style.css        # CSS externo com 7 tipos de seletores
    └── js/notas.js          # CRUD da tabela de notas em localStorage
```

## Checklist dos requisitos do trabalho

- [x] Site com mais de 5 páginas: Início, Cursos, Alunos, Relatórios, Minhas
      Notas, Sobre (+ formulários de cadastro/edição contam como páginas
      próprias).
- [x] Links, imagens, tabelas e formulários presentes em várias páginas.
- [x] Framework Express.js.
- [x] Template engine EJS.
- [x] CSS 100% em arquivo externo (`public/css/style.css`), zero `style=""`.
- [x] Mais de 5 tipos de seletores CSS (elemento, classe, id, atributo,
      pseudo-classe, pseudo-elemento, combinador descendente/filho — ver
      comentário no topo do `style.css`).
- [x] Renderização condicional: mensagens de "nenhum resultado", badge de
      status, aluno sem curso, sucesso do formulário de contato, aprovado ou
      reprovado na tabela de notas, etc.
- [x] Tabela renderizada a partir de JSON em `localStorage`, com inserir,
      editar, remover e filtrar por busca textual (página **Minhas Notas**).
- [x] Resolve um problema real: controle de cursos, alunos e desempenho
      acadêmico de uma instituição de ensino.

## Publicando no CodeSandbox

1. Acesse [codesandbox.io](https://codesandbox.io) → **Create Sandbox** →
   **Import from GitHub** e cole a URL do seu repositório (depois de subir
   este projeto pro GitHub), ou **Import** o zip diretamente.
2. O CodeSandbox detecta o `package.json` e roda `npm install` + `npm start`
   automaticamente. Confira se a porta usada é a que aparece no preview.
3. Clique em **Share** (canto superior direito) → em "Invite collaborators"
   ou "Share link", adicione o e-mail `luiz.oliveira@ifrj.edu.br` com
   permissão de visualização/edição, conforme pedido no trabalho.
4. Copie o link público do preview (a URL que abre o site rodando) para
   incluir na entrega, além do link de colaboração do sandbox.


