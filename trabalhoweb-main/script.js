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


function entrarComoAdmin() {
    document.getElementById('produtos').style.display = 'none'; // Oculta a seção de produtos
    document.getElementById('admin').style.display = 'block'; // Exibe a seção de admin
    buscarRoupasAdmin(); // Carrega roupas na seção de admin
}

async function mostrarRoupas() {
    try {
        const resposta = await fetch("https://0ba092f0-4048-41f3-a3ac-4fb804d6e15d-00-2sb31d6mw6zvi.worf.replit.dev/api/roupas");
        const dados = await resposta.json();

        const container = document.getElementById('produtos-container');
        container.innerHTML = ''; // Limpa o container antes de adicionar novos produtos

        dados.forEach(roupa => {
            const produtoDiv = document.createElement('div');
            produtoDiv.classList.add('produto');

            const produtoA = document.createElement("a");
            produtoA.href = "/Dev-Web-main/detalhes.html?id=" + roupa.id; // Altera o href para redirecionar para detalhes.html
            produtoA.classList = "produtoA";
        
            const imgRoupa = document.createElement("img");
            imgRoupa.src = roupa.imagem;
            imgRoupa.alt = roupa.nome;
            imgRoupa.style.maxWidth = "120px";
        
            const nomeRoupa = document.createElement("h3");
            nomeRoupa.textContent = roupa.nome;
        
            const precoRoupa = document.createElement("p");
            precoRoupa.textContent = `R$ ${roupa.preco.toFixed(2)}`;
        
            const botaoAddCar = document.createElement("button");
            botaoAddCar.classList = "Adiciona";
            botaoAddCar.innerHTML = '<span class="material-symbols-outlined">shopping_cart</span> Adicionar ao carrinho';
            botaoAddCar.onclick = () => addCarrinho(roupa.id);
        
            produtoA.append(imgRoupa, nomeRoupa, precoRoupa);
            produtoDiv.append(produtoA, botaoAddCar);
            container.appendChild(produtoDiv);
        });
    } catch (error) {
        document.write(`ERRO NA API: ${error.message}`);
    }
}


mostrarRoupas();

// Função para buscar e exibir todas as roupas na seção de admin
function buscarRoupasAdmin() {
    fetch('https://0ba092f0-4048-41f3-a3ac-4fb804d6e15d-00-2sb31d6mw6zvi.worf.replit.dev/api/roupas')
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

    fetch('https://0ba092f0-4048-41f3-a3ac-4fb804d6e15d-00-2sb31d6mw6zvi.worf.replit.dev/api/roupas', {
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
    fetch(`https://0ba092f0-4048-41f3-a3ac-4fb804d6e15d-00-2sb31d6mw6zvi.worf.replit.dev/api/roupas/${id}`, {
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

    const resposta = await fetch('https://0ba092f0-4048-41f3-a3ac-4fb804d6e15d-00-2sb31d6mw6zvi.worf.replit.dev/api/login', {
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
        const response = await fetch('https://0ba092f0-4048-41f3-a3ac-4fb804d6e15d-00-2sb31d6mw6zvi.worf.replit.dev/api/login', {
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
    fetch(`https://0ba092f0-4048-41f3-a3ac-4fb804d6e15d-00-2sb31d6mw6zvi.worf.replit.dev/api/roupas/${idRoupa}`, {
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
        buscarRoupasAdmin(); // Atualiza a lista de roupas
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Houve um problema ao atualizar a roupa. Verifique os dados e tente novamente.');
    });
}


// Chame a função para carregar as roupas na inicialização
mostrarRoupas();
