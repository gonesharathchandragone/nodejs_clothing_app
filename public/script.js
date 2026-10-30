let cart = [];
let allProducts = [];

const productsEl = document.getElementById('products');
const cartPanel = document.getElementById('cart-panel');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

async function loadProducts(category) {
  const url = category ? `/api/products?category=${category}` : '/api/products';
  const res = await fetch(url);
  const products = await res.json();
  allProducts = products;
  renderProducts(products);

  document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
  const activeBtn = [...document.querySelectorAll('.filters button')]
    .find(b => b.textContent === (category || 'All'));
  if (activeBtn) activeBtn.classList.add('active');
}

function renderProducts(products) {
  productsEl.innerHTML = products.map(p => `
    <div class="card">
      <div class="emoji">${p.image}</div>
      <div class="category">${p.category}</div>
      <h3>${p.name}</h3>
      <div class="price">$${p.price.toFixed(2)}</div>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join('');
}

function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  showToast(`${product.name} added!`);
}

function updateCart() {
  cartCount.textContent = cart.reduce((s, i) => s + i.qty, 0);
  cartItems.innerHTML = cart.map(i => `
    <div class="cart-item">
      <span>${i.image} ${i.name} × ${i.qty}</span>
      <span>$${(i.price * i.qty).toFixed(2)}</span>
    </div>
  `).join('') || '<p style="color:#888">Your cart is empty</p>';

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  cartTotal.textContent = total.toFixed(2);
}

function toggleCart() {
  cartPanel.classList.toggle('open');
}

async function checkout() {
  if (cart.length === 0) return showToast('Cart is empty!');
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart })
  });
  const data = await res.json();
  showToast(`✅ ${data.message} Total: $${data.total}`);
  cart = [];
  updateCart();
  setTimeout(toggleCart, 1200);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// Initial load
loadProducts();
updateCart();
