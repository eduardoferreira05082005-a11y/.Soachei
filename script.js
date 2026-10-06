const products = [
  {
    name: "Mini Aspirador Portátil",
    price: 39.90,
    category: "Mais vendidos",
    emoji: "🧹"
  },
  {
    name: "Suporte Magnético para Celular",
    price: 29.90,
    category: "Celular",
    emoji: "📱"
  },
  {
    name: "Luminária LED Criativa",
    price: 49.90,
    category: "Casa",
    emoji: "💡"
  },
  {
    name: "Acessório Gamer",
    price: 59.90,
    category: "Games",
    emoji: "🎮"
  },
  {
    name: "Organizador Multiuso",
    price: 34.90,
    category: "Ofertas",
    emoji: "📦"
  },
  {
    name: "Produto Surpresa SóAchei",
    price: 44.90,
    category: "Lançamentos",
    emoji: "🎁"
  }
];

let cart = [];

const productsBox = document.getElementById("products");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

function money(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function renderProducts(list = products) {
  productsBox.innerHTML = "";

  list.forEach((product, index) => {
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
      </div>
    `;

    productsBox.appendChild(card);
  });
}

function filterProducts(category) {
  if (category === "Todos") {
    renderProducts(products);
    return;
  }

  const filtered = products.filter(product =>
    product.category === category
  );

  renderProducts(filtered);
  scrollToProducts();
}

function scrollToProducts() {
  document.getElementById("produtos").scrollIntoView({
    behavior: "smooth"
  });
}

function addToCart(index) {
  cart.push(products[index]);
  updateCart();

  showToast("Produto adicionado ao carrinho!");
}

function updateCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Seu carrinho está vazio.</p>";
  }

  cart.forEach((product, index) => {
    const item = document.createElement("div");

    item.style.padding = "15px 0";
    item.style.borderBottom = "1px solid #ddd";

    item.innerHTML = `
      <b>${product.emoji} ${product.name}</b>
      <div>${money(product.price)}</div>
      <button onclick="removeFromCart(${index})">
        Remover
      </button>
    `;

    cartItems.appendChild(item);
  });

  cartCount.textContent = cart.length;

  const total = cart.reduce((sum, product) =>
    sum + product.price, 0
  );

  cartTotal.textContent = money(total);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}

function openWhatsApp() {
  const phone = "5500000000000";

  const message =
    "Olá! Vim pela SóAchei e gostaria de saber mais sobre os produtos.";

  window.open(
    "https://wa.me/" + phone + "?text=" +
    encodeURIComponent(message),
    "_blank"
  );
}

function checkout() {
  if (cart.length === 0) {
    showToast("Seu carrinho está vazio.");
    return;
  }

  let message = "Olá! Quero fazer este pedido na SóAchei:%0A%0A";

  cart.forEach(product => {
    message +=
      "- " + product.name +
      " — " + money(product.price) +
      "%0A";
  });

  const total = cart.reduce((sum, product) =>
    sum + product.price, 0
  );

  message += "%0ATotal: " + money(total);

  const phone = "5500000000000";

  window.open(
    "https://wa.me/" + phone + "?text=" + message,
    "_blank"
  );
}

document.getElementById("searchForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const term = document
      .getElementById("search")
      .value
      .toLowerCase();

    const result = products.filter(product =>
      product.name.toLowerCase().includes(term)
    );

    renderProducts(result);
    scrollToProducts();
  }
);

document.getElementById("year").textContent =
  new Date().getFullYear();

renderProducts();
updateCart();