const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");

// Adiciona eventos de foco e desfoque aos campos de entrada
inputs.forEach((inp) => {
  inp.addEventListener("focus", () => {
    inp.classList.add("active");
  });
  inp.addEventListener("blur", () => {
    if (inp.value !== "") return;
    inp.classList.remove("active");
  });
});

// Alterna entre as telas de login e cadastro
toggle_btn.forEach((btn) => {
  btn.addEventListener("click", () => {
    main.classList.toggle("sign-up-mode");
  });
});

// Move o slider
function moveSlider() {
  let index = this.dataset.value;

  let currentImage = document.querySelector(`.img-${index}`);
  images.forEach((img) => img.classList.remove("show"));
  currentImage.classList.add("show");

  const textSlider = document.querySelector(".text-group");
  textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;

  bullets.forEach((bull) => bull.classList.remove("active"));
  this.classList.add("active");
}

// Adiciona evento de clique aos bullets
bullets.forEach((bullet) => {
  bullet.addEventListener("click", moveSlider);
});

// Adiciona evento de submit ao formulário de login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Impede o envio padrão do formulário

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('https://0ba092f0-4048-41f3-a3ac-4fb804d6e15d-00-2sb31d6mw6zvi.worf.replit.dev/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      if (data.isAdmin) {
        window.location.href = 'admin.html'; // Redireciona para admin.html
      } else {
        window.location.href = 'index.html'; // Redireciona para index.html
      }
    } else {
      alert(data.error || 'Falha no login');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao tentar fazer login');
  }
});
