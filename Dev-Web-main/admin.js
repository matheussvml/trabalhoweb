// admin.js
const token = localStorage.getItem('token'); // Recupera o token do armazenamento local
const inputUpdateId = document.querySelector("#idRoupa")
const inputUpdateNome = document.querySelector("#novoNome")
const inputUpateImg = document.querySelector("#novaImagem")

const inputCategoria = document.querySelector("#novaCategoria")
const inputdesc = document.querySelector("#novadesc")
const deletarBtn = document.querySelector("#btnDelete")
async function carregarRoupas() {
    try {
        const response = await fetch('http://localhost:3000/api/roupas');
        const roupas = await response.json();
        
        const roupasLista = document.getElementById('roupas-lista');
        roupasLista.innerHTML = ''; // Limpa a lista antes de preencher

        // Cria elementos para cada roupa
        roupas.forEach(roupa => {
            const roupaItem = document.createElement('div');    
            roupaItem.id = "roupaItem"

            const idRoupa = document.createElement("p")
            idRoupa.textContent = `Id: ${roupa.id}`

            const roupaNome = document.createElement("p")
            roupaNome.textContent = `${roupa.nome} - R$ ${roupa.preco}`
            
            const roupaImg = document.createElement("img")
            roupaImg.src = roupa.imagem
            roupaImg.style.width = "100px"
            roupaImg.style.height = "auto"

            const roupaCategoria = document.createElement("p")
            roupaCategoria.textContent = `${roupa.categoria}`
            
            const deletarBtn = document.createElement("button")
            deletarBtn.textContent = "Deletar"

            const descRoupa = document.createElement("p")
            descRoupa.textContent = `Descrição: ${roupa.desc}`
            
            deletarBtn.addEventListener("click", ()=>{
                deletarRoupa(roupa.id)
            })

            const editarRoupa = document.createElement("button")
            editarRoupa.textContent = "Atualizar"


            editarRoupa.addEventListener("click", ()=>{
                
                const destino = document.querySelector(".form-section.atualizarRoupa");
    
                // Rolando suavemente até essa seção
                if (destino) {
                    destino.scrollIntoView({ behavior: "smooth" })
                
                inputUpdateId.value = roupa.id
                inputUpdateNome.value = roupa.nome
                inputUpateImg.value = roupa.imagem
                inputCategoria.value = roupa.categoria
                inputdesc.value = roupa.desc
                
            }})

            
            roupaItem.append(idRoupa,roupaNome, roupaImg, deletarBtn, editarRoupa, roupaCategoria, descRoupa)
            roupasLista.append(roupaItem);
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
    const categoria = document.getElementById('categoriaRoupa').value
    const descr = document.getElementById('descRoupa').value

    const token = localStorage.getItem('token'); // Recupera o token do armazenamento local

    try {
        // Primeiro, carregue as roupas atuais para verificar duplicações
        const response = await fetch('http://localhost:3000/api/roupas');
        const roupas = await response.json();

        // Verifique se a roupa já existe
        const existeRoupa = roupas.some(roupa => roupa.nome === nome);
        if (existeRoupa) {
            alert('Essa roupa já existe!');
            return; // Não adicione se já existir
        }

        const responsePost = await fetch('http://localhost:3000/api/roupas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nome,
                preco: parseFloat(preco), // Converte para número
                imagem,
                categoria,
                descr: descr // Certifique-se de enviar 'descr' corretamente
            })
        });
        

        if (responsePost.ok) {
            // Aqui, não é necessário chamar carregarRoupas novamente, pois você está apenas adicionando a nova roupa
            document.getElementById('nomeRoupa').value = '';
            document.getElementById('precoRoupa').value = '';
            document.getElementById('imagemRoupa').value = '';
            document.getElementById('categoriaRoupa').value = '';
            document.getElementById('descRoupa').value = '';
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
    const novoPreco = document.getElementById('novoPreco').value;
    const novaCategoria = document.getElementById('novaCategoria').value
    const novadesc = document.getElementById('novadesc').value


    const token = localStorage.getItem('token'); // Recupera o token do armazenamento local

    try {

        const response = await fetch(`http://localhost:3000/api/roupas/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adiciona o token de autenticação
            },
            body: JSON.stringify({ nome: novoNome, imagem: novaImagem, preco: parseFloat(novoPreco), categoria: novaCategoria, desc: novadesc })
        });

        if (response.ok) {
            const destino = document.querySelector(".roupas-container");
            if (destino) {
                destino.scrollIntoView({ behavior: "smooth" })
            }
            carregarRoupas(); // Recarrega a lista de roupas após atualizar
            document.getElementById('idRoupa').value = '';
            document.getElementById('novoNome').value = '';
            document.getElementById('novaImagem').value = '';
            document.getElementById('novoPreco').value = '';
            document.getElementById('novaCategoria').value = '';
            document.getElementById('novadesc').value = '';
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
        const response = await fetch(`http://localhost:3000/api/roupas/${id}`, {
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
const deleteIdInput = document.querySelector("#idRoupaDeletar")
deletarBtn.addEventListener("click", ()=>{
    deletarRoupa(deleteIdInput.value)
    deleteIdInput.value = ""
})
// Chame a função para carregar as roupas na inicialização
carregarRoupas();
