(() => {

  const DEFAULT_CAT_ID = "101";
  const DEFAULT_PRODUCT_INDEX = 0;
  let catID = localStorage.getItem("catID") || DEFAULT_CAT_ID;
  let productID = localStorage.getItem("productID") || null;
  const mainImageSaved = localStorage.getItem("productImg");

  const COMMENTS_PER_PAGE = 5;
  let currentCommentsPage = 1;
  let allComments = [];
  let currentSort = "fecha";

  function getCategoryUrl(catID) {
    return `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;
  }

  function showProductInfo(product) {
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-category").textContent = product.category;
    document.getElementById("product-soldCount").textContent = product.soldCount;
    document.getElementById("product-price").textContent = `${product.currency} ${product.cost}`;
  }

  function renderGallery(images) {
    const gallery = document.getElementById("gallery");
    if (!images || images.length === 0) {
      gallery.innerHTML = "<p>No hay imágenes disponibles</p>";
      return;
    }

    if (mainImageSaved && images.includes(mainImageSaved)) {
      images = [mainImageSaved, ...images.filter(img => img !== mainImageSaved)];
    }

    gallery.innerHTML = `
      <img src="${images[0]}" class="img-fluid mb-2 main-img" alt="Imagen principal" id="main-image">
      <div id="thumbnails">
        ${images.map((img, i) => `<img src="${img}" class="thumbnail" data-index="${i}">`).join('')}
      </div>
    `;

    gallery.querySelectorAll(".thumbnail").forEach(thumb => {
      thumb.addEventListener("click", () => {
        gallery.querySelector("#main-image").src = thumb.src;
        gallery.querySelectorAll(".thumbnail").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });

    const firstThumb = gallery.querySelector(".thumbnail");
    if (firstThumb) firstThumb.classList.add("active");
  }

  function renderRelated(related) {
    const container = document.getElementById("related-list");
    container.innerHTML = "";

    if (!related || related.length === 0) {
      related = (window.currentCategoryProducts || []).filter(p => p.id != window.currentProduct.id);
    }
    if (!related || related.length === 0) {
      container.innerHTML = "<p>No hay productos relacionados</p>";
      return;
    }

    related.forEach(r => {
      const col = document.createElement("div");
      col.className = "related-item";
      col.innerHTML = `
        <div class="related-card card h-100">
          <img src="${r.image || (r.images?.[0] || 'img/no-image.png')}" class="card-img-top" alt="${r.name}">
          <div class="card-body p-2">
            <p class="card-text small text-center">${r.name}</p>
          </div>
        </div>
      `;
      col.addEventListener("click", () => {
        const block = document.getElementById("product-block");
        block.style.opacity = 0;
        setTimeout(() => {
          window.currentProduct = r;
          showProductInfo(r);
          renderGallery(r.images || [r.image]);
          renderRelated(r.relatedProducts || []);
          allComments = generateMockComments();
          currentCommentsPage = 1;
          renderCommentsPage();
          block.style.opacity = 1;
          window.scrollTo({ top: block.offsetTop - 20, behavior: 'smooth' });
        }, 300);
      });
      container.appendChild(col);
    });

    setupScrollButtons();
  }

  function setupScrollButtons() {
    const container = document.getElementById("related-list");
    const btnLeft = document.getElementById("related-left");
    const btnRight = document.getElementById("related-right");
    const scrollAmount = 220;

    btnLeft?.addEventListener("click", () => {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
    btnRight?.addEventListener("click", () => {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }

  function renderCommentsPage() {
    const container = document.getElementById("reviews-list");
    container.innerHTML = "";

    let sortedComments = [...allComments];
    if (currentSort === "fecha") {
      sortedComments.sort((a,b) => new Date(b.dateTime) - new Date(a.dateTime));
    } else if (currentSort === "puntos") {
      sortedComments.sort((a,b) => b.score - a.score);
    }

    const start = (currentCommentsPage-1)*COMMENTS_PER_PAGE;
    const end = start + COMMENTS_PER_PAGE;
    const pageComments = sortedComments.slice(start, end);

    if (!pageComments.length) {
      container.innerHTML = "<p>No hay comentarios para mostrar</p>";
      return;
    }

    pageComments.forEach(c => {
      const stars = "★".repeat(c.score) + "☆".repeat(5 - c.score);
      container.insertAdjacentHTML("beforeend", `
        <div class="border p-2 mb-2 rounded">
          <strong>${c.user}</strong> <small class="text-muted">${c.dateTime}</small>
          <p>${c.description}</p>
          <p class="star">${stars}</p>
        </div>
      `);
    });

    const totalPages = Math.ceil(sortedComments.length / COMMENTS_PER_PAGE);
    const paginationDiv = document.createElement("div");
    paginationDiv.className = "d-flex justify-content-between mt-2";
    paginationDiv.innerHTML = `
      <button id="prevComments" class="btn btn-secondary btn-sm" ${currentCommentsPage===1?'disabled':''}>Anterior</button>
      <span>Página ${currentCommentsPage} de ${totalPages}</span>
      <button id="nextComments" class="btn btn-secondary btn-sm" ${currentCommentsPage===totalPages?'disabled':''}>Siguiente</button>
    `;
    container.appendChild(paginationDiv);

    document.getElementById("prevComments").addEventListener("click", ()=>{ currentCommentsPage--; renderCommentsPage(); });
    document.getElementById("nextComments").addEventListener("click", ()=>{ currentCommentsPage++; renderCommentsPage(); });
  }

  function generateMockComments() {
    const users = ["Ana","Luis","Carla","Pedro","Marta","Diego","Sofía","Jorge","Lucía","Tomás"];
    const commentsByScore = {
      5: ["Excelente producto, superó mis expectativas.","Muy contento con la compra, lo recomiendo.","Perfecto, llegó rápido y en buen estado.","Me encantó, justo lo que buscaba.","Calidad increíble, vale totalmente el precio."],
      4: ["Buen producto, cumple lo esperado.","Estoy satisfecho, aunque podría mejorar un poco.","La compra fue buena, llegó en buen tiempo.","Funciona bien, aunque esperaba algo más.","Producto sólido y confiable."],
      3: ["Regular, cumple su función básica.","No está mal, pero esperaba algo mejor.","Aceptable, aunque podría mejorar la calidad.","Funciona, pero con algunos detalles a mejorar.","Cumple, pero no es espectacular."],
      2: ["No me gustó del todo, esperaba más.","Producto aceptable pero con fallas.","Algo decepcionante, no lo recomiendo mucho.","Llegó con detalles que no me gustaron.","Podría ser mejor."],
      1: ["Muy mala calidad, no lo recomiendo.","Decepcionante, no cumple con lo esperado.","No vale lo que pagué.","Producto defectuoso, tuve problemas.","Pésima experiencia."]
    };

    const comments = [];
    for (let i=0;i<30;i++){
      let r = Math.random();
      let score = r<0.6?5:r<0.8?4:r<0.9?3:r<0.95?2:1;
      let textArr = commentsByScore[score];
      comments.push({
        user: users[Math.floor(Math.random()*users.length)],
        dateTime: new Date(Date.now() - Math.random()*1e10).toISOString(),
        description: textArr[Math.floor(Math.random()*textArr.length)],
        score
      });
    }
    return comments;
  }

  async function loadProduct(catID, productID) {
    try {
      const resp = await fetch(getCategoryUrl(catID));
      if (!resp.ok) throw new Error("Categoría no encontrada");

      const data = await resp.json();
      const products = data.products;
      if (!products || products.length === 0) throw new Error("No hay productos en la categoría");

      let product = productID ? products.find(p => p.id == Number(productID)) : null;
      if (!product) {
        product = products[DEFAULT_PRODUCT_INDEX];
        productID = product.id;
      }

      window.currentCategoryProducts = products;
      window.currentProduct = product;

      showProductInfo(product);
      renderGallery(product.images || [product.image]);
      renderRelated(product.relatedProducts || []);

      allComments = generateMockComments();
      renderCommentsPage();

      const sortDiv = document.createElement("div");
      sortDiv.className = "mb-2";
      sortDiv.innerHTML = `
        <label for="sortComments">Ordenar comentarios:</label>
        <select id="sortComments" class="form-select form-select-sm w-auto d-inline-block ms-2">
          <option value="fecha" selected>Fecha</option>
          <option value="puntos">Puntos</option>
        </select>
      `;
      document.getElementById("reviews-list").before(sortDiv);
      document.getElementById("sortComments").addEventListener("change", e=>{
        currentSort = e.target.value;
        currentCommentsPage = 1;
        renderCommentsPage();
      });

    } catch (e) {
      console.error(e);
      document.querySelector("main").innerHTML = `
        <div class="alert alert-danger">
          No se pudo cargar el producto. <a href='categories.html'>Volver a categorías</a>
        </div>`;
    }
  }

  const reviewForm = document.getElementById("review-form");
  if (reviewForm) {
    reviewForm.addEventListener("submit", e => {
      e.preventDefault();
      const text = document.getElementById("review-text").value.trim();
      const score = parseInt(document.getElementById("review-score").value);
      if (!text || isNaN(score)) return;

      const user = localStorage.getItem("usuario") || "Anónimo";

      allComments.push({
        user,
        dateTime: new Date().toISOString(),
        description: text,
        score
      });

      currentCommentsPage = 1;
      renderCommentsPage();
      e.target.reset();
    });
  }

  document.addEventListener("DOMContentLoaded", () => loadProduct(catID, productID));

})();
