document.addEventListener("DOMContentLoaded", function () {

    // Carga de categorías y creación de cards
    const categoriesContainer = document.getElementById("categories-container");

    fetch(CATEGORIES_URL)
        .then(response => response.json())
        .then(categories => {
            categories.forEach(cat => {
                // Creamos la card de la categoría
                const div = document.createElement("div");
                div.classList.add("col-md-4");

                // Aquí ajustamos para usar cat101_1, cat104_1, etc.
                const imageFile = `img/cat${cat.id}_1.jpg`;

                div.innerHTML = `
                    <div class="category-link card mb-4 shadow-sm custom-card cursor-active" data-id="${cat.id}">
                    <img class="bd-placeholder-img card-img-top" src="img/cat${cat.id}_1.jpg" alt="Imagen de ${cat.name}">
                        <h3 class="m-3">${cat.name}</h3>
                        <div class="card-body">
                            <p class="card-text">${cat.description}</p>
                        </div>
                    </div>
                `;

                // Agregamos evento click para redirigir a products.html
                div.querySelector(".category-link").addEventListener("click", () => {
                    localStorage.setItem("catID", cat.id); // guardamos el id de la categoría
                    window.location.href = "products.html";
                });

                categoriesContainer.appendChild(div);
            });
        })
        .catch(error => console.error("Error cargando categorías:", error));
});
