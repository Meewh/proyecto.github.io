const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
let searchTerm = ""; // Nueva variable para el término de búsqueda

function sortCategories(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name > b.name) { return -1; }
            if (a.name < b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_PROD_COUNT) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }

    return result;
}

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html"
}

function showCategoriesList() {
    let html = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  `;

    let filteredCount = 0;

    for (let category of currentCategoriesArray) {
        // Filtro por rango de productos
        let passesCountFilter = (
            (minCount === undefined || parseInt(category.productCount) >= minCount) &&
            (maxCount === undefined || parseInt(category.productCount) <= maxCount)
        );

        // Filtro por búsqueda (nombre o descripción)
        let passesSearchFilter = true;
        if (searchTerm !== "") {
            const search = searchTerm.toLowerCase();
            const nameMatch = category.name.toLowerCase().includes(search);
            const descMatch = category.description.toLowerCase().includes(search);
            passesSearchFilter = nameMatch || descMatch;
        }

        // Solo mostrar si pasa ambos filtros
        if (passesCountFilter && passesSearchFilter) {
            filteredCount++;
            html += `
        <div 
          onclick="setCatID(${category.id})"
          class="cursor-pointer bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
          <div class="relative">
            <img 
              src="${category.imgSrc}" 
              alt="${category.description}"
              class="w-full aspect-[4/3] object-cover"
            >
            <div class="absolute bottom-2 right-2 bg-[#f1e7f3] text-[#190d1b] text-xs font-bold px-2 py-1 rounded">
              ${category.productCount} productos
            </div>
          </div>

          <div class="p-4">
            <h3 class="font-bold text-lg mb-1">${category.name}</h3>
            <p class="text-sm text-muted-light dark:text-muted-dark h-12">
              ${category.description}
            </p>
          </div>
        </div>
      `;
        }
    }

    html += `</div>`;

    // Mostrar mensaje si no hay resultados
    if (filteredCount === 0) {
        html = `
        <div class="text-center py-12">
          <i class="bi bi-search text-6xl text-muted-light dark:text-muted-dark mb-4"></i>
          <p class="text-xl text-muted-light dark:text-muted-dark">No se encontraron categorías que coincidan con tu búsqueda</p>
        </div>
        `;
    }

    document.getElementById("cat-list-container").innerHTML = html;
}


function sortAndShowCategories(sortCriteria, categoriesArray) {
    currentSortCriteria = sortCriteria;

    if (categoriesArray != undefined) {
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    showCategoriesList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CATEGORIES_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentCategoriesArray = resultObj.data
            showCategoriesList()
            //sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    // Event listener para la búsqueda
    document.getElementById("searchInput").addEventListener("input", function (e) {
        searchTerm = e.target.value;
        showCategoriesList();
    });

    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCategoriesList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }

        showCategoriesList();
    });
});