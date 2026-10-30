const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load products from JSON file
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8')
);

// ---- API Routes ----

// Get all products (optional ?category= filter)
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = products.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
    return res.json(filtered);
  }
  res.json(products);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Checkout (simple mock)
app.post('/api/checkout', (req, res) => {
  const { cart } = req.body;
  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  res.json({
    message: 'Order placed successfully!',
    orderId: 'ORD-' + Date.now(),
    total: total.toFixed(2)
  });
});

app.listen(PORT, () => {
  console.log(`👕 Clothing store running at http://localhost:${PORT}`);
});
