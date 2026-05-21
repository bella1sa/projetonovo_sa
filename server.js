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

// Nosso próprio banco de dados de livros (Adeus bloqueio do Google!)
const livrosLocais = [
    { id: "1", titulo: "O Hobbit", autor: "J.R.R. Tolkien", genero: "Fantasia", sinopse: "Bilbo Bolseiro é um hobbit que leva uma vida confortável e pacata. Tudo muda quando o mago Gandalf e treze anões o levam em uma jornada para recuperar um tesouro guardado pelo dragão Smaug.", capa: "/imagens/hobbit.jpg" },
    { id: "2", titulo: "Duna", autor: "Frank Herbert", genero: "Sci-Fi", sinopse: "Localizado no deserto épico de Arrakis, Duna conta a história de Paul Atreides, um jovem brilhante e talentoso nascido para um grande destino além de sua compreensão.", capa: "/imagens/duna.jpg" },
    { id: "3", titulo: "O Alquimista", autor: "Paulo Coelho", genero: "Ficção", sinopse: "O romance narra a jornada de Santiago, um jovem pastor espanhol que viaja para o Egito em busca de um tesouro escondido nas pirâmides.", capa: "/imagens/alquimista.jpg" },
    { id: "4", titulo: "It: A Coisa", autor: "Stephen King", genero: "Terror", sinopse: "Um grupo de crianças enfrentam seus maiores medos quando um monstro que toma a forma de um palhaço começa a caçar na cidade de Derry.", capa: "/imagens/it.jpg" }
];

// Rota para a Home buscar os livros do nosso servidor
app.get('/api/livros', (req, res) => {
    const busca = req.query.q ? req.query.q.toLowerCase() : '';
    
    // Se o usuário digitou algo na busca, filtramos aqui no backend
    if (busca) {
        const filtrados = livrosLocais.filter(l => 
            l.titulo.toLowerCase().includes(busca) || 
            l.autor.toLowerCase().includes(busca) ||
            l.genero.toLowerCase().includes(busca)
        );
        return res.json(filtrados);
    }
    
    res.json(livrosLocais);
});

// Rota para buscar os detalhes de UM livro específico pelo ID
app.get('/api/livros/:id', (req, res) => {
    const livro = livrosLocais.find(l => l.id === req.params.id);
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
    console.log(`Servidor rodando liso em http://localhost:${PORT}`);
});