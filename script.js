/**
 * LOLITA'S BOUTIQUE - THE COMPLETE MASTER ENGINE
 */

const API_BASE = "https://lolitas-api.onrender.com"; // Adjust to match your node server port if different

// --- 1. GLOBAL UI UPDATES ---
function updateCartCount() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const cart = JSON.parse(localStorage.getItem("lolitasCart")) || [];
  // Displays total quantity in the Bag ( ) header
  badge.innerText = cart.reduce(
    (sum, item) => sum + parseInt(item.quantity),
    0,
  );
}

// --- 2. SHOP PAGE PRODUCT LOADING ---
async function loadShop() {
  const gallery = document.getElementById("gallery-container");
  if (!gallery) return;

  try {
    const res = await fetch(`${API_BASE}/api/products`);
    const products = await res.json();

    gallery.innerHTML = products
      .map((p) => {
        const productData = JSON.stringify(p).replace(/'/g, "&apos;");
        return `
                <div class="product-card">
                    <img src="${p.img}" alt="${p.name}">
                    <h4>${p.name}</h4>
                    <p>$${parseFloat(p.price).toFixed(2)}</p>
                    <button class="add-btn" onclick='initiateAddToBag(${productData})'>
                        Add to Bag
                    </button>
                </div>`;
      })
      .join("");
  } catch (e) {
    console.error(
      "Backend unreachable. Ensure your node server.js is running.",
    );
  }
}

// --- 3. ADDING & QUANTITY PROMPT ---
window.initiateAddToBag = function (product) {
  let qty = prompt(`How many "${product.name}" would you like to add?`, "1");
  if (qty === null || qty === "" || isNaN(qty) || parseInt(qty) < 1) return;

  qty = parseInt(qty);
  let cart = JSON.parse(localStorage.getItem("lolitasCart")) || [];
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...product, quantity: qty });
  }

  localStorage.setItem("lolitasCart", JSON.stringify(cart));
  alert(`Success! ${qty}x ${product.name} added to your bag.`);
  updateCartCount();
};

// --- 4. CHECKOUT MANAGEMENT & REMOVAL ---
function loadCheckout() {
  const summary = document.getElementById("summary-items");
  const totalDisplay = document.getElementById("total-amount");
  if (!summary) return;

  const cart = JSON.parse(localStorage.getItem("lolitasCart")) || [];
  let grandTotal = 0;

  if (cart.length === 0) {
    summary.innerHTML = "<p>Your bag is empty.</p>";
    totalDisplay.innerText = "$0.00";
    return;
  }

  summary.innerHTML = cart
    .map((item, index) => {
      const itemTotal = item.price * item.quantity;
      grandTotal += itemTotal;
      return `
            <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <div>
                    <strong>${item.name}</strong> (x${item.quantity})<br>
                    <span>$${itemTotal.toFixed(2)}</span>
                </div>
                <button onclick="removeFromCart(${index})" style="color:red; cursor:pointer; background:none; border:none;">Remove</button>
            </div>`;
    })
    .join("");

  totalDisplay.innerText = `$${grandTotal.toFixed(2)}`;
}

window.removeFromCart = function (index) {
  let cart = JSON.parse(localStorage.getItem("lolitasCart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("lolitasCart", JSON.stringify(cart));
  loadCheckout();
  updateCartCount();
};

// --- 5. INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadShop();
  loadCheckout();
});
