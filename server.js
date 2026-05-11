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

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'resenhas.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rota para salvar uma resenha no "Banco de Dados" (arquivo JSON)
app.post('/api/resenhas', (req, res) => {
    const novaResenha = req.body; // Recebe: { bookId, titulo, texto, data }

    // Lê o arquivo atual
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        let resenhas = {};
        if (!err && data) {
            resenhas = JSON.parse(data);
        }

        // Adiciona a nova resenha
        resenhas[novaResenha.bookId] = {
            titulo: novaResenha.titulo,
            texto: novaResenha.texto,
            data: novaResenha.data
        };

        // Salva de volta no arquivo
        fs.writeFile(DATA_FILE, JSON.stringify(resenhas, null, 2), (err) => {
            if (err) return res.status(500).send("Erro ao salvar");
            res.send({ message: "Resenha salva no servidor!" });
        });
    });
});

// Rota para buscar todas as resenhas
app.get('/api/resenhas', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.json({});
        res.send(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Servidor bombando em http://localhost:${PORT}`);
});