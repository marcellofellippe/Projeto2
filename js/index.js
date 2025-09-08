// ==================== Funções de formatação e criação de produto ====================
function formatarPreco(valor) {
  if (valor == null) return "R$ 0,00";
  return "R$ " + Number(valor).toFixed(2).replace(".", ",");
}

function criarProdutoHTML(produto, idx) {
  const precoAtual = produto.preco?.por ?? 0;
  const precoAntigo = produto.preco?.de ?? 0;

  let tagProduto = produto.vegano
    ? `<div class="product__tag"><img src="image/Plant.png" alt="Vegano"><span>Vegano</span></div>`
    : `<div class="product__tag"><img src="image/Cow.png" alt="Com Leite"><span>Contém Leite</span></div>`;

  return `
    <div class="products__list--item">
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3 class="products__list--price">
        ${formatarPreco(precoAtual)}
        ${precoAntigo > precoAtual ? `<span class="price-old">${formatarPreco(precoAntigo)}</span>` : ""}
      </h3>
      <h4 class="products__list--name">${produto.nome}</h4>
      ${tagProduto}
      <form onsubmit="return false;">
        <div class="product__buy">
          <section class="product__quantity">
            <button class="product__quantity--minus" type="button" data-idx="${idx}">
              <img src="image/Minus.svg" alt="Diminuir quantidade">
            </button>
            <input type="text" class="product__quantity--input" value="1" data-idx="${idx}">
            <button class="product__quantity--plus" type="button" data-idx="${idx}">
              <img src="image/Plus.svg" alt="Aumentar quantidade">
            </button>
          </section>
          <button class="product__button" type="button" data-idx="${idx}">Comprar</button>
        </div>
      </form>
    </div>
  `;
}

// ==================== Renderização de produtos ====================
function renderizarProdutos() {
  const listaClassicos = document.getElementById("lista-classicos");
  const listaGelados = document.getElementById("lista-gelados");

  listaClassicos.innerHTML = "";
  listaGelados.innerHTML = "";

  dados.produtos.forEach((produto, idx) => {
    const htmlProduto = criarProdutoHTML(produto, idx);
    if (produto.categoria === "classicos") listaClassicos.innerHTML += htmlProduto;
    else if (produto.categoria === "gelados") listaGelados.innerHTML += htmlProduto;
  });

  adicionarListenersQuantidade();
}

// ==================== Carrinho ====================
function adicionarAoCarrinho(idx, quantidade) {
  const produto = dados.produtos[idx];
  if (!produto) return;

  let item = dados.carrinho.find(c => c.idProduto === produto.id);
  if (item) item.quantidade = parseInt(item.quantidade) + quantidade;
  else dados.carrinho.push({
    id: Math.random().toString(16).slice(2, 6),
    idProduto: produto.id,
    nome: produto.nome,
    imagem: produto.imagem,
    preco: produto.preco?.por ?? 0,
    vegano: produto.vegano,
    quantidade: quantidade
  });

  localStorage.setItem("carrinho", JSON.stringify(dados.carrinho));
  renderizarCarrinho();
}

function removerDoCarrinho(id) {
  dados.carrinho = dados.carrinho.filter(i => i.id !== id);
  localStorage.setItem("carrinho", JSON.stringify(dados.carrinho));
  renderizarCarrinho();
}

function alterarQuantidade(id, novaQtd) {
  const item = dados.carrinho.find(i => i.id === id);
  if (item) {
    item.quantidade = Math.max(1, novaQtd);

    // Atualiza input da página 
    const idxProduto = dados.produtos.findIndex(p => p.id === item.idProduto);
    const inputSite = document.querySelector(`.product__quantity--input[data-idx="${idxProduto}"]`);
    if (inputSite) inputSite.value = item.quantidade;

    localStorage.setItem("carrinho", JSON.stringify(dados.carrinho));
    renderizarCarrinho();
  }
}

function calcularResumo() {
  const subtotal = dados.carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const total = subtotal; // sem desconto por enquanto
  return { subtotal, total };
}

