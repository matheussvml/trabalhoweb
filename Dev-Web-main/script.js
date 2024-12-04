// script.js
let currentSlide = 0; // Índice do slide atual
const slides = document.querySelectorAll('.carousel-images img'); // Seleciona todas as imagens

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none'; // Mostra o slide atual e esconde os outros
    });
}

function moveSlide(direction) {
    currentSlide += direction; // Atualiza o índice do slide
    if (currentSlide < 0) {
        currentSlide = slides.length - 1; // Volta para o último slide se estiver no primeiro
    } else if (currentSlide >= slides.length) {
        currentSlide = 0; // Volta para o primeiro slide se estiver no último
    }
    showSlide(currentSlide); // Mostra o slide atualizado
}


// Inicializa o carrossel exibindo o primeiro slide
showSlide(currentSlide);

document.addEventListener('DOMContentLoaded', function () {
    // Verifica se o token está presente no armazenamento local
    const token = localStorage.getItem("token");

    if (token) {
        const entrar = document.getElementById("entrar");
        const logoutButton = document.getElementById("logoutButton");
        const adminLink = document.getElementById("adminLink");

        // Verifica se os elementos existem antes de acessar suas propriedades
        if (entrar) entrar.style.display = "none";
        if (logoutButton) logoutButton.style.display = "block";

        // Envia o token para o backend para verificar se o usuário é um administrador
        fetch('http://localhost:3000/api/verificar-admin', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token JWT
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao verificar admin: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.isAdmin && adminLink) {
                adminLink.style.display = "block";
                console.log('Admin status:', data.isAdmin);
            }
        })
        .catch(error => {
            console.error('Erro ao verificar admin:', error);
        });

    } else {
        const account = document.getElementsByClassName("account");
        const logoutButton = document.getElementById("logoutButton");

        // Verifica se os elementos existem antes de acessar suas propriedades
        if (account.length > 0) account[0].style.display = "block";
        if (logoutButton) logoutButton.style.display = "none";
    }
});


function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html"; // Redireciona para a página de login
}




function entrarComoAdmin() {
    document.getElementById('produtos').style.display = 'none'; // Oculta a seção de produtos
    document.getElementById('admin').style.display = 'block'; // Exibe a seção de admin
    buscarRoupasAdmin(); // Carrega roupas na seção de admin
}


