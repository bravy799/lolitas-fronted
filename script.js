const API_BASE = "https://lolitas-api.onrender.com";

// Dummy Items if Render is empty
const dummyData = [
  {
    id: 101,
    name: "Silk Gala Gown",
    price: 8500,
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800",
  },
  {
    id: 102,
    name: "Midnight Oud",
    price: 4500,
    category: "Perfumes",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
  },
  {
    id: 103,
    name: "Golden Aura Set",
    price: 12000,
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
  },
];

async function init() {
  let products = [];
  try {
    const res = await fetch(`${API_BASE}/products`);
    products = await res.json();
    if (!products || products.length === 0) products = dummyData;
  } catch (e) {
    products = dummyData; // Fallback to dummies if Render is sleeping
  }

  if (document.getElementById("arrivals-grid"))
    render(products.slice(0, 3), "arrivals-grid");
  if (document.getElementById("shop-grid")) render(products, "shop-grid");
}

function render(items, targetId) {
  const container = document.getElementById(targetId);
  if (!container) return;
  container.innerHTML = items
    .map(
      (p) => `
        <div class="product-card">
            <div class="img-container">
                <span class="badge">Luxury</span>
                <img src="${p.image}">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>KSh ${Number(p.price).toLocaleString()}</p>
                <button class="add-btn" onclick='addToBag(${JSON.stringify(p)})'>Add To Bag</button>
            </div>
        </div>
    `,
    )
    .join("");
}

async function filterCategory(cat) {
  let products = [];
  try {
    const res = await fetch(`${API_BASE}/products`);
    products = await res.json();
    if (!products || products.length === 0) products = dummyData;
  } catch (e) {
    products = dummyData;
  }

  const filtered =
    cat === "All" ? products : products.filter((p) => p.category === cat);
  render(filtered, "shop-grid");

  // Update active button UI
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.innerText === cat);
  });
}

function addToBag(p) {
  let cart = JSON.parse(localStorage.getItem("lolitasCart")) || [];
  const exists = cart.find((item) => item.id === p.id);
  if (exists) {
    exists.quantity = (exists.quantity || 1) + 1;
  } else {
    p.quantity = 1;
    cart.push(p);
  }

  localStorage.setItem("lolitasCart", JSON.stringify(cart));
  updateUI();
  alert(p.name + " added to bag!");
}

function updateUI() {
  const cart = JSON.parse(localStorage.getItem("lolitasCart")) || [];
  const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  document
    .querySelectorAll(".cart-count")
    .forEach((el) => (el.innerText = count));
}

window.onload = () => {
  init();
  updateUI();
};
