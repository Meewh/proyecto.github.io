document.addEventListener("DOMContentLoaded", () => {

    const productContainer = document.getElementById("product-block");
    const interesContainer = document.getElementById("interes");
    const localStorageProduct = localStorage.getItem("producto");

    const COMMENTS_PER_PAGE = 5;
    let currentCommentsPage = 1;
    let allComments = [];
    let currentSort = "fecha";

    // ===== Cargar producto =====
    function loadProduct(productId) {
        fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
            .then(resp => resp.json())
            .then(productData => {
                renderProduct(productData);
                setupCarousel();
                setupImageSwitch();
                loadRelatedProducts(productData);

                generateMockComments(productId).then(comments => {
                    allComments = comments;
                    renderCommentsPage();
                    addSortSelector();
                    setupCommentForm();
                });



                // ===== Ocultar filtro blanco =====
                const spinner = document.getElementById("spinner-wrapper");
                if (spinner) spinner.style.display = "none";
            })
            .catch(err => {
                console.error(err);
                productContainer.innerHTML = `<div class="d-flex justify-content-center align-items-center"><h1>Error al cargar los datos</h1></div>`;
                const spinner = document.getElementById("spinner-wrapper");
                if (spinner) spinner.style.display = "none";
            });
    }

    // ===== Render producto principal con cantidad =====
    function renderProduct(data) {
        const imgs = data.images || [data.image];
        productContainer.innerHTML = `<div class="container product-section p-1">
            <!-- Carrusel mobile/tablet -->
            <div id="carouselExampleIndicators" class="carousel slide d-block d-md-none" data-bs-ride="carousel">
                <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
                    <span class="category-badge">${data.category}</span>
                    <div class="d-flex align-items-end mb-1">
                        <h3 class="mt-2 fw-bold">${data.name}</h3>
                        <small class="text-muted">${data.soldCount} vendidos</small>
                    </div>
                    <div class="carousel-inner">
                        ${imgs.map((img, idx) => `
                            <div class="carousel-item ${idx === 0 ? 'active' : ''} main-image">
                                <img src="${img}" class="d-block w-100" alt="...">
                            </div>`).join('')}
                    </div>

                    <!-- Controles -->
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon"></span>
                        <span class="visually-hidden">Anterior</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                        <span class="carousel-control-next-icon"></span>
                        <span class="visually-hidden">Siguiente</span>
                    </button>
                </div>

                <!-- Indicadores -->
                <div class="custom-indicators text-center mt-3">
                    ${imgs.map((_, idx) => `
                        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="${idx}" class="${idx === 0 ? 'active' : ''}"></button>
                    `).join('')}
                </div>

                <div class="col-md-4" id="mobile-vista">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <p class="price">${data.currency} ${data.cost}</p>
                        <button class="btn btn-cart ms-4"><i class="bi bi-cart-plus"></i> Agregar al carrito</button>
                    </div>
                    <div class="my-1">${renderStars(comment.score)}</div>
                    <div class="text-muted">${comment.description}</div>
                </div>
            </div>

            <!-- Vista escritorio -->
            <div class="row d-none d-md-flex" id="desktop-vista">
                <div class="col-md-2 secundary-images">
                    <img src="${imgs[1]}" alt="">
                    <img src="${imgs[2]}" alt="">
                    <img src="${imgs[3]}" alt="" id="last-image">
                </div>

                <div class="col-md-6 main-image">
                    <img src="${imgs[0]}" alt="">
                </div>

                <div class="col-md-4">
                    <span class="category-badge">${data.category}</span>
                    <div class="d-flex align-items-end">
                        <h3 class="mt-2 fw-bold">${data.name}</h3>
                        <small class="text-muted">${data.soldCount} vendidos</small>
                    </div>
                    <p class="mt-2">${data.description}</p>
                    <div class="d-flex justify-content-between align-items-baseline">
                        <p class="price">${data.currency} ${data.cost}</p>
                        <button class="btn btn-cart ms-4"><i class="bi bi-cart-plus"></i> Agregar al carrito</button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // ===== Carrusel mobile =====
    function setupCarousel() {
        const myCarousel = document.querySelector('#carouselExampleIndicators');
        const myIndicators = document.querySelectorAll('.custom-indicators button');
        if (!myCarousel) return;
        myCarousel.addEventListener('slid.bs.carousel', e => {
            myIndicators.forEach(btn => btn.classList.remove('active'));
            myIndicators[e.to].classList.add('active');
        });
    }

    // ===== Imagen secundaria click =====
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

    // ===== Productos relacionados =====
    function loadRelatedProducts(productData) {
        const categoryId = getCategoryId(productData.category);
        if (!categoryId) return;

        fetch(`https://japceibal.github.io/emercado-api/cats_products/${categoryId}.json`)
            .then(resp => resp.json())
            .then(data => {
                let html = "";
                for (const p of data.products) {
                    if (p.id !== productData.id) {
                        html += `<div class="col-12 col-sm-6 col-md-3 mb-4">
                            <div class="product-card" id="product-${p.id}" style="cursor:pointer;">
                                <img src="${p.image}" alt="Producto" class="product-image">
                                <h5 class="fw-bold">${p.name}</h5>
                                <p class="text-muted">${p.description}</p>
                                <p class="price">${p.currency} ${p.cost}</p>
                                <p class="sold">${p.soldCount} vendidos</p>
                            </div>
                        </div>`;
                    }
                }
                interesContainer.innerHTML = html || `<p class="text-muted">Error en la carga de productos.</p>`;
                data.products.forEach(p => {
                    const prodEl = document.getElementById(`product-${p.id}`);
                    if (prodEl) {
                        prodEl.addEventListener("click", () => {
                            localStorage.setItem("producto", p.id);
                            window.location.href = "product-info.html";
                        });
                    }
                });
            }).catch(err => console.error(err));
    }

    // ===== Categoria a ID =====
    function getCategoryId(name) {
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
            default: return null;
        }
    }

    // ===== Fetch a la api para rellenar la lista de comentarios =====
    function generateMockComments(productId) {
        return fetch(PRODUCT_INFO_COMMENTS_URL + productId + EXT_TYPE)
            .then(response => {
                if (!response.ok) {
                    throw new Error("http error " + response.status);
                }
                return response.json();
            })
            .then(data => {
                return data.map(comment => {
                    const { score, user, description, dateTime } = comment;

                    let formattedDate = dateTime; // usar la que trae la API
                    const date = new Date(dateTime);
                    if (!isNaN(date)) {
                        // solo si es válida la formateo
                        formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
                    }

                    return { user, score, description, date: formattedDate };
                });
            })
            .catch(err => {
                console.error(err);
                return [];
            });
    }


    // ===== Render comentarios paginados con estrellas doradas =====
    function renderCommentsPage() {
        const start = (currentCommentsPage - 1) * COMMENTS_PER_PAGE;
        const end = start + COMMENTS_PER_PAGE;

        let sortedComments = [...allComments];
        if (currentSort === "fecha") sortedComments.sort((a, b) => new Date(b.date) - new Date(a.date));
        else if (currentSort === "puntaje") sortedComments.sort((a, b) => b.score - a.score);

        const commentsToShow = sortedComments.slice(start, end);
        const container = document.getElementById("reviews-list");

        container.innerHTML = commentsToShow.map(c => {
            const stars = Array.from({ length: 5 }, (_, i) => i < c.score ? '★' : '☆').join('');
            return `
                <div class="border p-2 mb-2 rounded">
                    <strong>${c.user}</strong> - <span style="color:#FFD700; font-size:1rem;">${stars}</span><br>
                    <small class="text-muted">${c.date}</small>
                    <p>${c.description}</p>
                </div>`;
        }).join('');

        // ===== Paginación =====
        const totalPages = Math.ceil(allComments.length / COMMENTS_PER_PAGE);
        let pagEl = document.getElementById("reviews-pagination");
        if (!pagEl) {
            pagEl = document.createElement("div");
            pagEl.id = "reviews-pagination";
            pagEl.classList.add("d-flex", "gap-2", "mb-3");
            container.parentElement.insertBefore(pagEl, container.nextSibling);
        }
        pagEl.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.className = "btn btn-sm " + (i === currentCommentsPage ? "btn-warning" : "btn-outline-secondary");
            btn.textContent = i;
            btn.addEventListener("click", () => { currentCommentsPage = i; renderCommentsPage(); });
            pagEl.appendChild(btn);
        }
    }

    // ===== Ordenar comentarios =====
    function addSortSelector() {
        const container = document.getElementById("reviews-list");
        const selectId = "sort-comments";
        if (document.getElementById(selectId)) return;

        const select = document.createElement("select");
        select.id = selectId;
        select.classList.add("form-select", "form-select-sm", "mb-2");
        select.innerHTML = `
            <option value="fecha">Ordenar por fecha</option>
            <option value="puntaje">Ordenar por puntaje</option>
        `;
        container.parentElement.insertBefore(select, container);

        select.addEventListener("change", (e) => {
            currentSort = e.target.value;
            renderCommentsPage();
        });
    }

    // ===== Formulario agregar comentario =====
    function setupCommentForm() {
        const form = document.getElementById("review-form");
        if (!form) return;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const user = localStorage.getItem("usuario") || "Usuario";
            const desc = document.getElementById("review-text").value.trim();
            const score = parseInt(document.getElementById("review-score").value);
            const date = new Date().toISOString().slice(0, 19).replace("T", " ");
            if (desc) {
                allComments.push({ user, score, description: desc, date });
                document.getElementById("review-text").value = "";
                document.getElementById("review-score").value = 5;
                currentCommentsPage = Math.ceil(allComments.length / COMMENTS_PER_PAGE);
                renderCommentsPage();
            }
        });
    }

    // ===== Inicializar =====
    if (localStorageProduct) {
        loadProduct(localStorageProduct);
    } else {
        productContainer.innerHTML = `<div class="d-flex justify-content-center align-items-center"><h1>No hay producto seleccionado</h1></div>`;
        const spinner = document.getElementById("spinner-wrapper");
        if (spinner) spinner.style.display = "none";
    }

});
