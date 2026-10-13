
const products = [
  {name:"Mini Aspirador Portátil",price:39.90,category:"Mais vendidos",emoji:"🧹"},
  {name:"Suporte Magnético para Celular",price:29.90,category:"Celular",emoji:"📱"},
  {name:"Luminária LED Criativa",price:49.90,category:"Casa",emoji:"💡"},
  {name:"Acessório Gamer",price:59.90,category:"Games",emoji:"🎮"},
  {name:"Organizador Multiuso",price:34.90,category:"Ofertas",emoji:"📦"},
  {name:"Produto Surpresa SóAchei",price:44.90,category:"Lançamentos",emoji:"🎁"}
];

// Troque pelo número real da loja, com código do país e DDD.
const WHATSAPP = "5500000000000";
const STORAGE_KEY = "soachei_carrinho";

let cart = [];
try {
  cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (!Array.isArray(cart)) cart = [];
} catch {
  cart = [];
}

const money = value => Number(value).toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function renderProducts(list = products) {
  const box = document.getElementById("products");
  if (!box) return;

  box.innerHTML = "";

  list.forEach(product => {
    const index = products.indexOf(product);
    const card = document.createElement("article");
    card.className = "product";

    card.innerHTML = `
      <div class="product-img">${product.emoji}</div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>Achadinho selecionado pela SóAchei.</p>
        <div class="price">${money(product.price)}</div>
        <button class="add" onclick="addToCart(${index})">
          ADICIONAR AO CARRINHO
        </button>
      </div>`;

    box.appendChild(card);
  });
}

function filterProducts(category) {
  const list = category === "Todos"
    ? products
    : products.filter(p => p.category === category);

  renderProducts(list);
  scrollToProducts();
}

function scrollToProducts() {
  document.getElementById("produtos")?.scrollIntoView({
    behavior: "smooth"
  });
}

function addToCart(index) {
  const product = products[index];
  if (!product) return;

  const item = cart.find(p => p.name === product.name);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({...product, quantity: 1});
  }

  saveCart();
  updateCart();
  showToast("Produto adicionado ao carrinho!");
}

function updateCart() {
  const count = document.getElementById("cartCount");
  if (count) {
    count.textContent = cart.reduce((sum, p) => sum + p.quantity, 0);
  }

  const box = document.getElementById("cartItems");
  if (!box) return;

  box.innerHTML = "";

  if (cart.length === 0) {
    box.innerHTML = `
      <div class="empty-cart">
        <div style="font-size:50px">🛒</div>
        <h3>Seu carrinho está vazio</h3>
        <p>Encontre seu próximo achadinho!</p>
        <a class="primary" href="index.html">Ver produtos</a>
      </div>`;
  } else {
    cart.forEach((product, index) => {
      const item = document.createElement("div");
      item.className = "cart-row";

      item.innerHTML = `
        <span class="cart-emoji">${product.emoji}</span>
        <div class="cart-product">
          <b>${product.name}</b>
          <p>${money(product.price)} cada</p>
          <p>Subtotal: ${money(product.price * product.quantity)}</p>
        </div>
        <div class="quantity">
          <button onclick="changeQuantity(${index}, -1)" aria-label="Diminuir">−</button>
          <b>${product.quantity}</b>
          <button onclick="changeQuantity(${index}, 1)" aria-label="Aumentar">+</button>
        </div>
        <button class="remove-item" onclick="removeFromCart(${index})">Remover</button>`;

      box.appendChild(item);
    });
  }

  const total = cart.reduce(
    (sum, p) => sum + p.price * p.quantity, 0
  );

  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = money(total);

  const subtotalEl = document.getElementById("cartSubtotal");
  if (subtotalEl) subtotalEl.textContent = money(total);
}

function changeQuantity(index, amount) {
  if (!cart[index]) return;

  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
  showToast("Produto removido.");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}

function openWhatsApp() {
  const message =
    "Olá! Vim pela SóAchei e gostaria de saber mais sobre os produtos.";

  window.open(
    "https://wa.me/" + WHATSAPP + "?text=" +
    encodeURIComponent(message),
    "_blank"
  );
}

function checkout() {
  if (cart.length === 0) {
    showToast("Seu carrinho está vazio.");
    return;
  }

  const lines = cart.map(p =>
    `- ${p.name} | ${p.quantity} x ${money(p.price)} = ${money(p.price * p.quantity)}`
  );

  const total = cart.reduce(
    (sum, p) => sum + p.price * p.quantity, 0
  );

  const message = [
    "Olá! Quero fazer este pedido na SóAchei:",
    "",
    ...lines,
    "",
    "Total dos produtos: " + money(total),
    "Gostaria de confirmar o frete e o prazo de entrega."
  ].join("\n");

  window.open(
    "https://wa.me/" + WHATSAPP + "?text=" +
    encodeURIComponent(message),
    "_blank"
  );
}

const searchForm = document.getElementById("searchForm");

if (searchForm) {
  searchForm.addEventListener("submit", event => {
    event.preventDefault();

    const term = document.getElementById("search").value
      .toLowerCase().trim();

    renderProducts(products.filter(p =>
      p.name.toLowerCase().includes(term)
    ));

    scrollToProducts();
  });
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

renderProducts();
updateCart();
