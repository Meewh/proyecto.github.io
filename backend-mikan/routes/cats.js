const express = require('express');
const router = express.Router();

let catService = require('../services/cats');

//get de todas las categorías
router.get("/", (req, res, next) => {
    res.json(catService.getAllCategories())
})

//get de una categoría por id
router.get("/:id", (req, res, next) => {
    const category = catService.getCategoryById(req.params.id);
    res.json(category)
})


module.exports = router;