async function mostrarRoupas() {
    try {
        // Faz a requisição e obtém a resposta
        const resposta = await fetch('http://localhost:3000/api/roupas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Verifica se a resposta foi bem-sucedida
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar roupas: ${resposta.status}`);
        }

        // Converte a resposta para JSON
        const dados = await resposta.json();

        // Obtém o container no DOM
        const container = document.getElementById('produtos-container');
        if (!container) {
            throw new Error('Elemento produtos-container não encontrado!');
        }

        
        container.innerHTML = ''; // Limpa o container antes de adicionar novos produtos

        // Adiciona as roupas ao DOM
        dados.forEach(roupa => {
            const produtoDiv = document.createElement('div');
            produtoDiv.classList.add('produto');
            produtoDiv.dataset.id = roupa.id;

            container.appendChild(produtoDiv);

            const produtoA = document.createElement("a");
            produtoA.href = `detalhes.html?id=${roupa.id}`;
            produtoA.classList.add("produtoA");

            const imgRoupa = document.createElement("img");
            imgRoupa.src = roupa.imagem || "placeholder.jpg"; // Adiciona imagem padrão se não houver
            imgRoupa.alt = roupa.nome || "Imagem não disponível";
            imgRoupa.style.maxWidth = "120px";

            const nomeRoupa = document.createElement("h3");
            nomeRoupa.textContent = roupa.nome || "Nome não disponível";

            const precoRoupa = document.createElement("p");
            precoRoupa.textContent = `R$ ${parseFloat(roupa.preco || 0).toFixed(2)}`;

            const categoriaRoupa = document.createElement("p");
            categoriaRoupa.textContent = `${roupa.categoria || "Categoria não disponível"}`.toLowerCase().trim();

            const botaoAddCar = document.createElement("button");
            botaoAddCar.classList.add("Adiciona");
            botaoAddCar.innerHTML = '<span class="material-symbols-outlined">shopping_cart</span> Adicionar ao carrinho';
            botaoAddCar.onclick = () => addCarrinho(roupa.id);

            produtoA.append(imgRoupa, nomeRoupa, precoRoupa, categoriaRoupa);
            produtoDiv.append(produtoA, botaoAddCar);
            container.appendChild(produtoDiv);
        });
    } catch (error) {
        console.error("Erro ao carregar roupas:", error);
        console.error(' Erro na API:', error);
        document.write(` ERRO NA API: ${error.message}`);
    }
}

// Chama a função para carregar as roupas
mostrarRoupas();






// Função para buscar e exibir todas as roupas na seção de admin
function buscarRoupasAdmin() {
    fetch('http://localhost:3000/api/roupas')
        .then(response => response.json())
        .then(data => {
            const produtosContainer = document.getElementById('produtos-container-admin');
            produtosContainer.innerHTML = ''; // Limpa a lista antes de exibir

            data.forEach(roupa => {
                exibirRoupasAdmin(roupa); // Exibe cada roupa na seção de admin
            });
        })
        .catch(error => {
            console.error('Erro ao buscar as roupas:', error);
        });
}

// Função para exibir roupas na seção de admin
function exibirRoupasAdmin(roupa) {
    const container = document.getElementById('produtos-container-admin');
    const produtoDiv = document.createElement('div');
    produtoDiv.classList.add('produto');

    produtoDiv.innerHTML = `
        <img src="${roupa.imagem}" alt="${roupa.nome}" style="max-width: 120px;">
        <h3>${roupa.nome}</h3>
        <p>R$ ${roupa.preco.toFixed(2)}</p>
        <button onclick="deletarRoupa(${roupa.id})">Deletar</button>
    `;

    container.appendChild(produtoDiv);
}

function adicionarRoupa() {
    const nomeRoupa = document.getElementById('nomeRoupa').value;
    const precoRoupa = parseFloat(document.getElementById('precoRoupa').value);
    const imagemRoupa = document.getElementById('imagemRoupa').value;

    if (!nomeRoupa || isNaN(precoRoupa) || !imagemRoupa) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    const novaRoupa = {
        nome: nomeRoupa,
        preco: precoRoupa,
        imagem: imagemRoupa
    };

    const token = localStorage.getItem('token'); // Obtém o token do localStorage

    fetch('http://localhost:3000/api/roupas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho da requisição
        },
        body: JSON.stringify(novaRoupa)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao adicionar a roupa');
        }
        return response.json();
    })
    .then(data => {
        exibirRoupasAdmin(data);
        document.getElementById('nomeRoupa').value = '';
        document.getElementById('precoRoupa').value = '';
        document.getElementById('imagemRoupa').value = '';
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}


function deletarRoupa(id) {
    const token = localStorage.getItem('token'); // Obtém o token do localStorage
    fetch(`http://localhost:3000/api/roupas/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho da requisição
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar a roupa');
        }
        // Atualiza a lista de roupas após a exclusão
        buscarRoupasAdmin();
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}




async function fazerLogin() {
    const username = document.getElementById('username').value; // Obtém o valor do campo de username
    const password = document.getElementById('password').value; // Obtém o valor do campo de password

    const resposta = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }) // Envia username e password no corpo da requisição
    });

    if (resposta.ok) {
        const dados = await resposta.json(); // Recebe a resposta em formato JSON
        localStorage.setItem('token', dados.token); // Armazena o token no localStorage
        alert('Login bem-sucedido!'); // Exibe uma mensagem de sucesso
        // Você pode redirecionar o usuário ou carregar a interface de admin aqui
    } else {
        alert('Falha no login: Verifique suas credenciais!'); // Mensagem de erro
    }
}



