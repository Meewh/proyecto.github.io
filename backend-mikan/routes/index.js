var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


//req es la peticion, como lo que sale derecho del postman
//res es la respuesta, lo que se devuelve, por lo general un json con head y body
//next es (investigar)
router.get("/health", (req, res, next) => {
  res.json({
    message: "backend funcional",
    status: "OK"
  })
})

module.exports = router;