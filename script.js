const fases = [
  {
    nome: "Fase 1",
    senha: "3",
    titulo: "Primeira Fase",
    subtitulo: "A primeira porta pede uma senha curta.",
    dica: "Digite a senha da primeira fase.",
    sucesso: "Porta 1 aberta. Siga para a próxima fase."
  },
  {
    nome: "Fase 2",
    senha: "8",
    titulo: "Segunda Fase",
    subtitulo: "A sala ficou mais silenciosa. Uma nova senha é necessária.",
    dica: "Digite a senha da segunda fase.",
    sucesso: "Porta 2 aberta. Continue avançando."
  },
  {
    nome: "Fase 3",
    senha: "2212",
    titulo: "Terceira Fase",
    subtitulo: "Agora o código tem quatro dígitos.",
    dica: "Digite a senha da terceira fase.",
    sucesso: "Porta 3 aberta. Você está na metade final."
  },
  {
    nome: "Fase 4",
    senha: "5",
    titulo: "Quarta Fase",
    subtitulo: "Mais uma fechadura apareceu no caminho.",
    dica: "Digite a senha da quarta fase.",
    sucesso: "Porta 4 aberta. Falta pouco."
  },
  {
    nome: "Fase 5",
    senha: "2",
    titulo: "Quinta Fase",
    subtitulo: "A última porta antes da saída guarda uma peça do código final.",
    dica: "Digite a senha da quinta fase.",
    sucesso: "Porta 5 aberta. A saída está logo adiante."
  },
  {
    nome: "Última Fase",
    senha: "3-8-2212-5-2",
    titulo: "Porta Final",
    subtitulo: "Use todas as senhas encontradas para abrir a saída.",
    dica: "Digite a senha final completa.",
    sucesso: "A porta final foi aberta."
  }
];

let faseAtual = -1;

const card = document.getElementById("card");
const phaseBadge = document.getElementById("phaseBadge");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const lock = document.getElementById("lock");
const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const passwordLabel = document.getElementById("passwordLabel");
const startButton = document.getElementById("startButton");
const checkButton = document.getElementById("checkButton");
const resetButton = document.getElementById("resetButton");
const message = document.getElementById("message");
const successModal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

function faseAtiva() {
  return fases[faseAtual];
}

function normalizarSenha(valor) {
  return valor.trim();
}

function atualizarInterface() {
  const fase = faseAtiva();

  phaseBadge.textContent = fase.nome;
  title.textContent = fase.titulo;
  subtitle.textContent = fase.subtitulo;
  passwordLabel.textContent = fase.dica;
  passwordInput.value = "";
  passwordInput.placeholder = faseAtual === fases.length - 1 ? "3-8-2212-5-2" : "Senha";
  message.textContent = "Digite a senha para liberar esta fase.";
  message.className = "message";
  lock.classList.remove("open");
  checkButton.disabled = false;
  resetButton.classList.remove("hidden");

  setTimeout(() => passwordInput.focus(), 80);
}

function iniciarJogo() {
  faseAtual = 0;
  startButton.classList.add("hidden");
  passwordForm.classList.remove("hidden");
  atualizarInterface();
}

function mostrarErro() {
  message.textContent = "Senha incorreta. Tente novamente!";
  message.className = "message error";
  card.classList.remove("shake");
  void card.offsetWidth;
  card.classList.add("shake");
  passwordInput.select();
}

function mostrarParabens() {
  modalTitle.textContent = "Parabéns!";
  modalBody.innerHTML = "<p>Você completou o escape room e abriu a porta final.</p>";
  successModal.classList.add("show");
  successModal.setAttribute("aria-hidden", "false");
}

function esconderModal() {
  successModal.classList.remove("show");
  successModal.setAttribute("aria-hidden", "true");
}

function avancarFase() {
  lock.classList.add("open");
  message.textContent = faseAtiva().sucesso;
  message.className = "message success";
  checkButton.disabled = true;

  if (faseAtual === fases.length - 1) {
    setTimeout(mostrarParabens, 750);
    return;
  }

  setTimeout(() => {
    faseAtual += 1;
    atualizarInterface();
  }, 950);
}

function verificarSenha(event) {
  event.preventDefault();

  if (normalizarSenha(passwordInput.value) === faseAtiva().senha) {
    avancarFase();
  } else {
    mostrarErro();
  }
}

function resetarJogo() {
  faseAtual = -1;
  esconderModal();
  passwordForm.classList.add("hidden");
  startButton.classList.remove("hidden");
  resetButton.classList.add("hidden");
  phaseBadge.textContent = "Entrada";
  title.textContent = "Escape Room";
  subtitle.textContent = "Clique em iniciar para entrar na primeira fase.";
  message.textContent = "Você está diante de uma sequência de portas trancadas.";
  message.className = "message";
  lock.classList.remove("open");
}

startButton.addEventListener("click", iniciarJogo);
passwordForm.addEventListener("submit", verificarSenha);
resetButton.addEventListener("click", resetarJogo);
closeModal.addEventListener("click", resetarJogo);

successModal.addEventListener("click", (event) => {
  if (event.target === successModal) {
    resetarJogo();
  }
});
