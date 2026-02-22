// ===============================
// 🔥 VARIABLES GLOBALES
// ===============================

let cart = [];
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// ===============================
// 🔥 ABRIR CARRITO
// ===============================

document.getElementById('open-cart').addEventListener('click', () => {
  cartSidebar.classList.add('open');
  overlay.classList.add('active');
});

// ===============================
// 🔥 CERRAR CARRITO
// ===============================

document.getElementById('close-cart')?.addEventListener('click', closeCart);
overlay?.addEventListener('click', closeCart);

function closeCart() {
  cartSidebar.classList.remove('open');
  overlay.classList.remove('active');
}

// ===============================
// 🔥 BOTÓN VOLVER AUTOMÁTICO
// ===============================

const volverBtn = document.createElement("button");
volverBtn.innerText = "← Volver";
volverBtn.style.position = "absolute";
volverBtn.style.top = "20px";
volverBtn.style.left = "20px";
volverBtn.style.padding = "8px 14px";
volverBtn.style.borderRadius = "12px";
volverBtn.style.border = "2px solid #a855f7";
volverBtn.style.background = "transparent";
volverBtn.style.color = "white";
volverBtn.style.fontWeight = "bold";
volverBtn.style.cursor = "pointer";
volverBtn.style.zIndex = "10000";

volverBtn.addEventListener("click", closeCart);
cartSidebar.appendChild(volverBtn);

// ===============================
// 🔥 FINALIZAR COMPRA
// ===============================

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Tu carrito está vacío. Agrega algunos productos primero.');
    return;
  }

  alert('¡Gracias por tu compra! Serás redirigido para completar el pago.');
  cart = [];
  updateCart();
  closeCart();
});

// ===============================
// 🔥 AGREGAR PRODUCTOS (FIX MÓVIL)
// ===============================

document.querySelectorAll('.add-to-cart').forEach(button => {

  function handleAdd(e) {
    e.preventDefault();

    const productCard = e.currentTarget.closest('.product-card');
    if (!productCard) return;

    const productId = productCard.dataset.id;
    const productName = productCard.dataset.name;
    const productPrice = parseInt(productCard.dataset.price);
    const productImage = productCard.querySelector('img').src;

    addToCart(productId, productName, productPrice, productImage);
  }

  button.addEventListener('click', handleAdd);
  button.addEventListener('touchstart', handleAdd);
});

// ===============================
// 🔥 FUNCIÓN AGREGAR AL CARRITO
// ===============================

function addToCart(id, name, price, image) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }

  updateCart();
  showToast('Producto agregado al carrito');
}

// ===============================
// 🔥 TOAST SIMPLE
// ===============================

function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "100px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#333";
  toast.style.color = "white";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "6px";
  toast.style.zIndex = "10000";
  toast.style.opacity = "1";
  toast.style.transition = "opacity 0.3s";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ===============================
// 🔥 ACTUALIZAR CARRITO
// ===============================

function updateCart() {

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;

  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    cartTotal.textContent = 'Total: $0.00';
    return;
  }

  let total = 0;

  cart.forEach(item => {

    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';

    cartItemElement.innerHTML = `
      <img src="${item.image}" class="cart-item-image">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toLocaleString()}</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn minus" data-id="${item.id}">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
          <button class="quantity-btn plus" data-id="${item.id}">+</button>
          <button class="remove-item" data-id="${item.id}">🗑</button>
        </div>
      </div>
    `;

    cartItems.appendChild(cartItemElement);
  });

  cartTotal.textContent = `Total: $${total.toLocaleString()}`;

  // Eventos cantidad +
  document.querySelectorAll('.quantity-btn.plus').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const item = cart.find(item => item.id === id);
      item.quantity += 1;
      updateCart();
    });
  });

  // Eventos cantidad -
  document.querySelectorAll('.quantity-btn.minus').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const item = cart.find(item => item.id === id);
      if (item.quantity > 1) {
        item.quantity -= 1;
        updateCart();
      }
    });
  });

  // Eliminar producto
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      cart = cart.filter(item => item.id !== id);
      updateCart();
    });
  });

  // Cambio manual input
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const item = cart.find(item => item.id === id);
      const newQuantity = parseInt(e.target.value);

      if (newQuantity > 0) {
        item.quantity = newQuantity;
        updateCart();
      } else {
        e.target.value = item.quantity;
      }
    });
  });
}

// ===============================
// 🔥 INICIALIZAR
// ===============================

updateCart();