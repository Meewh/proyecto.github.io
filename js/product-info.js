document.addEventListener("DOMContentLoaded", () => {

    // ===== Variables principales =====
    const productContainer = document.getElementById("product");
    const interesContainer = document.getElementById("interes");
    const localStorageProduct = localStorage.getItem("producto");

    // ===== Función principal para cargar un producto =====
    function loadProduct(productId) {
        fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
            .then(response => {
                if (!response.ok) {
                    console.log("La API no devolvió datos");
                    productContainer.innerHTML = `
                        <div class="d-flex justify-content-center align-items-center">
                            <h1>Error al cargar los datos</h1>
                        </div>`;
                    throw new Error("Producto no encontrado");
                }
                return response.json();
            })
            .then(productData => {
                renderProduct(productData);          // Renderiza el producto principal
                setupCarousel();                     // Inicializa comportamiento del carrusel
                setupImageSwitch();                  // Permite cambiar imagen principal al clickar secundaria
                loadRelatedProducts(productData);    // Carga productos relacionados
            })
            .catch(err => console.error(err));
    }

    // ===== Render del producto principal =====
    function renderProduct(data) {
        const imgs = data.images;
        const id = data.id;

        productContainer.innerHTML = `
        <div class="container product-section p-1">
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

                <div class="col-md-4">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <p class="price">${data.currency} ${data.cost}</p>
                        <button class="btn btn-cart ms-4"><i class="bi bi-cart-plus"></i> Agregar al carrito</button>
                    </div>
                    <p class="mt-2">${data.description}</p>
                </div>
            </div>

            <!-- Vista escritorio -->
            <div class="row d-none d-md-flex">
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

    // ===== Inicializar comportamiento del carrusel =====
    function setupCarousel() {
        const myCarousel = document.querySelector('#carouselExample');
        const myIndicators = document.querySelectorAll('.custom-indicators button');

        if (!myCarousel) return;

        myCarousel.addEventListener('slid.bs.carousel', e => {
            myIndicators.forEach(btn => btn.classList.remove('active'));
            myIndicators[e.to].classList.add('active');
        });
    }

    // ===== Cambiar imagen principal al clickar imagen secundaria =====
    function setupImageSwitch() {
        const mainImage = document.querySelector(".col-md-6.main-image img");
        const secondaryImages = document.querySelectorAll(".secundary-images img");

        if (!mainImage || secondaryImages.length === 0) return;

        secondaryImages.forEach(img => {
            img.addEventListener("click", () => {
                const tempSrc = mainImage.src;
                mainImage.src = img.src;
                img.src = tempSrc;
            });
        });
    }

    // ===== Cargar productos relacionados =====
    function loadRelatedProducts(productData) {
        const categoryId = getCategoryId(productData.category);

        if (!categoryId) return;

        fetch(`https://japceibal.github.io/emercado-api/cats_products/${categoryId}.json`)
            .then(response => response.json())
            .then(data => {
                let html = "";
                for (const p of data.products) {
                    if (p.id !== productData.id) {
                        html += `
                        <div class="col-12 col-sm-6 col-md-3 mb-4">
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

                // ---- Asignar evento click a cada producto ----
                data.products.forEach(p => {
                    const prodEl = document.getElementById(`product-${p.id}`);
                    if (prodEl) {
                        prodEl.addEventListener("click", () => {
                            localStorage.setItem("producto", p.id); // Guardar id en localStorage
                            window.location.href = "product-info.html"; // Redirigir a otra página
                        });
                    }
                });
            })
            .catch(err => console.error("Error cargando productos relacionados:", err));
    }

    // ===== Mapear nombre de categoría a ID =====
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

    // ===== Inicializar =====
    if (localStorageProduct) {
        loadProduct(localStorageProduct);
    } else {
        productContainer.innerHTML = `
            <div class="d-flex justify-content-center align-items-center">
                <h1>No hay producto seleccionado</h1>
            </div>`;
    }

});
