// product-info.js
document.addEventListener("DOMContentLoaded", () => {
  // ====== VARIABLES PRINCIPALES ======
  const productContainer = document.getElementById("product"); //productContainer referencia al contenedor donde se inyecta todo el HTML del producto.
  const interesContainer = document.getElementById("interes");  //interesContainer contenedor donde se renderizan los productos relacionados.
  const localStorageProduct = localStorage.getItem("producto"); //localStorageProduct recupera el id del producto guardado en localStorage (asi sabes que producto mostrar).

  // ENTREGA 4 ÇOMENTARIOS DEL REPO
  //COMMENTS_BASE: URL base para buscar los JSON de comentarios en el repo de ejemplo 
  // (no incluye el archivo, se completar con {id}.json).
  const COMMENTS_BASE = "https://japceibal.github.io/emercado-api/products_comments"; 

  // ====== CARGAR PRODUCTO PRINCIPAL ======
  function loadProduct(productId) {
    fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`) //el fetch solicita el json del producto por id
      .then(resp => {
        if (!resp.ok) { //si el servidor devuelve un status distinto de 2xx, hace un mensaje de error en la UI y lanza un error para evitar seguir
          productContainer.innerHTML = `
            <div class="d-flex justify-content-center align-items-center">
              <h1>Error al cargar los datos</h1>
            </div>`;
          throw new Error("Producto no encontrado");
        }
        return resp.json(); //parsea el cuerpo como json
      })
      .then(productData => { //cuando llega el json hace:
        renderProduct(productData); //arma y coloca el html principal del producto
        setupCarousel(); //inicializa el carrusel visual de las imagenes 
        setupImageSwitch();//es el click de las imagenes secundarias
        loadRelatedProducts(productData); //carga todo lo relacionado
        //entrega4
        loadComments(productData);// inicia la carga de comentarios pasando todo el objeto productData (no sólo el id) para poder inferir categoria si es necesario
      }) //productData (no solo el id) para poder inferir categoria si es necesario.
      .catch(err => {
        console.error("loadProduct:", err); //captura errores de red o de parsing y los muestra en consola
      });
  }

  // ====== RENDER DEL PRODUCTO (incluye *placeholder* para calificaciones) ======
  function renderProduct(data) {
    const imgs = data.images || [];//toma la lista de imags del producto o un array vacio si no hay
    //productContainer.innerHTML = inserta una gran plantilla html, osea, el carrusel movil, vista esritorio, precio, descripcion
    //los ${escapeHtml(data.name)} son para prevenir que se inyecte texto
      //se incluyo una seccion varia para las clasificaciones, que seria el placeholder en <section id="ratings-section">, linea 110
      //esta seccion esta vacia para que 'loeadcomments' se se incerte los comentarios de las clasificaciones
    productContainer.innerHTML = ` 
      <div class="container product-section p-1">
        <!-- Mobile carousel -->
        <div id="carouselExampleIndicators" class="carousel slide d-block d-md-none" data-bs-ride="carousel">
          <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
            <span class="category-badge">${escapeHtml(data.category)}</span>
            <div class="d-flex align-items-end mb-1">
              <h3 class="mt-2 fw-bold">${escapeHtml(data.name)}</h3>
              <small class="text-muted ms-2">${data.soldCount} vendidos</small>
            </div>
            <div class="carousel-inner">
              ${imgs.map((img, idx) => `
                <div class="carousel-item ${idx === 0 ? 'active' : ''} main-image">
                  <img src="${img}" class="d-block w-100" alt="...">
                </div>`).join('')}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
              <span class="visually-hidden">Anterior</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
              <span class="visually-hidden">Siguiente</span>
            </button>
          </div>

          <div class="custom-indicators text-center mt-3">
            ${imgs.map((_, idx) => `<button type="button" data-bs-target="#carouselExample" data-bs-slide-to="${idx}" class="${idx === 0 ? 'active' : ''}"></button>`).join('')}
          </div>

          <div class="col-md-4">
            <div class="d-flex justify-content-between align-items-baseline">
              <p class="price">${escapeHtml(data.currency)} ${escapeHtml(String(data.cost))}</p>
              <button class="btn btn-cart ms-4"><i class="bi bi-cart-plus"></i> Agregar al carrito</button>
            </div>
            <p class="mt-2">${escapeHtml(data.description)}</p>
          </div>
        </div>

        <!-- desktop -->
        <div class="row d-none d-md-flex">
          <div class="col-md-2 secundary-images">
            <img src="${imgs[1] || imgs[0] || ''}" alt="">
            <img src="${imgs[2] || imgs[0] || ''}" alt="">
            <img src="${imgs[3] || imgs[0] || ''}" alt="" id="last-image">
          </div>

          <div class="col-md-6 main-image">
            <img src="${imgs[0] || ''}" alt="">
          </div>

          <div class="col-md-4">
            <span class="category-badge">${escapeHtml(data.category)}</span>
            <div class="d-flex align-items-end">
              <h3 class="mt-2 fw-bold">${escapeHtml(data.name)}</h3>
              <small class="text-muted ms-2">${data.soldCount} vendidos</small>
            </div>
            <p class="mt-2">${escapeHtml(data.description)}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <p class="price">${escapeHtml(data.currency)} ${escapeHtml(String(data.cost))}</p>
              <button class="btn btn-cart ms-4"><i class="bi bi-cart-plus"></i> Agregar al carrito</button>
            </div>
          </div>
        </div>

        <!-- SECCION CALIFICACIONES: se rellena con JS -->
        <section id="ratings-section" class="container mt-5">
          <div class="row">
            <div class="col-md-4 text-center" id="avg-rating-container"></div>
            <div class="col-md-5" id="comments-list-container"></div>
            <div class="col-md-3" id="rate-form-container"></div>
          </div>
        </section>

      </div>
    `;
  }


  // ====== CARRUSEL Y SWITCH IMAGEN ======
  function setupCarousel() {
    const myCarousel = document.querySelector('#carouselExample'); //busca el carrusel (carouselExample) y los indicadores perosnalizados
    const myIndicators = document.querySelectorAll('.custom-indicators button');
    if (!myCarousel) return;
    myCarousel.addEventListener('slid.bs.carousel', e => { //si el carrosel existe, se añade un hanlder al evento 
    // *hanlder es una funcion u objeto que 'maneja' o responde a un evento en especifico, en este caso evento de boostrap que ocurre al terminar de desplazarse, entonce sn el hanlder:
      myIndicators.forEach(btn => btn.classList.remove('active')); //elimina la clase active de todos los indicadores y 
      if (myIndicators[e.to]) myIndicators[e.to].classList.add('active'); //pone active en los indicadores correspondientes
    });
  }
//esto es para cambiar las imagenes, hacer el ''swap'' entre una y otra
  function setupImageSwitch() { 
    const mainImage = document.querySelector(".col-md-6.main-image img");
    const secondaryImages = document.querySelectorAll(".secundary-images img");
    if (!mainImage || secondaryImages.length === 0) return;
    secondaryImages.forEach(img => {
      img.addEventListener("click", () => {
        const temp = mainImage.src;
        mainImage.src = img.src;
        img.src = temp;
      });
    });
  }

  // ====== PRODUCTOS RELACIONADOS ======
  //carga y renderiza productos relacionados
  function loadRelatedProducts(productData) {
    const categoryId = getCategoryId(productData.category); //mapea el nombre de la categoria a un categoryId numerico
    if (!categoryId) return;
    fetch(`https://japceibal.github.io/emercado-api/cats_products/${categoryId}.json`) //se hace fetch al json de la categoria para armar tarjetas HTML para cada producto
      .then(r => r.json())
      .then(data => {
        let html = "";
        for (const p of data.products) {
          if (p.id !== productData.id) {
            html += `
              <div class="col-12 col-sm-6 col-md-3 mb-4">
                <div class="product-card" id="product-${p.id}" style="cursor:pointer;">
                  <img src="${p.image}" alt="Producto" class="product-image">
                  <h5 class="fw-bold">${escapeHtml(p.name)}</h5>
                  <p class="text-muted">${escapeHtml(p.description)}</p>
                  <p class="price">${escapeHtml(p.currency)} ${escapeHtml(String(p.cost))}</p>
                  <p class="sold">${p.soldCount} vendidos</p>
                </div>
              </div>`;
          }
        }
        interesContainer.innerHTML = html || `<p class="text-muted">Error en la carga de productos.</p>`; 

        // asignar clicks
        data.products.forEach(p => {
          const prodEl = document.getElementById(`product-${p.id}`);
          if (prodEl) prodEl.addEventListener("click", () => { //añade listaners para cada tarjeta que guarda el ID en el localStorage y redirigen a product-info-html, asi al abrir
            localStorage.setItem("producto", p.id);//la nueva pagina se mostratra ese producto
            window.location.href = "product-info.html";
          });
        });
      })
      .catch(err => console.error("Error cargando relacionados:", err));
  }

  function getCategoryId(name) { //devuelve el categoryId usado por la api de ejemplo a partir del nombre de la categoria
    switch (name) {
      case "Autos": return 101;
      case "Juguetes": return 102;
      case "Muebles": return 103;
      case "Herramientas": return 104;
      case "Computadoras": return 105;
      case "Vestimenta": return 106;
      case "Electrodomésticos": return 107;
      case "Deporte": return 108;
      case "Celulares": return 109;
      default: return null; //si no lo encuentra devuelve null
    }
  }

  // ====== SECCIÓN COMENTARIOS / ENTREGA 4 ======
  async function loadComments(productData) {
    const commentsContainer = document.getElementById("comments-list-container");
    const avgContainer = document.getElementById("avg-rating-container");
    const formContainer = document.getElementById("rate-form-container");

    showSpinner(true);

    // crear lista candidatos
    const candidates = [];
    if (productData?.id != null) candidates.push(`${COMMENTS_BASE}/${encodeURIComponent(productData.id)}.json`);
    const catId = getCategoryId(productData?.category);
    if (catId) candidates.push(`${COMMENTS_BASE}/${encodeURIComponent(catId)}_${encodeURIComponent(productData.id)}.json`);

    // intentar inferir indice consultando cats_products/{catId}.json
    if (catId) {
      try {
        const catsUrl = `https://japceibal.github.io/emercado-api/cats_products/${catId}.json`;
        const catsResp = await fetch(catsUrl);
        if (catsResp.ok) {
          const catsData = await catsResp.json();
          if (Array.isArray(catsData.products)) {
            const idx = catsData.products.findIndex(p => Number(p.id) === Number(productData.id));
            if (idx >= 0) {
              // muchos ejemplos en este repo usan index 1-based: {cat}_{index}
              const candidateIdx = `${COMMENTS_BASE}/${catId}_${idx + 1}.json`;
              // priorizarlo (al frente)
              candidates.unshift(candidateIdx);
            }
          }
        }
      } catch (e) {
        console.warn("No se pudo inferir índice en cats_products:", e);
      }
    }

    // eliminar duplicados y probar secuencialmente
    const uniqCandidates = [...new Set(candidates)];
    console.log("[comments] candidatos:", uniqCandidates);

    const tryCandidates = async list => {
      for (const url of list) {
        try {
          console.log("[comments] probando:", url);
          const resp = await fetch(url);
          console.log("[comments] status", resp.status, "=>", url);
          if (!resp.ok) continue;
          const data = await resp.json();
          return { url, data };
        } catch (e) {
          console.warn("[comments] error probando", url, e);
          continue;
        }
      }
      return null;
    };

    try {
      const result = await tryCandidates(uniqCandidates);
      if (!result) {
      commentsContainer.innerHTML = `<p class="text-muted">No se encontraron comentarios...</p>`;
      renderAverageSection(avgContainer, []);
      } else {
      }

      // normalizar data (buscar array)
      let comments = [];
      const data = result.data;
      if (Array.isArray(data)) comments = data;
      else if (Array.isArray(data.comments)) comments = data.comments;
      else if (Array.isArray(data.results)) comments = data.results;
      else if (Array.isArray(data.data)) comments = data.data;
      else {
        for (const k in data) {
          if (Array.isArray(data[k]) && data[k].length > 0 && typeof data[k][0] === "object") {
            comments = data[k];
            break;
          }
        }
      }

      if (!comments || comments.length === 0) {
        commentsContainer.innerHTML = `
          <p class="text-muted">Sin comentarios.</p>

        `;
        renderAverageSection(avgContainer, []);
        renderRatingForm(formContainer, [], () => {}, productData.id, COMMENTS_BASE);
        return;
      }

      // RENDERIZAR
      renderAverageSection(avgContainer, comments);
      renderCommentsList(commentsContainer, comments);
      renderRatingForm(formContainer, comments, newComment => {
        comments.unshift(newComment);
        renderAverageSection(avgContainer, comments);
        renderCommentsList(commentsContainer, comments);
      }, productData.id, COMMENTS_BASE);

    } catch (err) {
      console.error("loadComments error:", err);
      commentsContainer.innerHTML = `<p class="text-danger">No se pudieron cargar las opiniones. Revisa la consola y la pestaña Network.</p>`;
      renderAverageSection(avgContainer, []);
      renderRatingForm(formContainer, [], () => {}, productData.id, COMMENTS_BASE);
    } finally {
      showSpinner(false);
    }
  }

  // ====== RENDER PROMEDIO Y LISTA ======
  function renderAverageSection(container, comments) {
    if (!container) return;
    const count = comments.length || 0;
    const average = calculateAverage(comments);
    container.innerHTML = `
      <h5>Opiniones del producto</h5>
      <div class="avg-big my-3">
        <div style="font-size:48px;font-weight:700;">${average.toFixed(1)}</div>
        <div class="d-flex justify-content-center align-items-center mt-2">
          ${renderStars(Math.round(average))}
          <span class="ms-2 text-muted">${count} calificaciones</span>
        </div>
      </div>
    `;
  }

  // cuidado aritmético (digit-by-digit)
  function calculateAverage(comments) {
    if (!Array.isArray(comments) || comments.length === 0) return 0;
    let sum = 0;
    let n = 0;
    for (const c of comments) {
      const raw = c.score ?? c.rating ?? c.puntuacion ?? c.scoreValue ?? c.score_value ?? 0;
      const num = Number(raw);
      if (Number.isFinite(num)) {
        sum += num;
        n++;
      }
    }
    if (n === 0) return 0;
    return Math.round((sum / n) * 10) / 10; // 1 decimal
  }

  function renderStars(score) {
    let html = `<div class="stars" aria-hidden="true">`;
    for (let i = 1; i <= 5; i++) {
      html += i <= score ? '<i class="bi bi-star-fill" style="font-size:18px;margin-right:4px;color:#f7941d;"></i>'
                         : '<i class="bi bi-star" style="font-size:18px;margin-right:4px;color:#f7941d;"></i>';
    }
    html += `</div>`;
    return html;
  }

  function renderCommentsList(container, comments) {
    if (!container) return;
    // ordenar por fecha descendente si existe
    const normalized = (comments || []).slice().sort((a, b) => {
      const da = new Date(a.dateTime ?? a.date ?? a.fecha ?? 0).getTime();
      const db = new Date(b.dateTime ?? b.date ?? b.fecha ?? 0).getTime();
      return db - da;
    });

    if (normalized.length === 0) {
      container.innerHTML = `<p class="text-muted">Aún no hay opiniones. Sé el primero :)</p>`;
      return;
    }

    const listHtml = normalized.map(c => {
      const user = escapeHtml(c.user ?? c.username ?? c.name ?? "Anónimo");
      const score = Math.round(Number(c.score ?? c.rating ?? c.puntuacion ?? 0));
      const text = escapeHtml(c.description ?? c.comment ?? c.opinion ?? "");
      const dateRaw = c.dateTime ?? c.date ?? c.fecha ?? "";
      const dateFormatted = formatDate(dateRaw);
      return `
        <div class="comment-item mb-4">
          <div class="d-flex justify-content-between">
            <div><strong>${user}</strong></div>
            <div class="small text-muted">${dateFormatted}</div>
          </div>
          <div class="my-1">${renderStars(score)}</div>
          <div class="text-muted">${text}</div>
        </div>
      `;
    }).join("");

    container.innerHTML = `<h6>Opiniones destacadas</h6>${listHtml}`;
  }

  // ====== FORMULARIO PARA AÑADIR CALIFICACIÓN ======
  function renderRatingForm(container, currentComments, onLocalAdd, productId, baseUrl) {
    if (!container) return;
    container.innerHTML = `
      <h6>Calificar producto</h6>
      <div id="star-input" class="mb-2">${[1,2,3,4,5].map(i => `<i class="bi bi-star star-input" data-value="${i}" style="cursor:pointer;font-size:20px;margin-right:6px;"></i>`).join("")}</div>
      <textarea id="opinion-text" class="form-control mb-2" rows="3" placeholder="Escribe tu opinión..."></textarea>
      <button id="submit-opinion" class="btn btn-warning btn-block">Calificar</button>
      <div id="form-msg" class="small text-success mt-2" style="display:none;"></div>
    `;

    let selected = 0;
    const stars = container.querySelectorAll(".star-input");
    stars.forEach(s => {
      s.addEventListener("click", () => {
        selected = Number(s.dataset.value);
        highlightStars(selected, stars);
      });
      s.addEventListener("mouseenter", () => highlightStars(Number(s.dataset.value), stars));
      s.addEventListener("mouseleave", () => highlightStars(selected, stars));
    });

    container.querySelector("#submit-opinion").addEventListener("click", async () => {
      const text = container.querySelector("#opinion-text").value.trim();
      if (selected <= 0) {
        showFormMessage(container, "Selecciona una calificación (1-5).", true);
        return;
      }

      const newComment = {
        user: "Usuario (web)",
        score: selected,
        description: text,
        dateTime: new Date().toISOString(),
        productId
      };

      try {
        // sugerencia de chatgpt, averiguar para que sirve  y como implementarlo con el post cuando lo entienda y lo tenga
        //  ===== OPCIONAL: enviar al servidor con POST (si el endpoint lo admite)
        // Si habilitas POST, revisa CORS y la URL del endpoint.
        /*
        const postUrl = baseUrl.split("?")[0]; // ejemplo
        const resp = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newComment)
        });
        if (!resp.ok) throw new Error("No se pudo enviar la opinión");
        const saved = await resp.json();
        onLocalAdd(saved);
        */

        // por defecto: añadir localmente para que el usuario vea su opinión inmediatamente
        onLocalAdd(newComment);
        showFormMessage(container, "Gracias por tu opinión.", false);
        container.querySelector("#opinion-text").value = "";
        selected = 0;
        highlightStars(selected, stars);
      } catch (err) {
        console.error("Error al enviar opinion:", err);
        showFormMessage(container, "Error al enviar. Intenta más tarde.", true);
      }
    });
  }

  function highlightStars(n, starNodes) {
    starNodes.forEach(node => {
      const v = Number(node.dataset.value);
      node.className = v <= n ? "bi bi-star-fill star-input" : "bi bi-star star-input";
    });
  }

  function showFormMessage(container, text, isError = false) {
    const el = container.querySelector("#form-msg");
    if (!el) return;
    el.style.display = "block";
    el.textContent = text;
    el.className = isError ? "small text-danger mt-2" : "small text-success mt-2";
  }

  // ====== UTILIDADES ======
  function formatDate(dateRaw) {
    if (!dateRaw) return "";
    const d = new Date(dateRaw);
    if (isNaN(d)) return dateRaw;
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  }

  function escapeHtml(text) {
    if (text == null) return "";
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function showSpinner(show) {
    const spinner = document.getElementById("spinner-wrapper");
    if (!spinner) return;
    spinner.style.display = show ? "block" : "none";
  }

  // ====== INICIALIZAR ======
  if (localStorageProduct) {
    loadProduct(localStorageProduct);
  } else {
    productContainer.innerHTML = `
      <div class="d-flex justify-content-center align-items-center">
        <h1>No hay producto seleccionado</h1>
      </div>`;
  }
});

