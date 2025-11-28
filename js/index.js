document.addEventListener("DOMContentLoaded", async function () {

    // Carga de categorías y creación de cards
    const categoriesContainer = document.getElementById("categories-container");

    // ============================================================
    // NUEVAS LÍNEAS ENTREGA 8: FUNCIÓN fetchConToken REUTILIZABLE
    // ============================================================
    async function fetchConToken(url) {
        const token = localStorage.getItem("token");
        const response = await fetch(url, {
            headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                alert("Necesitas iniciar sesión para ver las categorías");
                window.location.href = "login.html";
            }
            throw new Error("Error HTTP: " + response.status);
        }
        return await response.json();
    }
    // ============================================================
    // FIN NUEVAS LÍNEAS ENTREGA 8
    // ============================================================

    // ============================================================
    // NUEVAS LÍNEAS ENTREGA 8: REEMPLAZO DE fetch normal por fetchConToken
    // ============================================================
    try {
        const categories = await fetchConToken("http://localhost:3000/cats");

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

            // Agregamosamos evento click para redirigir a products.html
            div.querySelector(".category-link").addEventListener("click", () => {
                localStorage.setItem("catID", cat.id); // guardamos el id de la categoría
                window.location.href = "products.html";
            });

            categoriesContainer.appendChild(div);
        });
    } catch (error) {
        console.error("Error cargando categorías:", error);
        categoriesContainer.innerHTML = `<p class="text-danger text-center">Error al cargar categorías. Inicia sesión nuevamente.</p>`;
    }
    // ============================================================
    // FIN NUEVAS LÍNEAS ENTREGA 8
    // ============================================================
});