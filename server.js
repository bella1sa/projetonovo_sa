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

// Rota para salvar uma resenha
app.post('/api/resenhas', (req, res) => {
    const novaResenha = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        let resenhas = {};
        if (!err && data) {
            try {
                resenhas = JSON.parse(data);
            } catch (e) {
                resenhas = {};
            }
        }

        resenhas[novaResenha.bookId] = {
            titulo: novaResenha.titulo,
            texto: novaResenha.texto,
            data: novaResenha.data
        };

        fs.writeFile(DATA_FILE, JSON.stringify(resenhas, null, 2), (err) => {
            if (err) return res.status(500).send("Erro ao salvar");
            res.send({ message: "Resenha salva no servidor!" });
        });
    });
});

// Rota para buscar resenhas
app.get('/api/resenhas', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err || !data) return res.json({});
        res.send(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});