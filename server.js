const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'resenhas.json');
const LIVROS_FILE = path.join(__dirname, 'livros.json'); // Nosso arquivo com a lista pronta!

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Função auxiliar para ler os livros do JSON
function obterLivrosLocais() {
    try {
        const data = fs.readFileSync(LIVROS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error("Erro ao ler o arquivo livros.json, usando lista vazia.");
        return [];
    }
}

// Rota para a Home buscar os livros (com sistema de busca filtrando o JSON)
app.get('/api/livros', (req, res) => {
    const busca = req.query.q ? req.query.q.toLowerCase() : '';
    const meusLivros = obterLivrosLocais();
    
    if (busca) {
        const filtrados = meusLivros.filter(l => 
            l.titulo.toLowerCase().includes(busca) || 
            l.autor.toLowerCase().includes(busca) ||
            l.genero.toLowerCase().includes(busca)
        );
        return res.json(filtrados);
    }
    
    res.json(meusLivros);
});

// Rota para buscar os detalhes de UM livro específico pelo ID próprio
app.get('/api/livros/:id', (req, res) => {
    const meusLivros = obterLivrosLocais();
    const livro = meusLivros.find(l => l.id === req.params.id);
    if (!livro) return res.status(404).json({ erro: "Livro não encontrado" });
    res.json(livro);
});

// Rota para salvar uma resenha
app.post('/api/resenhas', (req, res) => {
    const novaResenha = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        let resenhas = {};
        if (!err && data) {
            try { resenhas = JSON.parse(data); } catch (e) { resenhas = {}; }
        }

        resenhas[novaResenha.bookId] = {
            titulo: novaResenha.titulo,
            texto: novaResenha.texto,
            data: novaResenha.data
        };

        fs.writeFile(DATA_FILE, JSON.stringify(resenhas, null, 2), (err) => {
            if (err) return res.status(500).send("Erro ao salvar");
            res.send({ message: "Resenha salva!" });
        });
    });
});

// Rota para o Perfil buscar as resenhas
app.get('/api/resenhas', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err || !data) return res.json({});
        res.send(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando com banco de dados próprio em http://localhost:${PORT}`);
});