// ==========================================
// PH MAGIC STORE - CONFIGURAÇÕES
// ==========================================

// WhatsApp oficial da loja
const WHATSAPP_NUMBER = "5533984216811";

// ==========================================
// PRODUTOS DA LOJA
// ==========================================

const products = [
  {
    id: 1,
    name: "Baralho clássico",
    category: "Cartomagia",
    price: 29.90,
    description: "Um baralho para praticar e apresentar seus efeitos.",
    emoji: "🂡",
    tag: "Popular"
  },
  {
    id: 2,
    name: "Baralho premium",
    category: "Cartomagia",
    price: 49.90,
    description: "Visual elegante para suas rotinas de cartomagia.",
    emoji: "🃏",
    tag: "Destaque"
  },
  {
    id: 3,
    name: "Moeda mágica",
    category: "Close-up",
    price: 34.90,
    description: "Um acessório para criar momentos de surpresa de perto.",
    emoji: "🪙",
    tag: ""
  },
  {
    id: 4,
    name: "Kit de close-up",
    category: "Close-up",
    price: 79.90,
    description: "Uma seleção demonstrativa para apresentações próximas.",
    emoji: "✨",
    tag: "Novidade"
  },
  {
    id: 5,
    name: "Bloco de previsão",
    category: "Mentalismo",
    price: 39.90,
    description: "Item para construir uma rotina de previsão e mistério.",
    emoji: "📓",
    tag: ""
  },
  {
    id: 6,
    name: "Cartão de previsão",
    category: "Mentalismo",
    price: 24.90,
    description: "Acessório para efeitos de leitura e previsão.",
    emoji: "🔮",
    tag: ""
  },
  {
    id: 7,
    name: "Varinha mágica",
    category: "Acessórios",
    price: 44.90,
    description: "Um clássico acessório para sua apresentação.",
    emoji: "🪄",
    tag: ""
  },
  {
    id: 8,
    name: "Estojo para baralho",
    category: "Acessórios",
    price: 19.90,
    description: "Ajuda a proteger e transportar seu baralho.",
    emoji: "🎩",
    tag: ""
  }
];

// ==========================================
// VARIÁVEIS
// ==========================================

let activeFilter = "Todos";

let cart = JSON.parse(
  localStorage.getItem("phMagicCart") || "[]"
);

const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

// ==========================================
// FORMATAÇÃO DE PREÇOS
// ==========================================

function money(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// ==========================================
// EXIBIR PRODUTOS
// ==========================================

function renderProducts() {

  const search = document
    .getElementById("productSearch")
    .value.trim()
    .toLowerCase();

  const filtered = products.filter(product => {

    const matchesCategory =
      activeFilter === "Todos" ||
      product.category === activeFilter;

    const matchesSearch =
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(search);

    return matchesCategory && matchesSearch;

  });

  productGrid.innerHTML = filtered.length
    ? filtered.map(product => `

      <article class="product-card">

        <div class="product-visual">

          ${product.tag
            ? `<span class="product-tag">${product.tag}</span>`
            : ""
          }

          <span class="product-emoji" aria-hidden="true">
            ${product.emoji}
          </span>

        </div>

        <div class="product-info">

          <span class="product-category">
            ${product.category}
          </span>

          <h3>${product.name}</h3>

          <p class="product-description">
            ${product.description}
          </p>

          <div class="product-bottom">

            <strong class="product-price">
              ${money(product.price)}
            </strong>

            <button
              class="add-button"
              data-add="${product.id}">
              Adicionar +
            </button>

          </div>

        </div>

      </article>

    `).join("")

    : `<p class="empty-cart">
        Nenhum produto encontrado. Tente outra busca.
       </p>`;

}

// ==========================================
// SALVAR CARRINHO
// ==========================================

function saveCart() {

  localStorage.setItem(
    "phMagicCart",
    JSON.stringify(cart)
  );

  renderCart();

}

// ==========================================
// ADICIONAR PRODUTO
// ==========================================

function addToCart(id) {

  const item = cart.find(product => product.id === id);

  if (item) {

    item.quantity += 1;

  } else {

    cart.push({
      id,
      quantity: 1
    });

  }

  saveCart();

  showToast("Produto adicionado ao carrinho!");

}

// ==========================================
// ALTERAR QUANTIDADE
// ==========================================

function changeQuantity(id, amount) {

  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += amount;

  cart = cart.filter(
    product => product.quantity > 0
  );

  saveCart();

}

// ==========================================
// REMOVER PRODUTO
// ==========================================

function removeFromCart(id) {

  cart = cart.filter(
    product => product.id !== id
  );

  saveCart();

}

// ==========================================
// EXIBIR CARRINHO
// ==========================================

function renderCart() {

  const count = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce((sum, item) => {

    const product = products.find(
      p => p.id === item.id
    );

    return sum + (
      product
        ? product.price * item.quantity
        : 0
    );

  }, 0);

  document.getElementById("cartCount").textContent = count;

  document.getElementById("cartTotal").textContent =
    money(total);

  const cartItems = document.getElementById("cartItems");

  if (!cart.length) {

    cartItems.innerHTML = `
      <p class="empty-cart">
        Seu carrinho está vazio por enquanto.
      </p>
    `;

    return;

  }

  cartItems.innerHTML = cart.map(item => {

    const product = products.find(
      p => p.id === item.id
    );

    if (!product) return "";

    return `

      <div class="cart-row">

        <div class="cart-row-icon">
          ${product.emoji}
        </div>

        <div>

          <strong>${product.name}</strong>

          <small>
            ${money(product.price)} cada
          </small>

          <div class="quantity-controls">

            <button
              data-quantity="${product.id}"
              data-change="-1">
              −
            </button>

            <span>${item.quantity}</span>

            <button
              data-quantity="${product.id}"
              data-change="1">
              +
            </button>

          </div>

        </div>

        <button
          class="remove-item"
          data-remove="${product.id}">
          ×
        </button>

      </div>

    `;

  }).join("");

}

// ==========================================
// ABRIR CARRINHO
// ==========================================

function openCart() {

  cartDrawer.classList.add("open");

  overlay.classList.add("show");

  cartDrawer.setAttribute(
    "aria-hidden",
    "false"
  );

}

// ==========================================
// FECHAR CARRINHO
// ==========================================

function closeCart() {

  cartDrawer.classList.remove("open");

  overlay.classList.remove("show");

  cartDrawer.setAttribute(
    "aria-hidden",
    "true"
  );

}

// ==========================================
// NOTIFICAÇÕES
// ==========================================

function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 2200);

}