// ==================== Renderização do Carrinho ====================
function renderizarCarrinho() {
  const cartProducts = document.querySelector(".cart__products");
  const badge = document.querySelector(".badge__quantity");

  let resumo = document.querySelector(".cart__resumo");
  if (!resumo) {
    resumo = document.createElement("div");
    resumo.className = "cart__resumo";
    resumo.innerHTML = `
      <div><span>Subtotal:</span> <span id="cart-subtotal">R$ 0,00</span></div>
      <div><span>Desconto:</span> <span id="cart-desconto">R$ 0,00</span></div>
      <div><strong>Total:</strong> <strong id="cart-total">R$ 0,00</strong></div>
    `;
    cartProducts.insertAdjacentElement("afterend", resumo);
  }

  if (dados.carrinho.length === 0) {
    cartProducts.innerHTML = `<p>Carrinho vazio</p>`;
    badge.textContent = "0";
    document.getElementById("cart-subtotal").textContent = formatarPreco(0);
    document.getElementById("cart-desconto").textContent = formatarPreco(0);
    document.getElementById("cart-total").textContent = formatarPreco(0);
  } else {
    badge.textContent = dados.carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    cartProducts.innerHTML = dados.carrinho.map(item => `
      <div class="cart__item">
        <div class="cart__item--image">
          <img src="${item.imagem}" alt="${item.nome}">
        </div>
        <div class="cart__item--details">
          <p class="cart__item--name">${item.nome}</p>
          <div class="cart__item--controls">
            <button data-action="minus" data-id="${item.id}">-</button>
            <span>${item.quantidade}</span>
            <button data-action="plus" data-id="${item.id}">+</button>
          </div>
          <p>${formatarPreco(item.preco * item.quantidade)}</p>
        </div>
        <button class="cart__item--remove" data-action="remove" data-id="${item.id}">
          <img src="image/X.svg" alt="Remover item">
        </button>
      </div>
    `).join("");

    const { subtotal, total } = calcularResumo();
    document.getElementById("cart-subtotal").textContent = formatarPreco(subtotal);
    document.getElementById("cart-total").textContent = formatarPreco(total);

    // Botão Limpar Carrinho
    let btnLimpar = document.getElementById("btn-limpar-carrinho");
    if (!btnLimpar) {
      btnLimpar = document.createElement("button");
      btnLimpar.id = "btn-limpar-carrinho";
      btnLimpar.textContent = "Limpar Carrinho";
      btnLimpar.style.marginTop = "10px";
      btnLimpar.style.padding = "5px 10px";
      btnLimpar.style.backgroundColor = "var(--brown-500)";
      btnLimpar.style.color = "#fff";
      btnLimpar.style.border = "none";
      btnLimpar.style.borderRadius = "5px";
      btnLimpar.style.cursor = "pointer";
      resumo.appendChild(btnLimpar);

      btnLimpar.onclick = () => {
        if (confirm("Deseja realmente limpar todo o carrinho?")) {
          dados.carrinho = [];
          localStorage.setItem("carrinho", JSON.stringify(dados.carrinho));
          renderizarCarrinho();
        }
      };
    }
  }

  // Listeners dos itens
  document.querySelectorAll(".cart__item--remove").forEach(btn => {
    btn.onclick = () => removerDoCarrinho(btn.dataset.id);
  });
  document.querySelectorAll("[data-action='minus']").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      alterarQuantidade(id, dados.carrinho.find(i => i.id === id).quantidade - 1);
    };
  });
  document.querySelectorAll("[data-action='plus']").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      alterarQuantidade(id, dados.carrinho.find(i => i.id === id).quantidade + 1);
    };
  });
}

// ==================== Listeners de quantidade e adicionar produtos ====================
function adicionarListenersQuantidade() {
  document.querySelectorAll('.product__quantity--minus').forEach(btn => {
    btn.onclick = () => {
      const idx = btn.dataset.idx;
      const input = document.querySelector(`.product__quantity--input[data-idx="${idx}"]`);
      let val = parseInt(input.value) || 1;
      if (val > 1) val--;
      input.value = val;
    };
  });

  document.querySelectorAll('.product__quantity--plus').forEach(btn => {
    btn.onclick = () => {
      const idx = btn.dataset.idx;
      const input = document.querySelector(`.product__quantity--input[data-idx="${idx}"]`);
      let val = parseInt(input.value) || 1;
      val++;
      input.value = val;
    };
  });

  document.querySelectorAll('.product__button').forEach(btn => {
    btn.onclick = () => {
      const idx = btn.dataset.idx;
      const input = document.querySelector(`.product__quantity--input[data-idx="${idx}"]`);
      const quantidade = parseInt(input.value) || 1;
      adicionarAoCarrinho(idx, quantidade);
      mostrarAviso("Item adicionado ao carrinho!");
    };
  });
}

// ==================== Modal do Carrinho ====================
function inicializarEventosCarrinhoModal() {
  const linkToggle = document.getElementById("carrinho-toggle");
  const cartEl = document.getElementById("cart");
  const cartClose = document.getElementById("cart-close");
  const btnFinalizar = document.getElementById("finalizar-compra");
  const modalCompra = document.getElementById("modal-compra");
  const modalConfirmar = document.getElementById("modal-confirmar");
  const modalCancelar = document.getElementById("modal-cancelar");

  linkToggle.addEventListener("click", e => {
    e.preventDefault();
    cartEl.classList.add("cart--active");
  });

  cartClose.addEventListener("click", () => cartEl.classList.remove("cart--active"));

  btnFinalizar.addEventListener("click", () => {
    if (dados.carrinho.length > 0) modalCompra.style.display = "flex";
    else mostrarAviso("Seu carrinho está vazio!");
  });

  modalCancelar.addEventListener("click", () => modalCompra.style.display = "none");

  modalConfirmar.addEventListener("click", () => {
    modalCompra.style.display = "none";
    window.location.href = "pagamento.html";
  });
}

// ==================== Aviso ====================
function mostrarAviso(mensagem) {
  const aviso = document.getElementById("aviso-compra");
  if (!aviso) return;
  aviso.textContent = mensagem;
  aviso.classList.add("show");
  setTimeout(() => aviso.classList.remove("show"), 3000);
}

// ==================== Inicialização ====================
document.addEventListener("DOMContentLoaded", () => {
  dados.carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  renderizarProdutos();
  renderizarCarrinho();
  inicializarEventosCarrinhoModal();
});