async function loginAdmin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer login');
        }

        const data = await response.json();
        // Armazena o token no localStorage
        localStorage.setItem('token', data.token);
        alert('Login bem-sucedido!');
        // Aqui você pode redirecionar para a página admin ou carregar as roupas
        buscarRoupasAdmin(); // Carrega as roupas se o login for bem-sucedido

    } catch (error) {
        console.error('Erro:', error);
        alert('Falha no login. Verifique suas credenciais.');
    }
}



function atualizarRoupa() {
    const idRoupa = parseInt(document.getElementById('idRoupa').value);
    const novoNome = document.getElementById('novoNome').value;
    const novaImagem = document.getElementById('novaImagem').value;

    // Monta o corpo da requisição dinamicamente
    const dadosAtualizados = {};
    if (novoNome) dadosAtualizados.nome = novoNome;
    if (novaImagem) dadosAtualizados.imagem = novaImagem;

    // Verifica se o ID da roupa foi fornecido
    if (!idRoupa || isNaN(idRoupa)) {
        alert('Por favor, forneça um ID válido da roupa.');
        return;
    }

    // Obtém o token de autenticação do localStorage
    const token = localStorage.getItem('token');

    // Envia a requisição PATCH
    fetch(`http://localhost:3000/api/roupas/${idRoupa}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Inclui o token de autenticação
        },
        body: JSON.stringify(dadosAtualizados)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar a roupa: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        alert('Roupa atualizada com sucesso!');
        buscarRoupasAdmin(); // Atualiza a lista de roupas oooooooi
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Houve um problema ao atualizar a roupa. Verifique os dados e tente novamente.');
    });
}

// Carrinho global
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Função para salvar o carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Função para exibir o carrinho na página
function exibirCarrinho() {
    const carrinhoContainer = document.getElementById("carrinho-container");
    const totalElement = document.getElementById("total-geral");

    carrinhoContainer.innerHTML = ""; // Limpa o conteúdo atual

    let totalGeral = 0;

    if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = "<p>O carrinho está vazio.</p>";
        totalElement.textContent = "0.00";
        return;
    }

    carrinho.forEach(item => {
        const totalItem = item.preco * item.quantidade;
        totalGeral += totalItem;

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("carrinho-item");

        itemDiv.innerHTML = `
            <span>${item.nome}</span>
            <span>R$ ${item.preco.toFixed(2)}</span>
            <span>
                <button class= "botaoDiminuir" onclick="alterarQuantidade(${item.id}, -1)">-</button>
                ${item.quantidade}
                <button class= "botaoAumentar" onclick="alterarQuantidade(${item.id}, 1)">+</button>
            </span>
            <span>R$ ${totalItem.toFixed(2)}</span>
            <button class = "removerBotao" onclick="removerItem(${item.id})">Remover</button>
        `;

        carrinhoContainer.appendChild(itemDiv);
    });

    totalElement.textContent = totalGeral.toFixed(2);
}

// Função para adicionar um produto ao carrinho
function addCarrinho(id) {
    const produto = carrinho.find(item => item.id === id);

    if (produto) {
        produto.quantidade++;
    } else {
        const nome = document.querySelector(`.produto[data-id="${id}"] h3`).textContent;
        const preco = parseFloat(
            document.querySelector(`.produto[data-id="${id}"] p`).textContent.replace("R$", "").trim()
        );

        carrinho.push({ id, nome, preco, quantidade: 1 });
    }

    salvarCarrinho();
    exibirCarrinho();
}

// Função para alterar a quantidade de um item no carrinho
function alterarQuantidade(id, quantidade) {
    const produto = carrinho.find(item => item.id === id);
    if (!produto) return;

    produto.quantidade += quantidade;

    if (produto.quantidade <= 0) {
        removerItem(id);
    } else {
        salvarCarrinho();
        exibirCarrinho();
    }
}

// Função para remover um item do carrinho
function removerItem(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho();
    exibirCarrinho();
}

// Função para limpar o carrinho
function limparCarrinho() {
    carrinho = [];
    salvarCarrinho();
    exibirCarrinho();
}

// Função para finalizar a compra
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("O carrinho está vazio!");
        return;
    }

    alert("Compra finalizada com sucesso!");
    limparCarrinho();
}

// Chamada inicial para exibir o carrinho ao carregar a página
document.addEventListener("DOMContentLoaded", exibirCarrinho);

// Integração do botão "Adicionar ao Carrinho" na exibição de produtos
// async function mostrarRoupas() {
//     try {
//         const resposta = await fetch('http://localhost:3000/api/roupas');
//         if (!resposta.ok) {
//             throw new Error(`Erro ao buscar roupas: ${resposta.status}`);
//         }

//         const dados = await resposta.json();
//         const container = document.getElementById('produtos-container');
//         container.innerHTML = '';

//         dados.forEach(roupa => {
//             const produtoDiv = document.createElement('div');
//             produtoDiv.classList.add('produto');
//             produtoDiv.dataset.id = roupa.id;

//             produtoDiv.innerHTML = `
//                 <img src="${roupa.imagem || 'placeholder.jpg'}" alt="${roupa.nome || 'Imagem não disponível'}">
//                 <h3>${roupa.nome || 'Nome não disponível'}</h3>
//                 <p>R$ ${parseFloat(roupa.preco || 0).toFixed(2)}</p>
//                 <button onclick="addCarrinho(${roupa.id})">Adicionar ao Carrinho</button>
//             `;

//             container.appendChild(produtoDiv);
//         });
//     } catch (error) {
//         console.error("Erro ao carregar roupas:", error);
//     }
// }
// Chame a função para carregar as roupas na inicialização
mostrarRoupas();

function filtrarRoupas() {
    const termo = document.getElementById("barra-pesquisa").value.toLowerCase();
    const produtos = document.querySelectorAll("#produtos-container .produto");
    const secoes = document.querySelectorAll("main > section:not(#produtos)");
    const carrossel = document.getElementById("carouselExample");

    let encontrou = false;

    produtos.forEach(produto => {
        const nome = produto.querySelector("h3").textContent.toLowerCase();
        if (nome.includes(termo)) {
            produto.style.display = "block"; // Mostra o produto se corresponder ao termo
            encontrou = true;
        } else {
            produto.style.display = "none"; // Esconde o produto caso contrário
        }
    });

    if (termo && encontrou) {
        secoes.forEach(secao => secao.style.display = "none"); // Oculta todas as outras seções
        if (carrossel) carrossel.style.display = "none"; // Oculta o carrossel
    } else {
        secoes.forEach(secao => secao.style.display = "block"); // Mostra novamente todas as seções
        if (carrossel) carrossel.style.display = "block"; // Mostra o carrossel
    }
}

function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-menu");
    dropdown.classList.toggle("show");
}

function filtrarPorCategoria(event, categoria) {
    event.preventDefault(); // Previne o comportamento padrão do link

    const produtos = document.querySelectorAll("#produtos-container .produto");
    let encontrou = false;

    produtos.forEach(produto => {
        // Obtém o texto da categoria do produto e remove espaços extras
        const categoriaProduto = produto.querySelector("p").textContent.trim().toLowerCase();
        console.log(`Categoria do Produto: ${categoriaProduto}, Categoria Selecionada: ${categoria.toLowerCase()}`);
        
        // Verifica se a categoria do produto corresponde à categoria selecionada
        if (categoriaProduto === categoria.toLowerCase()) {
            produto.style.display = "block"; // Mostra produtos da categoria correspondente
            encontrou = true;
        } else {
            produto.style.display = "none"; // Esconde os outros produtos
        }
    });

    if (!encontrou) {
        console.log(`Nenhum produto encontrado para a categoria: ${categoria}`);
    }
}


function limparFiltro(event) {
    event.preventDefault(); // Previne o redirecionamento padrão do link
    const produtos = document.querySelectorAll("#produtos-container .produto");
    produtos.forEach(produto => {
        produto.style.display = "block"; // Mostra todos os produtos
    });
}


// Fecha o dropdown ao clicar fora dele
window.onclick = function (event) {
    if (!event.target.matches('.btn-dropdown') && !event.target.closest('.dropdown-content')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};
