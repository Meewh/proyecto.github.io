
const myCarousel = document.querySelector('#carouselExample');
const myIndicators = document.querySelectorAll('.custom-indicators button');

// Escuchar cuando cambia el slide
myCarousel.addEventListener('slid.bs.carousel', function (e) {
    // Quitar clase active de todas
    myIndicators.forEach(btn => btn.classList.remove('active'));
    // Agregar active al botón correspondiente
    myIndicators[e.to].classList.add('active');
});




document.addEventListener("DOMContentLoaded", () => {

    let product = document.getElementyById("product");

    product.InnerHTML = `



`



});