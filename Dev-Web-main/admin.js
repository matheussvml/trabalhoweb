// admin.js
const token = localStorage.getItem('token'); // Recupera o token do armazenamento local

async function carregarRoupas() {
    try {
        const response = await fetch('https://0ba092f0-4048-41f3-a3ac-4fb804d6e15d-00-2sb31d6mw6zvi.worf.replit.dev/api/roupas');
        const roupas = await response.json();
        
        const roupasLista = document.getElementById('roupas-lista');
        roupasLista.innerHTML = ''; // Limpa a lista antes de preencher

        // Cria elementos para cada roupa
        roupas.forEach(roupa => {
            const roupaItem = document.createElement('div');
            roupaItem.innerHTML = `
                <p><strong>${roupa.nome}</strong> - R$ ${roupa.preco}</p>
                <img src="${roupa.imagem}" alt="${roupa.nome}" style="width: 100px; height: auto;">
                <button onclick="deletarRoupa('${roupa.id}')">Deletar</button>
                <button onclick="prepararAtualizacao('${roupa.id}', '${roupa.nome}', ${roupa.preco}, '${roupa.imagem}')">Atualizar</button>
            `;
            roupasLista.appendChild(roupaItem);
        });
    } catch (error) {
        console.error('Erro ao carregar roupas:', error);
    }
}

// Chama a função ao carregar a página
window.onload = carregarRoupas;


// Função para adicionar roupa
async function adicionarRoupa() {
    const nome = document.getElementById('nomeRoupa').value;
    const preco = document.getElementById('precoRoupa').value;
    const imagem = document.getElementById('imagemRoupa').value;

    const token = localStorage.getItem('token'); // Recupera o token do armazenamento local

    try {
        // Primeiro, carregue as roupas atuais para verificar duplicações
        const response = await fetch('https://0ba092f0-4048-41f3-a3ac-4fb804d6e15d-00-2sb31d6mw6zvi.worf.replit.dev/api/roupas');
        const roupas = await response.json();

        // Verifique se a roupa já existe
        const existeRoupa = roupas.some(roupa => roupa.nome === nome);
        if (existeRoupa) {
            alert('Essa roupa já existe!');
            return; // Não adicione se já existir
        }

        const responsePost = await fetch('https://0ba092f0-4048-41f3-a3ac-4fb804d6e15d-00-2sb31d6mw6zvi.worf.replit.dev/api/roupas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adiciona o token de autenticação
            },
            body: JSON.stringify({ nome, preco: parseFloat(preco), imagem })
        });

        if (responsePost.ok) {
            // Aqui, não é necessário chamar carregarRoupas novamente, pois você está apenas adicionando a nova roupa
            document.getElementById('nomeRoupa').value = '';
            document.getElementById('precoRoupa').value = '';
            document.getElementById('imagemRoupa').value = '';
            carregarRoupas(); // Recarrega a lista de roupas após adicionar
        } else {
            console.error('Erro ao adicionar roupa:', responsePost.statusText);
        }
    } catch (error) {
        console.error('Erro ao adicionar roupa:', error);
    }
}




// Função para atualizar roupa
async function atualizarRoupa() {
    const id = document.getElementById('idRoupa').value;
    const novoNome = document.getElementById('novoNome').value;
    const novaImagem = document.getElementById('novaImagem').value;
    const novoPreco = document.getElementById('precoRoupa').value;

    const token = localStorage.getItem('token'); // Recupera o token do armazenamento local

    try {
        const response = await fetch(`https://0ba092f0-4048-41f3-a3ac-4fb804d6e15d-00-2sb31d6mw6zvi.worf.replit.dev/api/roupas/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adiciona o token de autenticação
            },
            body: JSON.stringify({ nome: novoNome, imagem: novaImagem, preco: parseFloat(novoPreco) })
        });

        if (response.ok) {
            carregarRoupas(); // Recarrega a lista de roupas após atualizar
            document.getElementById('idRoupa').value = '';
            document.getElementById('novoNome').value = '';
            document.getElementById('novaImagem').value = '';
            document.getElementById('precoRoupa').value = '';
        } else {
            console.error('Erro ao atualizar roupa:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao atualizar roupa:', error);
    }
}

// Função para deletar roupa
async function deletarRoupa(id) {
    const token = localStorage.getItem('token'); // Recupera o token do armazenamento local

    try {
        const response = await fetch(`https://0ba092f0-4048-41f3-a3ac-4fb804d6e15d-00-2sb31d6mw6zvi.worf.replit.dev/api/roupas/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // Adiciona o token de autenticação
            }
        });

        if (response.ok) {
            carregarRoupas(); // Recarrega a lista de roupas após deletar
        } else {
            console.error('Erro ao deletar roupa:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao deletar roupa:', error);
    }
}


// Chame a função para carregar as roupas na inicialização
carregarRoupas();

function exibirRoupas(dados) {
    const container = document.getElementById('produtos-container-admin');
    container.innerHTML = ''; // Limpa o container antes de adicionar novas roupas

    dados.forEach(roupa => {
        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto');

        produtoDiv.innerHTML = `
            <img src="${roupa.imagem}" alt="${roupa.nome}" style="max-width: 120px;">
            <h3>${roupa.nome}</h3>
            <p>R$ ${roupa.preco.toFixed(2)}</p>
            <button onclick="deletarRoupa(${roupa.id})">Deletar</button>
        `;

        container.appendChild(produtoDiv);
    });
}
