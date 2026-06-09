// Altere aqui a senha correta do cadeado.
const senhaCorreta = [4, 0, 1, 2];
const valores = [0, 0, 0, 0];
const mensagemInicial = "Escolha os 4 n\u00fameros e tente abrir o cadeado.";

const wheels = document.querySelectorAll(".number-wheel");
const checkButton = document.getElementById("checkButton");
const resetButton = document.getElementById("resetButton");
const message = document.getElementById("message");
const lock = document.getElementById("lock");
const card = document.getElementById("card");
const successModal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");

function atualizarNumero(index, novoValor, direction = "up") {
  valores[index] = (novoValor + 10) % 10;

  const wheel = document.querySelector(`.number-wheel[data-index="${index}"]`);
  const span = wheel.querySelector(".number-display span");

  span.textContent = valores[index];

  span.classList.remove("changing-up", "changing-down");

  void span.offsetWidth;

  span.classList.add(direction === "up" ? "changing-up" : "changing-down");
}

function aumentar(index) {
  atualizarNumero(index, valores[index] + 1, "up");
}

function diminuir(index) {
  atualizarNumero(index, valores[index] - 1, "down");
}

function verificarSenha() {
  const acertou = valores.every((valor, index) => valor === senhaCorreta[index]);

  if (acertou) {
    lock.classList.add("open");
    message.textContent = "Senha correta! Cadeado desbloqueado.";
    message.className = "message success";

    checkButton.disabled = true;
    resetButton.classList.remove("hidden");

    setTimeout(() => {
      successModal.classList.add("show");
      successModal.setAttribute("aria-hidden", "false");
    }, 700);
  } else {
    message.textContent = "Senha incorreta. Tente novamente!";
    message.className = "message error";

    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
  }
}

function resetarJogo() {
  valores.forEach((_, index) => atualizarNumero(index, 0, "down"));

  lock.classList.remove("open");
  message.textContent = mensagemInicial;
  message.className = "message";

  checkButton.disabled = false;
  resetButton.classList.add("hidden");

  successModal.classList.remove("show");
  successModal.setAttribute("aria-hidden", "true");
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

closeModal.addEventListener("click", () => {
  successModal.classList.remove("show");
  successModal.setAttribute("aria-hidden", "true");
});

successModal.addEventListener("click", (event) => {
  if (event.target === successModal) {
    successModal.classList.remove("show");
    successModal.setAttribute("aria-hidden", "true");
  }
});
