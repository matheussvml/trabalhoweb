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

            const botaoAddCar = document.createElement("button");
            botaoAddCar.classList.add("Adiciona");
            botaoAddCar.innerHTML = '<span class="material-symbols-outlined">shopping_cart</span> Adicionar ao carrinho';
            botaoAddCar.onclick = () => addCarrinho(roupa.id);

            produtoA.append(imgRoupa, nomeRoupa, precoRoupa);
            produtoDiv.append(produtoA, botaoAddCar);
            container.appendChild(produtoDiv);
        });
    } catch (error) {
        console.error('Erro na API:', error);
        document.write(`ERRO NA API: ${error.message}`);
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


// Chame a função para carregar as roupas na inicialização
mostrarRoupas();


// Carregar carrinho do localStorage
function carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
}

// Salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Carrinho global
let carrinho = carregarCarrinho();

// Adicionar item ao carrinho
function addCarrinho(id, nome, preco) {
    const produtoExistente = carrinho.find((item) => item.id === id);

    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push({ id, nome, preco, quantidade: 1 });
    }
    salvarCarrinho(); // Salvar no localStorage
    atualizarCarrinho();
    alert('Produto adicionado ao carrinho!');
}

// Função para exibir o carrinho
// function exibirCarrinho() {
//     const carrinhoTable = document.querySelector("#carrinho-table tbody");
//     const totalGeralElement = document.getElementById("total-geral");

//     if (!carrinhoTable || !totalGeralElement) {
//         console.error("Tabela do carrinho ou elemento do total geral não encontrados.");
//         return;
//     }

//     carrinhoTable.innerHTML = ""; // Limpa a tabela antes de atualizá-la
//     let totalGeral = 0;

//     if (carrinho.length === 0) {
//         carrinhoTable.innerHTML = `
//             <tr>
//                 <td colspan="5" style="text-align: center;">Carrinho vazio.</td>
//             </tr>`;
//         totalGeralElement.textContent = "0.00";
//         return;
//     }

//     carrinho.forEach((item) => {
//         const total = item.preco * item.quantidade;
//         totalGeral += total;

//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td>${item.nome}</td>
//             <td>R$ ${item.preco.toFixed(2)}</td>
//             <td>
//                 <input type="number" min="1" value="${item.quantidade}" onchange="alterarQuantidade(${item.id}, this.value)" />
//             </td>
//             <td>R$ ${total.toFixed(2)}</td>
//             <td>
//                 <button class="btn-remover" onclick="removerDoCarrinho(${item.id})">Remover</button>
//             </td>
//         `;
//         carrinhoTable.appendChild(row);
//     });

//     totalGeralElement.textContent = totalGeral.toFixed(2);
// }


// Alterar quantidade no carrinho
function alterarQuantidade(id, novaQuantidade) {
    const produto = carrinho.find((item) => item.id === id);
    if (produto) {
        produto.quantidade = parseInt(novaQuantidade, 10) || 1;
        salvarCarrinho();
        exibirCarrinho();
    }
}

// Remover item do carrinho
function removerDoCarrinho(id) {
    carrinho = carrinho.filter((item) => item.id !== id);
    salvarCarrinho();
    exibirCarrinho();
}

// Função para adicionar ao carrinho a partir da página de detalhes
function adicionarAoCarrinhoDetalhes() {
    const id = new URLSearchParams(window.location.search).get('id');
    const nome = document.getElementById('product-name').textContent;
    const preco = parseFloat(
        document.getElementById('current-price').textContent.replace('Preço: R$ ', '').replace(',', '.')
    );

    if (!id || !nome || isNaN(preco)) {
        alert('Erro ao adicionar o produto ao carrinho. Verifique os detalhes.');
        return;
    }

    addCarrinho(id, nome, preco);
}

async function mostrarDetalhes() {
    const urlParams = new URLSearchParams(window.location.search); // Obtém parâmetros da URL
    const id = urlParams.get('id'); // Extrai o parâmetro 'id' da URL

    if (!id) {
        alert('Produto não encontrado. Verifique a URL.');
        return;
    }

    try {
        // Faz a requisição para buscar os detalhes do produto com base no ID
        const resposta = await fetch(`http://localhost:3000/api/roupas/${id}`);

        if (!resposta.ok) {
            throw new Error(`Erro ao carregar detalhes: ${resposta.status}`);
        }

        const roupa = await resposta.json(); // Converte a resposta para JSON

        if (!roupa) {
            throw new Error('Produto não encontrado.');
        }

        console.log("Resposta da API:", roupa);

        // Atualiza os elementos do DOM com os detalhes do produto
        document.getElementById('product-image').src = roupa.imagem || 'placeholder.jpg';
        document.getElementById('product-name').textContent = roupa.nome || 'Nome não disponível';
        document.getElementById('current-price').textContent = `Preço: R$ ${parseFloat(roupa.preco).toFixed(2)}`;
        document.getElementById('product-category').textContent = `Categoria: ${roupa.categoria || 'Não especificada'}`;
        document.getElementById('product-description').textContent = `Descrição: ${roupa.desc || 'Sem descrição'}`;
    } catch (error) {
        console.error('Erro ao carregar os detalhes do produto:', error);
        alert('Erro ao carregar os detalhes do produto. Tente novamente mais tarde.');
    }
}


// Exibir carrinho ao carregar a página principal
document.addEventListener("DOMContentLoaded", () => {
    mostrarRoupas();
    // exibirCarrinho();
    mostrarDetalhes();
});

