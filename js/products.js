let products = [];

function showProductsList() {

    let htmlContentToAppend = "";
    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        htmlContentToAppend += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div class="product-card">
                <img src="${product.image}" alt="Producto" class="product-image">
                <h5 class="fw-bold">${product.name}
                </h5>
                <p class="text-muted">${product.description}</p>
                <p class="price"> ${product.currency} ${product.cost}</p>
                <p class="sold">${product.soldCount} vendidos</p>
              </div>
            </div>
        `
    }
    document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
}

const dropdownItems = document.querySelectorAll('.dropdown-item');
const dropdownButton = document.getElementById('dropdownButton');

dropdownItems.forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault(); // evita que el enlace navegue
        dropdownButton.textContent = this.textContent;
    });
});


document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData("https://japceibal.github.io/emercado-api/cats_products/101.json").then(function (resultObj) {
        if (resultObj.status === "ok") {
            products = resultObj.data.products;
            showProductsList();
        }
    });
});