// ==========================================
// LINK DO WHATSAPP
// ==========================================

function whatsappUrl(message) {

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

}

// ==========================================
// EVENTOS DOS PRODUTOS
// ==========================================

productGrid.addEventListener("click", event => {

  const button = event.target.closest("[data-add]");

  if (button) {

    addToCart(Number(button.dataset.add));

  }

});

// ==========================================
// FILTROS DE CATEGORIA
// ==========================================

document
  .getElementById("filterList")
  .addEventListener("click", event => {

    const button = event.target.closest("[data-filter]");

    if (!button) return;

    activeFilter = button.dataset.filter;

    document
      .querySelectorAll(".filter-button")
      .forEach(item => {

        item.classList.toggle(
          "active",
          item === button
        );

      });

    renderProducts();

  });

// ==========================================
// CARDS DE CATEGORIA
// ==========================================

document
  .querySelectorAll(".category-card")
  .forEach(button => {

    button.addEventListener("click", () => {

      activeFilter = button.dataset.category;

      document
        .querySelectorAll(".filter-button")
        .forEach(item => {

          item.classList.toggle(
            "active",
            item.dataset.filter === activeFilter
          );

        });

      document.getElementById("productSearch").value = "";

      renderProducts();

      document
        .getElementById("produtos")
        .scrollIntoView({
          behavior: "smooth"
        });

    });

  });

// ==========================================
// PESQUISA DE PRODUTOS
// ==========================================

document
  .getElementById("productSearch")
  .addEventListener("input", renderProducts);

// ==========================================
// EVENTOS DO CARRINHO
// ==========================================

document
  .getElementById("openCart")
  .addEventListener("click", openCart);

document
  .getElementById("closeCart")
  .addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);

// ==========================================
// CONTROLES DE QUANTIDADE
// ==========================================

document
  .getElementById("cartItems")
  .addEventListener("click", event => {

    const quantityButton =
      event.target.closest("[data-quantity]");

    const removeButton =
      event.target.closest("[data-remove]");

    if (quantityButton) {

      changeQuantity(
        Number(quantityButton.dataset.quantity),
        Number(quantityButton.dataset.change)
      );

    }

    if (removeButton) {

      removeFromCart(
        Number(removeButton.dataset.remove)
      );

    }

  });

// ==========================================
// FINALIZAR PEDIDO PELO WHATSAPP
// ==========================================

document
  .getElementById("checkoutButton")
  .addEventListener("click", () => {

    if (!cart.length) {

      showToast(
        "Adicione pelo menos um produto primeiro."
      );

      return;

    }

    const lines = cart.map(item => {

      const product = products.find(
        p => p.id === item.id
      );

      return `• ${product.name} — ${item.quantity} x ${money(product.price)} = ${money(product.price * item.quantity)}`;

    });

    const total = cart.reduce((sum, item) => {

      const product = products.find(
        p => p.id === item.id
      );

      return sum + (
        product.price * item.quantity
      );

    }, 0);

    const message = `Olá! Quero consultar este pedido na Ph Magic Store:

${lines.join("\n")}

Total estimado: ${money(total)}

Poderia confirmar disponibilidade e formas de pagamento?`;

    window.open(
      whatsappUrl(message),
      "_blank",
      "noopener"
    );

  });

// ==========================================
// LINK DE CONTATO WHATSAPP
// ==========================================

const contactLink =
  document.getElementById("contactWhatsapp");

contactLink.href = whatsappUrl(
  "Olá! Gostaria de saber mais sobre os produtos da Ph Magic Store."
);

// ==========================================
// MENU RESPONSIVO
// ==========================================

const menuToggle =
  document.getElementById("menuToggle");

const mainNav =
  document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {

  const isOpen = mainNav.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

});

mainNav.querySelectorAll("a").forEach(link => {

  link.addEventListener("click", () => {

    mainNav.classList.remove("open");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

  });

});

// ==========================================
// ANO AUTOMÁTICO NO RODAPÉ
// ==========================================

document.getElementById("year").textContent =
  new Date().getFullYear();

// ==========================================
// INICIALIZAÇÃO DA LOJA
// ==========================================

renderProducts();

renderCart();
