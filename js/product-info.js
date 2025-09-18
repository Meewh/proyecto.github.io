document.addEventListener("DOMContentLoaded", () => {

    // insertar datos del producto
    fetch("https://japceibal.github.io/emercado-api/products/50922.json")
        .then(response => response.json())
        .then(data => {

            let product = document.getElementById("product");
            let imgs = data.images;

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
        })
});