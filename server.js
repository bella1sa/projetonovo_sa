const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Configura o Express para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Simulação de banco de dados de livros
const livros = [
    { id: 1, titulo: "O Senhor dos Anéis", autor: "J.R.R. Tolkien", genero: "Fantasia", sinopse: "Uma jornada épica pela Terra Média." },
    { id: 2, titulo: "Sherlock Holmes", autor: "Arthur Conan Doyle", genero: "Suspense", sinopse: "O detetive mais famoso do mundo." },
    { id: 3, titulo: "Neuromancer", autor: "William Gibson", genero: "Sci-Fi", sinopse: "O clássico do cyberpunk." }
];

// Rota da API para listar livros
app.get('/api/livros', (req, res) => {
    res.json(livros);
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});