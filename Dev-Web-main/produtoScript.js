document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const Id = urlParams.get('id');

    fetch(`https://a9d8b915-4ebe-4d56-bcea-90efb67c3b9b-00-35la7r7wzyor6.kirk.replit.dev/api/roupas${Id}`) // Ajuste a URL conforme necessário
        .then(response => {
            if (!response.ok) {
                throw new Error('Roupa não encontrada');
            }
            return response.json();
        })
        .then(produto => {
            document.getElementById("nome-produto").textContent = produto.nome;
            document.getElementById("descricao-produto").textContent = produto.descricao;
            document.getElementById("preco-produto").textContent = produto.preco;
            document.getElementById("imagem-produto").src = produto.imagem;
        })
        .catch(error => {
            alert(error.message);
        });
});
