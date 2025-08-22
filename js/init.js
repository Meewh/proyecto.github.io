const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

document.addEventListener("DOMContentLoaded", function (e) {
  // const navbar = this.getElementById("navbar");
  // navbar.innerHTML = `
  //   <div class="container">
  //     <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
  //       aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
  //       <span class="navbar-toggler-icon"></span>
  //     </button>
  //     <div class="collapse navbar-collapse" id="navbarNav">
  //       <ul class="navbar-nav w-100 justify-content-between">
  //         <li class="nav-item">
  //           <a class="nav-link active" href="index.html">Inicio</a>
  //         </li>
  //         <li class="nav-item">
  //           <a class="nav-link" href="categories.html">Categorías</a>
  //         </li>
  //         <li class="nav-item">
  //           <a class="nav-link" href="sell.html">Vender</a>
  //         </li>
  //         <li class="nav-item dropdown" style="position: relative;">
  //           <button id="userMenuBtn" class="nav-link" style="background:none;border:none;cursor:pointer;">
  //             <span id="bienvenida">Iniciar sesión</span> <span id="flecha">▼</span>
  //           </button>
  //           <ul id="userMenu" style="
  //               display: none;
  //               position: absolute;
  //               top: 100%;
  //               left: 0;
  //               background: white;
  //               border: 1px solid #ccc;
  //               border-radius: 5px;
  //               list-style: none;
  //               padding: 0;
  //               margin: 0;
  //               min-width: 150px;
  //               z-index: 9999;
  //           ">
  //             <!-- guarda temporalmente todo en el cache de la pag -->
  //           </ul>
  //         </li>

  //       </ul>
  //     </div>
  //   `
});