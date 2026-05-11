// public/storage.js

const Storage = {
    // Salva um livro nos favoritos (LocalStorage)
    salvarFavorito(livro) {
        let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        // Evita duplicados
        if (!favoritos.find(f => f.id === livro.id)) {
            favoritos.push(livro);
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
        }
    },

    // Salva uma resenha
    salvarResenha(livroId, texto) {
        let resenhas = JSON.parse(localStorage.getItem('resenhas')) || {};
        resenhas[livroId] = {
            texto: texto,
            data: new Date().toLocaleDateString()
        };
        localStorage.setItem('resenhas', JSON.stringify(resenhas));
    },

    // Busca dados salvos
    obterFavoritos() {
        return JSON.parse(localStorage.getItem('favoritos')) || [];
    }
};