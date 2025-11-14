function applyDarkMode() {
    const dark = localStorage.getItem("dark") === "true";

    const nav = document.getElementById("navbar");
    if (nav) nav.classList.toggle("dark", dark);
    document.body.classList.toggle("dark", dark);

    const logo = document.getElementById("logo");
    if (logo) logo.src = dark ? "img/logoDark.png" : "img/Logo.png";

    const navLinks = document.querySelectorAll(".navbar .nav-link");
    navLinks.forEach(link => {
        link.style.color = dark ? "#2B2B2B" : "#ffffff";
    });

    const jumbo = document.getElementById("jumbotron");
    if (jumbo) jumbo.classList.toggle("dark", dark);

    const album = document.getElementById("album")
    if (album) album.classList.toggle("dark", dark);
    if (album) album.classList.toggle("bg-light", !dark);

    const categories = document.getElementById("categories-container");
    if (categories) categories.classList.toggle("dark", dark);

    const yMuchoMas = document.getElementById("y-mucho-mas");
    if (yMuchoMas) yMuchoMas.classList.toggle("dark", dark);

    const aToZ = document.getElementById("aToZ");
    if (aToZ) aToZ.classList.toggle("dark", dark);
    if (aToZ) aToZ.classList.toggle("btn-light", !dark);

    const zToA = document.getElementById("zToA");
    if (zToA) zToA.classList.toggle("dark", dark);
    if (zToA) zToA.classList.toggle("btn-light", !dark);

    const ventas = document.getElementById("ventas");
    if (ventas) ventas.classList.toggle("dark", dark);
    if (ventas) ventas.classList.toggle("btn-light", !dark);

    const rangeFilterCount = document.getElementById("rangeFilterCount");
    if (rangeFilterCount) rangeFilterCount.classList.toggle("dark", dark);
    if (rangeFilterCount) rangeFilterCount.classList.toggle("btn-light", !dark);

    const rangeFilterCountMax = document.getElementById("rangeFilterCountMax");
    if (rangeFilterCountMax) rangeFilterCountMax.classList.toggle("dark", dark);
    if (rangeFilterCountMax) rangeFilterCountMax.classList.toggle("btn-light", !dark);

    const rangeFilterCountMin = document.getElementById("rangeFilterCountMin");
    if (rangeFilterCountMin) rangeFilterCountMin.classList.toggle("dark", dark);
    if (rangeFilterCountMin) rangeFilterCountMin.classList.toggle("btn-light", !dark);

    const catListContainer = document.getElementById("cat-list-container");
    if (catListContainer) catListContainer.classList.toggle("dark", dark);

    const aside = document.getElementById("aside");
    if (aside) aside.classList.toggle("dark", dark);

    const buscador = document.getElementById("buscador");
    if (buscador) buscador.classList.toggle("dark", dark);

    const productListContainer = document.getElementById("product-list-container");
    if (productListContainer) productListContainer.classList.toggle("dark", dark);

    const desktopVista = document.getElementById("desktop-vista");
    if (desktopVista) desktopVista.classList.toggle("dark", dark);

    const mobileVista = document.getElementById("mobile-vista");
    if (mobileVista) mobileVista.classList.toggle("dark", dark);

    const carouselExample = document.getElementById("carouselExample");
    if (carouselExample) carouselExample.classList.toggle("dark", dark);

    const interes = document.getElementById("interes");
    if (interes) interes.classList.toggle("dark", dark);

    const reviews = document.getElementById("reviews");
    if (reviews) reviews.classList.toggle("dark", dark);

    const movileProdutcs = document.getElementById("movile-produtcs");
    if (movileProdutcs) movileProdutcs.classList.toggle("dark", dark);

    const miModal = document.getElementById("miModal");
    if (miModal) miModal.classList.toggle("dark", dark);

    const tarjetaPerfil = document.getElementById("tarjeta-perfil");
    if (tarjetaPerfil) tarjetaPerfil.classList.toggle("dark", dark);

    const logoLogin = document.getElementById("logoLogin");
    if (logoLogin) logoLogin.src = dark ? "img/logoDark.png" : "img/Logo.png";

    const logoNavLogin = document.getElementById("logoNavLogin");
    if (logoNavLogin) logoNavLogin.src = dark ? "img/logoDark.png" : "img/Logo.png";

    const header = document.getElementById("header");
    if (header) header.classList.toggle("dark", dark);

    const loginContainer = document.getElementById("login-container");
    if (loginContainer) loginContainer.classList.toggle("dark", dark);

    const cartPayCard = document.getElementById("cart-pay-card");
    if (cartPayCard) cartPayCard.classList.toggle("dark", dark);

    const checkoutButton = document.getElementById("checkout-button");
    if (checkoutButton) checkoutButton.classList.toggle("dark", dark);

    const couponInputCard = document.getElementById("coupon-input-card");
    if (couponInputCard) couponInputCard.classList.toggle("dark", dark);

    const applyCoupon = document.getElementById("apply-coupon");
    if (applyCoupon) applyCoupon.classList.toggle("btn-outline-dark", !dark);
    if (applyCoupon) applyCoupon.classList.toggle("btn-outline-light", dark);

    const directionContainer = document.getElementById("direction-container");
    if (directionContainer) directionContainer.classList.toggle("dark", dark);

    const shippingOptions = document.getElementById("shipping-options");
    if (shippingOptions) shippingOptions.classList.toggle("dark", dark);

    const cartContainer = document.getElementById("cart-container");
    if (cartContainer) cartContainer.classList.toggle("dark", dark);

    const productTableHead = document.getElementById("product-table-head");
    if (productTableHead) productTableHead.classList.toggle("table-light", !dark);
    if (productTableHead) productTableHead.classList.toggle("table-dark", dark);



    const dropdownLinks = document.querySelectorAll(".navbar .dropdown-menu a");
    dropdownLinks.forEach(link => {
        link.style.color = dark ? "#2B2B2B" : "#000000";
    });
}

function setupDarkModeToggle() {
    const toggle = document.querySelector("#theme");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
        const dark = localStorage.getItem("dark") === "true";
        localStorage.setItem("dark", dark ? "false" : "true");
        applyDarkMode();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    applyDarkMode();
    setupDarkModeToggle();
});
