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
                
                allComments = generateMockComments();
                renderCommentsPage();
                addSortSelector();
                setupCommentForm();

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
        productContainer.innerHTML = `
            <div class="container product-section p-1">
                <div class="row d-none d-md-flex">
                    <div class="col-md-2 secundary-images">
                        ${imgs.slice(1,4).map((img, idx) => `<img src="${img}" alt="" ${idx===2?'id="last-image"':''}>`).join('')}
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
                        <div class="d-flex justify-content-between align-items-baseline mb-3">
                            <p class="price">${data.currency} ${data.cost}</p>
                            <div>
                                <input type="number" id="cart-quantity" min="1" value="1" style="width:60px;">
                                <button class="btn btn-cart ms-2"><i class="bi bi-cart-plus"></i> Agregar al carrito</button>
                            </div>
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
        switch(name){
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

    // ===== Mock comments (25 comentarios random estilo Souls) =====
    function generateMockComments() {
        const users = [
            "Solaire", "Siegmeyer", "Andre", "Gwynevere", "Lautrec", 
            "Patches", "Oscar", "Laurentius", "Logan", "Priscilla", 
            "Havel", "Kirk", "Gough", "Gwyn", "Gwyndolin", 
            "Smough", "Firekeeper", "Quelana", "Ashen One", "Greirat",
            "Yuria", "Ornstein", "Horace", "Eileen", "Artorias"
        ];

        const commentsByScore = {
            1: [
                "El producto está peor que pasear por Blighttown.",
                "Más inútil que mi espada rota en el tutorial de Undead Parish.",
                "Esperaba algo mejor, esto es puro sufrimiento.",
                "No volveré a comprar, igual que nunca vuelvo a matar a un Dragón Antiguo sin ayuda.",
                "Defectuoso y decepcionante, ni Andre podría arreglarlo."
            ],
            2: [
                "No es terrible, pero esperaba algo más épico.",
                "Cumple parcialmente, aunque me recuerda a las trampas de Patches.",
                "Aceptable, pero podría ser mejor; como un jefe opcional sin loot.",
                "Regular, nada memorable; más bien aburrido.",
                "Producto decente, aunque no me hizo sentir como frente a Gwyn."
            ],
            3: [
                "Está correcto, como atravesar la Capilla de Andre sin morir.",
                "Cumple su función, ni épico ni horrible.",
                "Normal, nada especial, como un NPC de relleno.",
                "Satisfecho pero se puede mejorar, como un cofre en Darkroot Garden.",
                "Producto decente, como un combate contra un enemigo común."
            ],
            4: [
                "Muy buen producto, casi digno de una hoguera.",
                "Me gustó bastante, como conseguir el anillo de Havel.",
                "Volvería a comprarlo, como cuando resucitas en Firelink.",
                "Excelente relación calidad-precio, casi legendario.",
                "Recomendado, como un milagro bien ejecutado."
            ],
            5: [
                "Excelente producto, superó mis expectativas más oscuras.",
                "Superó mis expectativas, como derrotar a Ornstein y Smough solo.",
                "Totalmente recomendable, me siento invencible como Solaire.",
                "Me encantó, me hace sentir como si encontrara un atajo secreto.",
                "Volvería a comprar sin dudar, como abrazar la luz en Anor Londo.",
                "Praise the Sun!"
            ]
        };

        const comments = [];
        for(let i = 0; i < 25; i++){
            const score = Math.floor(Math.random()*5)+1; // 1 a 5
            const user = users[Math.floor(Math.random()*users.length)];
            const textOptions = commentsByScore[score];
            const description = textOptions[Math.floor(Math.random()*textOptions.length)];
            const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000; // milisegundos en 2 años
            const date = new Date(Date.now() - Math.floor(Math.random() * TWO_YEARS_MS));
            const formattedDate = date.toISOString().slice(0,19).replace("T"," ");
            comments.push({user, score, description, date: formattedDate});
        }

        return comments;
    }

    // ===== Render comentarios paginados con estrellas doradas =====
    function renderCommentsPage() {
        const start = (currentCommentsPage-1)*COMMENTS_PER_PAGE;
        const end = start + COMMENTS_PER_PAGE;

        let sortedComments = [...allComments];
        if(currentSort === "fecha") sortedComments.sort((a,b)=> new Date(b.date) - new Date(a.date));
        else if(currentSort === "puntaje") sortedComments.sort((a,b)=> b.score - a.score);

        const commentsToShow = sortedComments.slice(start,end);
        const container = document.getElementById("reviews-list");

        container.innerHTML = commentsToShow.map(c => {
            const stars = Array.from({length:5}, (_,i)=> i < c.score ? '★' : '☆').join('');
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
        if(!pagEl){
            pagEl = document.createElement("div");
            pagEl.id = "reviews-pagination";
            pagEl.classList.add("d-flex","gap-2","mb-3");
            container.parentElement.insertBefore(pagEl, container.nextSibling);
        }
        pagEl.innerHTML = "";
        for(let i=1;i<=totalPages;i++){
            const btn = document.createElement("button");
            btn.className = "btn btn-sm " + (i===currentCommentsPage?"btn-warning":"btn-outline-secondary");
            btn.textContent = i;
            btn.addEventListener("click",()=>{currentCommentsPage=i; renderCommentsPage();});
            pagEl.appendChild(btn);
        }
    }

    // ===== Ordenar comentarios =====
    function addSortSelector() {
        const container = document.getElementById("reviews-list");
        const selectId = "sort-comments";
        if(document.getElementById(selectId)) return;

        const select = document.createElement("select");
        select.id = selectId;
        select.classList.add("form-select","form-select-sm","mb-2");
        select.innerHTML = `
            <option value="fecha">Ordenar por fecha</option>
            <option value="puntaje">Ordenar por puntaje</option>
        `;
        container.parentElement.insertBefore(select, container);

        select.addEventListener("change",(e)=>{
            currentSort = e.target.value;
            renderCommentsPage();
        });
    }

    // ===== Formulario agregar comentario =====
    function setupCommentForm() {
        const form = document.getElementById("review-form");
        if(!form) return;
        form.addEventListener("submit",(e)=>{
            e.preventDefault();
            const user = localStorage.getItem("usuario") || "Usuario";
            const desc = document.getElementById("review-text").value.trim();
            const score = parseInt(document.getElementById("review-score").value);
            const date = new Date().toISOString().slice(0,19).replace("T"," ");
            if(desc){
                allComments.push({user, score, description:desc, date});
                document.getElementById("review-text").value="";
                document.getElementById("review-score").value = 5;
                currentCommentsPage = Math.ceil(allComments.length/COMMENTS_PER_PAGE);
                renderCommentsPage();
            }
        });
    }

    // ===== Inicializar =====
    if(localStorageProduct){
        loadProduct(localStorageProduct);
    } else {
        productContainer.innerHTML = `<div class="d-flex justify-content-center align-items-center"><h1>No hay producto seleccionado</h1></div>`;
        const spinner = document.getElementById("spinner-wrapper");
        if (spinner) spinner.style.display = "none";
    }

});
