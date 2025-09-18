document.addEventListener("DOMContentLoaded", () => {

    // insertar datos del producto

    let localStorageProduct = localStorage.getItem("producto");

    fetch(`https://japceibal.github.io/emercado-api/products/${localStorageProduct}.json`)
        .then(response => {
            if (!response.ok) {
                console.log("La API no devolvió datos");
                product.innerHTML = `<div class="d-flex justify-content-center align-items-center"><h1>Error al cargar los datos</h1></div>`
            }
            return response.json();
        })
        .then(data => {

            let product = document.getElementById("product");
            let imgs = data.images;
            let id = data.id;

            product.innerHTML = `
                                <div class="container product-section p-1">

                                <!-- parte mobile y tablet -->

                                <div id="carouselExampleIndicators" class="carousel slide d-block d-md-none" data-bs-ride="carousel">
                                <!-- Carrusel -->
                                <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
                                    <span class="category-badge">${data.category}</span>
                                    <div class="d-flex align-items-end mb-1">
                                    <h3 class="mt-2 fw-bold">${data.name}</h3>
                                    <small class="text-muted">${data.soldCount} vendidos</small>
                                    </div>
                                    <div class="carousel-inner">
                                    <div class="carousel-item active main-image">
                                        <img src="${imgs[0]}" class="d-block w-100" alt="...">
                                    </div>
                                    <div class="carousel-item main-image">
                                        <img src="${imgs[1]}" class="d-block w-100" alt="...">
                                    </div>
                                    <div class="carousel-item main-image">
                                        <img src="${imgs[2]}" class="d-block w-100" alt="...">
                                    </div>
                                    <div class="carousel-item main-image">
                                        <img src="${imgs[3]}" class="d-block w-100" alt="...">
                                    </div>
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

                                <!-- Indicadores en un div aparte -->
                                <div class="custom-indicators text-center mt-3">
                                    <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" class="active"></button>
                                    <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1"></button>
                                    <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2"></button>
                                    <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="3"></button>
                                </div>

                                <div class="col-md-4">
                                    <div class="d-flex justify-content-between align-items-baseline">
                                    <p class="price">${data.currency} ${data.cost}</p>
                                    <button class="btn btn-cart ms-4"><i class="bi bi-cart-plus"></i> Agregar al carrito</button>
                                    </div>
                                    <p class="mt-2">${data.description}</p>
                                </div>

                                </div>

                                <!-- parte escritorio -->

                                <div class="row d-none d-md-flex">
                                <!-- Imagenes secundarias -->
                                <div class="col-md-2 secundary-images">
                                    <img src="${imgs[1]}" alt="">
                                    <img src="${imgs[2]}" alt="">
                                    <img src="${imgs[3]}" alt="" id="last-image">
                                </div>

                                <!-- Imagen principal -->
                                <div class="col-md-6 main-image">
                                    <img src="${imgs[0]}" alt="">
                                </div>

                                <!-- Información del producto -->
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
                            </div>


                        `

            const myCarousel = document.querySelector('#carouselExample');
            const myIndicators = document.querySelectorAll('.custom-indicators button');

            // es una pavada jsjsjs pero es para que las bolitas cambien de color al cambiar de imagen en el carrucel
            myCarousel.addEventListener('slid.bs.carousel', function (e) {
                myIndicators.forEach(btn => btn.classList.remove('active'));
                myIndicators[e.to].classList.add('active');
            });

            //para que la imagen cambie al clickar otra
            const mainImage = document.querySelector(".col-md-6.main-image img");
            const secondaryImages = document.querySelectorAll(".secundary-images img");

            secondaryImages.forEach(img => {
                img.addEventListener("click", () => {
                    const tempSrc = mainImage.src;
                    mainImage.src = img.src;
                    img.src = tempSrc;
                });
            });

            fetch(`https://japceibal.github.io/emercado-api/cats_products/${getCategoryId(data.category)}.json`)
                .then(response => {
                    if (!response.ok) {
                        console.log("La API no devolvió datos");
                        // product.innerHTML = `<div class="d-flex justify-content-center align-items-center"><h1>Error al cargar los datos</h1></div>`
                    }
                    return response.json();
                })
                .then(data => {

                    let interes = document.getElementById("interes");

                    let html = "";
                    for (const p of data.products) {
                        if (p.id !== id) {
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
                    interes.innerHTML = html || `<p class="text-muted">Error en la carga de productos.</p>`;


                })


        })


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
            default: return null; // o cualquier valor que indique "no encontrado"
        }
    }






});