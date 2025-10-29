    // Variables globales
    let cart = [];
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Abrir carrito
    document.getElementById('open-cart').addEventListener('click', () => {
      cartSidebar.classList.add('open');
      overlay.classList.add('active');
    });
    
    // Cerrar carrito
    document.getElementById('close-cart').addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
    
    function closeCart() {
      cartSidebar.classList.remove('open');
      overlay.classList.remove('active');
    }
    
    // Finalizar compra
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
    
    // Agregar productos al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseInt(productCard.dataset.price);
        const productImage = productCard.querySelector('img').src;
        
        addToCart(productId, productName, productPrice, productImage);
      });
    });
    
    // Función para agregar producto al carrito
    function addToCart(id, name, price, image) {
      const existingItem = cart.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id,
          name,
          price,
          image,
          quantity: 1
        });
      }
      
      updateCart();
      
      // Mostrar mensaje de confirmación
      const Toast = {
        init() {
          this.hideTimeout = null;
          
          this.el = document.createElement('div');
          this.el.className = 'toast';
          this.el.style = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
          `;
          document.body.appendChild(this.el);
        },
        
        show(message) {
          clearTimeout(this.hideTimeout);
          
          this.el.textContent = message;
          this.el.style.opacity = '1';
          
          this.hideTimeout = setTimeout(() => {
            this.el.style.opacity = '0';
          }, 2000);
        }
      };
      
      Toast.init();
      Toast.show('Producto agregado al carrito');
    }
    
    // Actualizar carrito
    function updateCart() {
      // Actualizar contador
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      cartCount.textContent = totalItems;
      
      // Actualizar items del carrito
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
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toLocaleString()}</div>
            <div class="cart-item-quantity">
              <button class="quantity-btn minus" data-id="${item.id}">-</button>
              <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
              <button class="quantity-btn plus" data-id="${item.id}">+</button>
              <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `;
        
        cartItems.appendChild(cartItemElement);
      });
      
      // Actualizar total
      cartTotal.textContent = `Total: $${total.toLocaleString()}`;
      
      // Agregar event listeners a los botones de cantidad
      document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          const item = cart.find(item => item.id === id);
          item.quantity += 1;
          updateCart();
        });
      });
      
      document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          const item = cart.find(item => item.id === id);
          if (item.quantity > 1) {
            item.quantity -= 1;
            updateCart();
          }
        });
      });
      
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = e.target.closest('.remove-item').dataset.id;
          cart = cart.filter(item => item.id !== id);
          updateCart();
        });
      });
      
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
    
    // Barra de navegación con desplazamiento suave
    document.querySelectorAll("nav a").forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          // Actualizar clase activa
          document.querySelectorAll("nav a").forEach(a => a.classList.remove("active"));
          this.classList.add("active");
          
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // Función de búsqueda mejorada
    function buscar() {
      const texto = document.getElementById("busqueda").value.toLowerCase().trim();
      if (!texto) return;

      // Limpiar resaltados anteriores
      const marcas = document.querySelectorAll(".resaltado");
      marcas.forEach(m => {
        const parent = m.parentNode;
        parent.replaceChild(document.createTextNode(m.textContent), m);
        parent.normalize();
      });

      let encontrado = false;
      const elementos = document.querySelectorAll(".product-title, .product-effect, .product-description, .product-ingredients li");

      elementos.forEach(el => {
        const contenido = el.textContent.toLowerCase();
        const index = contenido.indexOf(texto);
        if (index !== -1) {
          // Resaltar y hacer scroll si es el primero
          const original = el.innerHTML;
          const regex = new RegExp(`(${texto})`, "gi");
          el.innerHTML = original.replace(regex, '<span class="resaltado">$1</span>');
          
          if (!encontrado) {
            el.closest('.product-card').scrollIntoView({ behavior: "smooth", block: "center" });
            encontrado = true;
          }
        }
      });

      if (!encontrado) {
        alert("No se encontró el término \"" + texto + "\" en la página.");
      }
    }

    // Actualizar navegación al hacer scroll
    window.addEventListener('scroll', function() {
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('nav a');
      
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 200)) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
          link.classList.add('active');
        }
      });
    });
    
    // Inicializar carrito
    updateCart();