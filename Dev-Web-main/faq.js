const questions = document.querySelectorAll('.question');

questions.forEach(question => {
	const answer = question.nextElementSibling; // Seleciona o <p class="answer"> relacionado
	const arrow = question.querySelector('img'); // Seleciona o ícone da seta na pergunta
	
	answer.style.display = 'none'; // Inicialmente oculta todas as respostas

	// Adiciona o evento de clique para alternar a visibilidade da resposta
	question.addEventListener('click', () => {
		const isVisible = answer.style.display === 'block';
		
		// Alterna a visibilidade da resposta
		answer.style.display = isVisible ? 'none' : 'block';
		
		// Rotaciona a seta e muda a cor da pergunta
		arrow.style.transform = isVisible ? 'rotate(0)' : 'rotate(180deg)';
		question.style.color = isVisible ? 'rgb(90, 90, 90)' : 'crimson';
	});
});
