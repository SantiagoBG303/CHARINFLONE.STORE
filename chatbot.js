// ===============================
// CHATBOX FUNCIONAL - CHARINFLONBOT
// Detecta productos directamente del DOM
// y se desplaza al producto cuando se hace clic
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const chatToggle = document.getElementById("chat-toggle");
  const chatContainer = document.getElementById("chat-container");
  const chatClose = document.getElementById("chat-close");
  const chatBody = document.getElementById("chat-body");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");

  // ✅ Chat inicia cerrado
  chatContainer.style.display = "none";

  // ---- Mostrar / Ocultar ----
  chatToggle.addEventListener("click", () => {
    chatContainer.style.display =
      chatContainer.style.display === "none" ? "flex" : "none";
  });

  chatClose.addEventListener("click", () => (chatContainer.style.display = "none"));

  // ---- Mostrar mensaje ----
  function appendMessage(sender, text, html = false) {
    const div = document.createElement("div");
    div.style.margin = "6px 0";
    div.style.padding = "6px 10px";
    div.style.borderRadius = "8px";
    div.style.maxWidth = "85%";
    div.style.wordBreak = "break-word";
    if (sender === "user") {
      div.style.background = "#e8f5e9";
      div.style.alignSelf = "flex-end";
    } else {
      div.style.background = "#f1f1f1";
      div.style.alignSelf = "flex-start";
    }
    div.innerHTML = html ? text : `<p>${text}</p>`;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // ---- Leer productos desde el DOM ----
  const productos = [];
  document.querySelectorAll(".product-card").forEach((p) => {
    productos.push({
      nombre: p.querySelector(".product-title")?.innerText?.trim() || "",
      descripcion: p.querySelector(".product-description")?.innerText?.trim() || "",
      precio: p.querySelector(".product-price")?.innerText?.trim() || "",
      imagen: p.querySelector("img")?.src || "",
      elemento: p, // guardamos el elemento real del DOM
    });
  });

  // ---- Normalizar texto ----
  function clean(t) {
    return t
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "");
  }

  // ---- Buscar productos ----
  function buscarProducto(query) {
    query = clean(query);

    const sinonimos = {
      carro: ["auto", "vehiculo", "automovil"],
      audifono: ["auricular", "headphone", "earbud"],
      reloj: ["smartwatch", "hora"],
      parlante: ["bafle", "bocina", "altavoz"],
      camara: ["seguridad", "vigilancia"],
      masajeador: ["pistola", "masaje"],
      dron: ["drone"],
    };

    for (let key in sinonimos) {
      sinonimos[key].forEach((alt) => {
        if (query.includes(alt)) query = key;
      });
    }

    return productos.filter(
      (p) =>
        clean(p.nombre).includes(query) ||
        clean(p.descripcion).includes(query)
    );
  }

  // ---- Respuesta del bot ----
  function responder(msg) {
    const encontrados = buscarProducto(msg);
    if (encontrados.length > 0) {
      let html = `<p>🔎 Encontré ${encontrados.length} producto${
        encontrados.length > 1 ? "s" : ""
      } que coinciden:</p>`;

      encontrados.slice(0, 4).forEach((p, i) => {
        html += `
        <div class="chat-product" data-product-index="${i}" 
          style="display:flex;align-items:center;gap:8px;margin:8px 0;
          background:#fff;border:1px solid #ccc;border-radius:8px;padding:5px;
          cursor:pointer;transition:transform 0.2s ease;">
          <img src="${p.imagen}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">
          <div style="font-size:13px;">
            <b>${p.nombre}</b><br>
            <span>$${p.precio}</span>
          </div>
        </div>`;
      });

      appendMessage("bot", html, true);

      // === Agregar eventos a los productos del chat ===
      setTimeout(() => {
        chatBody.querySelectorAll(".chat-product").forEach((div) => {
          div.addEventListener("click", () => {
            const index = parseInt(div.getAttribute("data-product-index"));
            const producto = encontrados[index];
            if (producto && producto.elemento) {
              chatContainer.style.display = "none"; // cerrar el chat
              producto.elemento.scrollIntoView({ behavior: "smooth", block: "center" });
              producto.elemento.style.transition = "outline 0.3s ease";
              producto.elemento.style.outline = "3px solid #28a745";
              setTimeout(() => (producto.elemento.style.outline = "none"), 2000);
            }
          });
        });
      }, 100);
    } else {
      appendMessage(
        "bot",
        `😕 No encontré productos con "<b>${msg}</b>". Prueba con palabras como: 
        <b>carro</b>, <b>dron</b>, <b>reloj</b>, <b>audífonos</b>, <b>parlante</b> o <b>cámara</b>.`,
        true
      );
    }
  }

  // ---- Enviar mensaje ----
  function enviar() {
    const texto = chatInput.value.trim();
    if (!texto) return;
    appendMessage("user", texto);
    chatInput.value = "";
    setTimeout(() => responder(texto), 600);
  }

  chatSend.addEventListener("click", enviar);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviar();
  });

  // ---- Bienvenida ----
  appendMessage(
    "bot",
    "👋 ¡Hola! Soy <b>CharinflonBot</b>. Escríbeme lo que buscas, por ejemplo:<br>🕹️ <b>Muéstrame audífonos</b><br>⌚ <b>Quiero un reloj</b><br>🚗 <b>Busco carro</b>",
    true
  );
});