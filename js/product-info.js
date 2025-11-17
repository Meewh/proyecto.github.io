document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("gallery");
    const productInfoContainer = document.getElementById("product-info");
    const interesContainer = document.getElementById("interes");
    const localStorageProduct = localStorage.getItem("producto");

    const COMMENTS_PER_PAGE = 5;
    let currentCommentsPage = 1;
    let allComments = [];
    let currentSort = "fecha";
    let currentQuantity = 1;

    // ===== Cargar producto =====
    function loadProduct(productId) {
        fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
            .then(resp => resp.json())
            .then(productData => {
                renderGallery(productData);
                renderProductInfo(productData);
                loadRelatedProducts(productData);

                generateMockComments(productId).then(comments => {
                    allComments = comments;
                    renderCommentsPage();
                    setupCommentForm();
                });

                const spinner = document.getElementById("spinner-wrapper");
                if (spinner) spinner.style.display = "none";
            })
            .catch(err => {
                console.error(err);
                galleryContainer.innerHTML = `<div class="col-span-2 flex justify-center items-center"><h1 class="text-2xl font-bold text-red-500">Error al cargar los datos</h1></div>`;
                const spinner = document.getElementById("spinner-wrapper");
                if (spinner) spinner.style.display = "none";
            });
    }

    // ===== Render galería de imágenes =====
    function renderGallery(data) {
        const imgs = data.images || [data.image];

        galleryContainer.innerHTML = `
            <div class="main-image-container">
                <img id="main-image" src="${imgs[0]}" alt="${data.name}">
            </div>
            <div class="thumbnails">
                ${imgs.map((img, idx) => `
                    <button class="thumbnail ${idx === 0 ? 'thumbnail-active' : ''}" data-index="${idx}">
                        <img src="${img}" alt="Thumbnail ${idx + 1}">
                    </button>
                `).join('')}
            </div>
        `;

        // Setup thumbnail clicks
        const thumbnails = galleryContainer.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('main-image');

        thumbnails.forEach((thumb, idx) => {
            thumb.addEventListener('click', () => {
                mainImage.src = imgs[idx];
                thumbnails.forEach(t => t.classList.remove('thumbnail-active'));
                thumb.classList.add('thumbnail-active');
            });
        });

        // Update breadcrumb
        const breadcrumbCategory = document.getElementById('breadcrumb-category');
        const breadcrumbProduct = document.getElementById('breadcrumb-product');
        if (breadcrumbCategory) breadcrumbCategory.textContent = data.category;
        if (breadcrumbProduct) breadcrumbProduct.textContent = data.name;
    }

    // ===== Render información del producto =====
    function renderProductInfo(data) {
        productInfoContainer.innerHTML = `
            <div>
                <span class="category-badge">${data.category}</span>
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <h1 class="product-name mb-0">${data.name}</h1>
                    <button class="btn-favorite" aria-label="Agregar a favoritos">
                        <span class="material-symbols-outlined">favorite_border</span>
                    </button>
                </div>
                <p class="product-description">${data.description}</p>
                <div class="product-price">${data.currency} ${data.cost}</div>
            </div>
            <!-- Cantidad y botón -->
            <div class="bg-surface-light dark:bg-surface-dark rounded-xl p-6">
                <div class="d-flex flex-row align-items-center gap-4">
                    <div class="quantity-selector">
                        <div class="quantity-controls">
                            <button type="button" class="quantity-btn" id="qty-minus">−</button>
                            <span class="quantity-value" id="cart-quantity">1</span>
                            <button type="button" class="quantity-btn" id="qty-plus">+</button>
                        </div>
                    </div>

                    <button class="btn-add-cart" id="add-to-cart-btn">
                        <span class="material-symbols-outlined">shopping_cart</span>
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;

        // Setup quantity controls
        let quantity = 1;
        const qtyDisplay = document.getElementById('cart-quantity');
        const qtyMinus = document.getElementById('qty-minus');
        const qtyPlus = document.getElementById('qty-plus');

        qtyMinus.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                qtyDisplay.textContent = quantity;
                currentQuantity = quantity;
            }
        });

        qtyPlus.addEventListener('click', () => {
            quantity++;
            qtyDisplay.textContent = quantity;
            currentQuantity = quantity;
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
                        html += `
                            <div class="col-sm-6 col-md-4 col-lg-3">
                                <div class="product-card" id="product-${p.id}">
                                    <img src="${p.image}" alt="${p.name}">
                                    <h5>${p.name}</h5>
                                    <p>${p.description}</p>
                                    <div class="price">${p.currency} ${p.cost}</div>
                                    <small>${p.soldCount} vendidos</small>
                                </div>
                            </div>
                        `;
                    }
                }
                interesContainer.innerHTML = html || `<p class="text-center col-12">No hay productos relacionados.</p>`;

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
        const categories = {
            "Autos": 101, "Juguetes": 102, "Muebles": 103,
            "Herramientas": 104, "Computadoras": 105, "Vestimenta": 106,
            "Electrodomésticos": 107, "Deporte": 108, "Celulares": 109
        };
        return categories[name] || null;
    }

    // ===== Fetch comentarios =====
    function generateMockComments(productId) {
        return fetch(PRODUCT_INFO_COMMENTS_URL + productId + EXT_TYPE)
            .then(response => {
                if (!response.ok) throw new Error("http error " + response.status);
                return response.json();
            })
            .then(data => {
                return data.map(comment => {
                    const { score, user, description, dateTime } = comment;
                    let formattedDate = dateTime;
                    const date = new Date(dateTime);
                    if (!isNaN(date)) {
                        formattedDate = date.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    }
                    return { user, score, description, date: formattedDate };
                });
            })
            .catch(err => {
                console.error(err);
                return [];
            });
    }

    // ===== Render comentarios =====
    function renderCommentsPage() {
        const start = (currentCommentsPage - 1) * COMMENTS_PER_PAGE;
        const end = start + COMMENTS_PER_PAGE;

        let sortedComments = [...allComments];
        if (currentSort === "fecha") sortedComments.sort((a, b) => new Date(b.date) - new Date(a.date));
        else if (currentSort === "puntaje") sortedComments.sort((a, b) => b.score - a.score);

        const commentsToShow = sortedComments.slice(start, end);
        const container = document.getElementById("reviews-list");

        // Calcular promedio de calificaciones redondeando a .0 o .5 hacia abajo
        let avgRating = 0;
        if (allComments.length > 0) {
            const rawAvg = allComments.reduce((sum, c) => sum + c.score, 0) / allComments.length;
            avgRating = Math.floor(rawAvg * 2) / 2; // Redondea a .0 o .5 hacia abajo
        }
        const totalReviews = allComments.length;

        // Función para generar estrellas (sólo llenas o vacías, consistentes con otras páginas)
        const generateStars = (rating) => {
            const full = Math.floor(rating);
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= full) starsHTML += '<span class="star star-full">★</span>';
                else starsHTML += '<span class="star star-empty">★</span>';
            }
            return starsHTML;
        };

        if (commentsToShow.length === 0) {
            container.innerHTML = `
                <div class="rating-display-box">
                    <div class="rating-number">${avgRating > 0 ? avgRating.toFixed(1) : '0.0'}</div>
                    <div class="rating-stars">${generateStars(avgRating)}</div>
                    <div class="rating-count">Based on ${totalReviews} reviews</div>
                </div>
                <p class="text-center text-muted mt-4">No hay comentarios aún.</p>
            `;
        } else {
            container.innerHTML = `
                <div class="reviews-container">
                    <div class="rating-display-box">
                        <div class="rating-number">${avgRating.toFixed(1)}</div>
                        <div class="rating-stars">${generateStars(avgRating)}</div>
                        <div class="rating-count">Based on ${totalReviews} reviews</div>
                    </div>
                    <div class="reviews-items-column">
                        ${commentsToShow.map(c => {
                            return `
                                <div class="review-item-box">
                                    <div class="review-header">
                                        <div class="review-user-date">
                                            <span class="review-user">${c.user}</span>
                                            <span class="review-date">${c.date}</span>
                                        </div>
                                        <div class="review-rating">${generateStars(c.score)}</div>
                                    </div>
                                    <p class="review-text">${c.description}</p>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        // Paginación
        const totalPages = Math.ceil(allComments.length / COMMENTS_PER_PAGE);
        const pagEl = document.getElementById("reviews-pagination");

        if (totalPages > 1) {
            pagEl.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1)
                .map(page => `
                    <button class="${page === currentCommentsPage ? 'active' : ''}" data-page="${page}">
                        ${page}
                    </button>
                `).join('');

            pagEl.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => {
                    currentCommentsPage = parseInt(btn.dataset.page);
                    renderCommentsPage();
                });
            });
        } else {
            pagEl.innerHTML = '';
        }
    }

    // ===== Sort selector =====
    const sortSelect = document.getElementById("sort-comments");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            currentSort = e.target.value;
            renderCommentsPage();
        });
    }

    // ===== Formulario comentario =====
    function setupCommentForm() {
        const form = document.getElementById("review-form");
        if (!form) return;

        // Setup custom star control (synchronizes with hidden #review-score)
        const reviewScoreHidden = document.getElementById('review-score');
        const starControl = document.getElementById('review-score-control');
        const starBtns = starControl ? starControl.querySelectorAll('.star-btn') : [];

        function setStars(value) {
            if (reviewScoreHidden) reviewScoreHidden.value = value;
            starBtns.forEach(btn => {
                const v = parseInt(btn.dataset.value, 10) || 0;
                const span = btn.querySelector('.star');
                if (!span) return;
                if (v <= value) {
                    span.classList.remove('star-empty');
                    span.classList.add('star-full');
                    btn.classList.add('selected');
                    btn.setAttribute('aria-pressed', 'true');
                } else {
                    span.classList.remove('star-full');
                    span.classList.add('star-empty');
                    btn.classList.remove('selected');
                    btn.setAttribute('aria-pressed', 'false');
                }
            });
        }

        // initialize with hidden input value or 5
        const initialScore = reviewScoreHidden ? parseInt(reviewScoreHidden.value, 10) || 5 : 5;
        setStars(initialScore);

        starBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = parseInt(btn.dataset.value, 10) || 1;
                setStars(value);
            });
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem("user") || '{}').email?.split('@')[0] || "Usuario";
            const desc = document.getElementById("review-text").value.trim();
            const score = parseInt(document.getElementById("review-score").value);
            const date = new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            if (desc) {
                allComments.unshift({ user, score, description: desc, date });
                document.getElementById("review-text").value = "";
                document.getElementById("review-score").value = 5;
                currentCommentsPage = 1;
                renderCommentsPage();
            }
        });
    }

    // ===== Agregar al carrito =====
    document.addEventListener("click", async (e) => {
        const button = e.target.closest(".btn-add-cart");
        if (!button) return;

        const productId = localStorage.getItem("producto");
        if (!productId) return;

        const quantity = currentQuantity;

        try {
            const resp = await fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`);
            const data = await resp.json();

            let cart = JSON.parse(localStorage.getItem("cart") || "[]");

            const existing = cart.find(p => p.id === data.id);
            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.push({
                    id: data.id,
                    name: data.name,
                    cost: data.cost,
                    currency: data.currency,
                    image: data.images[0],
                    quantity: quantity
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            // Actualizar contador del nav
            if (typeof window.actualizarContadorCarrito === 'function') {
                window.actualizarContadorCarrito();
            }

            window.location.href = "cart.html";
        } catch (err) {
            console.error("Error al agregar al carrito:", err);
        }
    });

    // ===== Inicializar =====
    if (localStorageProduct) {
        loadProduct(localStorageProduct);
    } else {
        galleryContainer.innerHTML = `<div class="col-span-2 flex justify-center items-center py-12"><h1 class="text-2xl font-bold text-text-light-secondary dark:text-text-dark-secondary">No hay producto seleccionado</h1></div>`;
        const spinner = document.getElementById("spinner-wrapper");
        if (spinner) spinner.style.display = "none";
    }
});