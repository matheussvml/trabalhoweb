const loginForm = document.querySelector(".my-form");
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if (password.value !== confirmPassword.value) {
        alert('As senhas não coincidem!');
        return;
    }

    const response = await fetch('https://a9d8b915-4ebe-4d56-bcea-90efb67c3b9b-00-35la7r7wzyor6.kirk.replit.dev/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.value, password: password.value }),
    });

    const data = await response.json();
    const messageDiv = document.createElement('div');
    messageDiv.id = 'message'; // Adiciona um elemento para exibir mensagens
    document.body.appendChild(messageDiv); // Adiciona o elemento ao body

    if (response.ok) {
        alert("Cadastro Realizado Com Sucesso!")
        username.value = ""
        password.value = ""
        confirmPassword.value = ""
        window.location.href = "login.html"
        messageDiv.textContent = 'Registro bem-sucedido! Você pode fazer login agora.';
    } else {
        messageDiv.textContent = data.error; // Mostra o erro caso ocorra
    }
});
