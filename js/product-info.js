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
        fetch(PRODUCT_INFO_URL + productId + EXT_TYPE)
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
            <div class="flex flex-col gap-4">
                <!-- Imagen principal -->
                <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden aspect-square">
                    <img id="main-image" src="${imgs[0]}" alt="${data.name}" class="w-full h-full object-cover">
                </div>
                
                <!-- Thumbnails -->
                <div class="grid grid-cols-4 gap-3">
                    ${imgs.map((img, idx) => `
                        <button class="thumbnail ${idx === 0 ? 'thumbnail-active' : ''} border-2 border-border-light dark:border-border-dark rounded-lg overflow-hidden aspect-square hover:border-primary transition-colors" data-index="${idx}">
                            <img src="${img}" alt="Thumbnail ${idx + 1}" class="w-full h-full object-cover">
                        </button>
                    `).join('')}
                </div>
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
    }

    // ===== Render información del producto =====
    function renderProductInfo(data) {
        productInfoContainer.innerHTML = `
            <div class="flex flex-col gap-6">
                <!-- Badge de categoría -->
                <div class="inline-flex items-center gap-2">
                    <span class="px-3 py-1 rounded-full bg-primary/20 text-accent dark:text-text-dark-primary text-sm font-semibold">
                        ${data.category}
                    </span>
                    <span class="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                        ${data.soldCount} vendidos
                    </span>
                </div>

                <!-- Nombre del producto -->
                <h1 class="text-3xl lg:text-4xl font-black text-accent dark:text-text-dark-primary leading-tight">
                    ${data.name}
                </h1>

                <!-- Descripción -->
                <p class="text-text-light-secondary dark:text-text-dark-secondary leading-relaxed">
                    ${data.description}
                </p>

                <!-- Precio -->
                <div class="flex items-baseline gap-2">
                    <span class="text-sm text-text-light-secondary dark:text-text-dark-secondary font-medium">Precio</span>
                    <span class="text-5xl font-extrabold text-accent dark:text-text-dark-primary">
                        ${data.currency} ${data.cost}
                    </span>
                </div>

                <!-- Cantidad y botón -->
                <div class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
                    <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        <!-- Selector de cantidad -->
                        <div class="flex items-center gap-3">
                            <label class="text-sm font-medium text-accent dark:text-text-dark-primary">Cantidad:</label>
                            <div class="flex items-center border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
                                <button id="qty-minus" class="px-4 py-2 bg-background-light dark:bg-background-dark hover:bg-primary/10 transition-colors">
                                    <span class="material-symbols-outlined text-xl">remove</span>
                                </button>
                                <input type="number" id="cart-quantity" value="1" min="1" 
                                    class="w-16 text-center border-x border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-accent dark:text-text-dark-primary font-bold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-none">
                                <button id="qty-plus" class="px-4 py-2 bg-background-light dark:bg-background-dark hover:bg-primary/10 transition-colors">
                                    <span class="material-symbols-outlined text-xl">add</span>
                                </button>
                            </div>
                        </div>

                        <!-- Botón agregar al carrito -->
                        <button class="btn-cart flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-accent font-bold hover:bg-primary/90 transition-colors">
                            <span class="material-symbols-outlined text-xl">shopping_cart</span>
                            Agregar al Carrito
                        </button>
                    </div>
                </div>

                <!-- Características adicionales -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center gap-3 p-4 rounded-lg bg-background-light dark:bg-background-dark">
                        <span class="material-symbols-outlined text-2xl text-primary">local_shipping</span>
                        <div>
                            <p class="text-sm font-semibold text-accent dark:text-text-dark-primary">Envío gratis</p>
                            <p class="text-xs text-text-light-secondary dark:text-text-dark-secondary">En compras +$1000</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 p-4 rounded-lg bg-background-light dark:bg-background-dark">
                        <span class="material-symbols-outlined text-2xl text-primary">verified</span>
                        <div>
                            <p class="text-sm font-semibold text-accent dark:text-text-dark-primary">Garantía</p>
                            <p class="text-xs text-text-light-secondary dark:text-text-dark-secondary">12 meses</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Setup quantity controls
        const qtyInput = document.getElementById('cart-quantity');
        const qtyMinus = document.getElementById('qty-minus');
        const qtyPlus = document.getElementById('qty-plus');

        qtyMinus.addEventListener('click', () => {
            if (qtyInput.value > 1) {
                qtyInput.value = parseInt(qtyInput.value) - 1;
            }
        });

        qtyPlus.addEventListener('click', () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
        });
    }

    // ===== Productos relacionados =====
    function loadRelatedProducts(productData) {
        const categoryId = getCategoryId(productData.category);
        if (!categoryId) return;

        fetch(PRODUCTS_URL + categoryId)
            .then(resp => resp.json())
            .then(data => {
                let html = "";
                for (const p of data.products) {
                    if (p.id !== productData.id) {
                        html += `
                            <div class="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden border border-border-light dark:border-border-dark hover:shadow-lg transition-shadow duration-300 cursor-pointer" id="product-${p.id}">
                                <div class="aspect-square overflow-hidden">
                                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
                                </div>
                                <div class="p-4">
                                    <h3 class="font-bold text-lg mb-1 text-accent dark:text-text-dark-primary line-clamp-1">${p.name}</h3>
                                    <p class="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-2 line-clamp-2">${p.description}</p>
                                    <div class="flex items-center justify-between">
                                        <span class="text-lg font-extrabold text-accent dark:text-text-dark-primary">${p.currency} ${p.cost}</span>
                                        <span class="text-xs text-text-light-secondary dark:text-text-dark-secondary">${p.soldCount} vendidos</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }
                interesContainer.innerHTML = html || `<p class="text-text-light-secondary dark:text-text-dark-secondary col-span-full text-center">No hay productos relacionados.</p>`;

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

        if (commentsToShow.length === 0) {
            container.innerHTML = `<p class="text-center text-text-light-secondary dark:text-text-dark-secondary">No hay comentarios aún.</p>`;
        } else {
            container.innerHTML = commentsToShow.map(c => {
                const stars = '⭐'.repeat(c.score);
                return `
                    <div class="border border-border-light dark:border-border-dark rounded-lg p-4 bg-background-light dark:bg-background-dark">
                        <div class="flex items-start justify-between mb-2">
                            <div>
                                <p class="font-bold text-accent dark:text-text-dark-primary">${c.user}</p>
                                <p class="text-sm text-text-light-secondary dark:text-text-dark-secondary">${c.date}</p>
                            </div>
                            <span class="text-lg">${stars}</span>
                        </div>
                        <p class="text-text-light-primary dark:text-text-dark-primary">${c.description}</p>
                    </div>
                `;
            }).join('');
        }

        // Paginación
        const totalPages = Math.ceil(allComments.length / COMMENTS_PER_PAGE);
        const pagEl = document.getElementById("reviews-pagination");

        if (totalPages > 1) {
            pagEl.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1)
                .map(page => `
                    <button class="px-4 py-2 rounded-lg font-medium transition-colors ${page === currentCommentsPage
                        ? 'bg-primary text-accent'
                        : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-accent dark:text-text-dark-primary hover:bg-primary/10'
                    }" data-page="${page}">
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
        const button = e.target.closest(".btn-cart");
        if (!button) return;

    const productId = localStorage.getItem("producto");
    if (!productId) return;

    try {
        const resp = await fetch(PRODUCT_INFO_URL + productId + EXT_TYPE);
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