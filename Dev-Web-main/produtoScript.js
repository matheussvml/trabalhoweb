document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const Id = urlParams.get('id');

    fetch(`http://localhost:3000/api/roupas/${Id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Roupa não encontrada');
            }
            return response.json();
        })
        .then(produto => {
            // Atualiza os elementos do HTML com os dados do produto
            document.getElementById("nome-produto").textContent = produto.nome;
            document.getElementById("descricao-produto").textContent = produto.descr; // Ajuste para "descr"
            document.getElementById("preco-produto").textContent = `R$ ${produto.preco}`;
            document.getElementById("imagem-produto").src = produto.imagem;
        })
        .catch(error => {
            alert(error.message);
        });
});
