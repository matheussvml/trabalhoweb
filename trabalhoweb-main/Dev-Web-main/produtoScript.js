document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const Id = urlParams.get('id');

    fetch(`https://0ba092f0-4048-41f3-a3ac-4fb804d6e15d-00-2sb31d6mw6zvi.worf.replit.dev/api/roupas${Id}`) // Ajuste a URL conforme necessário
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
