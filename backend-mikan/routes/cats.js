const express = require('express');
const router = express.Router();

let catService = require('../services/cats');
const verificarToken = require('../middleware/auth');   // ← NUEVA LÍNEA

//get de todas las categorías
router.get("/", verificarToken, (req, res, next) => {
    res.json(catService.getAllCategories())
})

//get de una categoría por id
router.get("/:id", verificarToken, (req, res, next) => {
    const category = catService.getCategoryById(req.params.id);
    res.json(category)
})

module.exports = router;