document.addEventListener("DOMContentLoaded", () => {
    //const COMMENTS_BASE = "https://japceibal.github.io/emercado-api/products_comments/" + productId + ".json"; //API BASE PARA LOS COMENTARIOS

    let COMMENTS_BASE = PRODUCT_INFO_COMMENTS_URL + "50923" + EXT_TYPE;
    let comments = [];
//como hacemos para pedir los comentarios? Con fetch(url) pides la ruta. Si responde con status 200 y JSON lo parseas (resp.json()), https://japceibal.github.io/emercado-api/products_comments
// si responde 404 o status distinto devolvemos un [] (vacío) para no romper la página.


//ahora pedimos los comentarios por una async, ya que va a tener una await y por eso va async
    async function initcomments(productId) {
        const avgEst = document.getElementById("avg-rating-container"); //toma elementos del html del promedio de estrellas
        const listComm = document.getElementById("comments-list-container"); //toma elementos del html de los comentarios
        const formComm = document.getElementById("rate-form-container"); //toma elementos del html del formulario

        //obtener los comentarios de la API (si fallá, se recibe []
        const comments = await fetchComments(productId);

        //calcula el promedio y la lista de calificaciones y lo renderiza con render que lo deja bonito (lo hace render)
        renderAverage(avgEst, comments);
        //comentarios - lo deja bonito con render
        renderCommentsList(listComm);
        //deja el formulario para calificar el usuario del localstorage bonito
        renderCommentForm(formComm, comments, productId);

        try {
            const response = await fetch(COMMENTS_BASE);

            if (!response.ok) {
                // aca tiene que mostrar que no hay respuesta y lanza una exepcion
            }

            const data = await response.json();

            for (const comment of data) {
                console.log(comment);
                comments.push(comment);
            }

            renderCommentsList();

        } catch (error) {
            console.log(error);
        }
    }


    function renderCommentsList(listComm) {

        let html = "";

        for (const comment of comments) {
            html += `
                <div class="comment-item mb-4">
                    <div class="d-flex justify-content-between">
                      <div><strong>${comment.user}</strong></div>
                      <div class="small text-muted">${comment.dateTime}</div>
                    </div>
                    <div class="my-1">${renderStars(comment.score)}</div>
                    <div class="text-muted">${comment.description}</div>
                </div>
                `
        }

        listComm.innerHTML = html;

    }
   function renderAverage(avgEst, comments) {
        if (!container) return
       //aqui calcula el promedio (sumando solo valores numericos)
       let sum = 0, n=0
       for (const c of comments) {
           const val = Number(c.score ?? c.rating ?? c.puntuacion ?? 0);
           if (Number.isFinite(val)) {sum += val; n++}
       }
   }

//avg-rating-container promedio estrellas
//comments-list-container comentarios
//rate-form-container formulario

//Con el array de comentarios:
//calcular promedio (sumar puntuaciones válidas y dividir por cantidad),
//renderizar estrellas y número,
//renderizar cada comentario (usuario, fecha formateada, estrellas y texto).
})
