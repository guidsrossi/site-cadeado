const fases = [
  {
    senha: [4, 1, 2, 6],
    mensagemInicial: "Escolha os 4 n\u00fameros e tente abrir o cadeado.",
    subtitulo: "Ajuste os n\u00fameros e tente abrir.",
    mensagemSucesso: "Primeira senha correta! Veja a mensagem secreta.",
    iconeModal: "&#128272;",
    tituloModal: "Mensagem secreta",
    corpoModal: `
      <div class="formula-message">
        <p>&quot;Voc\u00eas encontraram a f\u00f3rmula secreta.&quot;</p>
        <strong>4x<sup>2</sup> - 12x + 6 = 0</strong>
      </div>
    `,
    textoBotaoModal: "Continuar"
  },
  {
    senha: [2, 3, 7, 0, 6, 3],
    mensagemInicial: "Agora escolha os 6 n\u00fameros e tente abrir o cadeado final.",
    subtitulo: "O cadeado mudou. Ajuste a nova senha.",
    mensagemSucesso: "Senha correta! Cadeado final desbloqueado.",
    iconeModal: "&#127942;",
    tituloModal: "Campe\u00e3o - Parabens",
    corpoModal: "<p>Voc\u00ea abriu o cadeado final.</p>",
    textoBotaoModal: "Fechar"
  }
];

const valores = [0, 0, 0, 0, 0, 0];
let faseAtual = 0;

const wheels = document.querySelectorAll(".number-wheel");
const checkButton = document.getElementById("checkButton");
const resetButton = document.getElementById("resetButton");
const message = document.getElementById("message");
const lock = document.getElementById("lock");
const card = document.getElementById("card");
const subtitle = document.getElementById("subtitle");
const codeArea = document.getElementById("codeArea");
const successModal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");
const modalIcon = document.getElementById("modalIcon");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

function faseAtiva() {
  return fases[faseAtual];
}

function atualizarNumero(index, novoValor, direction = "up") {
  valores[index] = (novoValor + 10) % 10;

  const wheel = document.querySelector(`.number-wheel[data-index="${index}"]`);
  const span = wheel.querySelector(".number-display span");

  span.textContent = valores[index];

  span.classList.remove("changing-up", "changing-down");

  void span.offsetWidth;

  span.classList.add(direction === "up" ? "changing-up" : "changing-down");
}

function atualizarInterfaceDaFase() {
  const fase = faseAtiva();
  const quantidadeDigitos = fase.senha.length;

  subtitle.textContent = fase.subtitulo;
  message.textContent = fase.mensagemInicial;
  message.className = "message";

  lock.classList.remove("open");
  checkButton.disabled = false;
  resetButton.classList.add("hidden");
  codeArea.classList.toggle("phase-two", quantidadeDigitos === 6);

  wheels.forEach((wheel, index) => {
    const ativo = index < quantidadeDigitos;

    wheel.classList.toggle("hidden", !ativo);
    wheel.setAttribute("aria-hidden", String(!ativo));
    wheel.querySelectorAll("button").forEach((button) => {
      button.disabled = !ativo;
    });
  });

  valores.forEach((_, index) => atualizarNumero(index, 0, "down"));
  esconderModal();
}

function aumentar(index) {
  atualizarNumero(index, valores[index] + 1, "up");
}

function diminuir(index) {
  atualizarNumero(index, valores[index] - 1, "down");
}

function mostrarModal() {
  const fase = faseAtiva();

  modalIcon.innerHTML = fase.iconeModal;
  modalTitle.textContent = fase.tituloModal;
  modalBody.innerHTML = fase.corpoModal;
  closeModal.textContent = fase.textoBotaoModal;

  successModal.classList.add("show");
  successModal.setAttribute("aria-hidden", "false");
}

function esconderModal() {
  successModal.classList.remove("show");
  successModal.setAttribute("aria-hidden", "true");
}

function avancarAposModal() {
  esconderModal();

  if (faseAtual === 0) {
    faseAtual = 1;
    atualizarInterfaceDaFase();
  }
}

function verificarSenha() {
  const senhaCorreta = faseAtiva().senha;
  const acertou = senhaCorreta.every((valor, index) => valor === valores[index]);

  if (acertou) {
    lock.classList.add("open");
    message.textContent = faseAtiva().mensagemSucesso;
    message.className = "message success";

    checkButton.disabled = true;
    resetButton.classList.toggle("hidden", faseAtual === 0);

    setTimeout(mostrarModal, 700);
  } else {
    message.textContent = "Senha incorreta. Tente novamente!";
    message.className = "message error";

    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
  }
}

function resetarJogo() {
  faseAtual = 0;
  atualizarInterfaceDaFase();
}

wheels.forEach((wheel) => {
  const index = Number(wheel.dataset.index);
  const upButton = wheel.querySelector(".up");
  const downButton = wheel.querySelector(".down");

  upButton.addEventListener("click", () => aumentar(index));
  downButton.addEventListener("click", () => diminuir(index));

  let startY = 0;
  let isDragging = false;

  wheel.addEventListener("touchstart", (event) => {
    startY = event.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  wheel.addEventListener("touchmove", (event) => {
    if (!isDragging) return;

    const currentY = event.touches[0].clientY;
    const diff = startY - currentY;

    if (Math.abs(diff) > 28) {
      if (diff > 0) {
        aumentar(index);
      } else {
        diminuir(index);
      }

      startY = currentY;
    }
  }, { passive: true });

  wheel.addEventListener("touchend", () => {
    isDragging = false;
  });

  wheel.addEventListener("mousedown", (event) => {
    startY = event.clientY;
    isDragging = true;
  });

  window.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    const currentY = event.clientY;
    const diff = startY - currentY;

    if (Math.abs(diff) > 28) {
      if (diff > 0) {
        aumentar(index);
      } else {
        diminuir(index);
      }

      startY = currentY;
    }
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  wheel.addEventListener("wheel", (event) => {
    event.preventDefault();

    if (event.deltaY < 0) {
      aumentar(index);
    } else {
      diminuir(index);
    }
  });
});

checkButton.addEventListener("click", verificarSenha);
resetButton.addEventListener("click", resetarJogo);
closeModal.addEventListener("click", avancarAposModal);

successModal.addEventListener("click", (event) => {
  if (event.target === successModal) {
    avancarAposModal();
  }
});

atualizarInterfaceDaFase();
