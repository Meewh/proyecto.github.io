const express = require('express');
const router = express.Router();

let catService = require('../services/cats');

//get de todas las categorías
router.get("/", async (req, res, next) => {
    try {
        const cats = await catService.getAllCategories();
        res.json(cats);
    } catch (err) {
        next(err);
    }
})

//get de una categoría por id
router.get("/:id", async (req, res, next) => {
    try {
        const category = await catService.getCategoryById(req.params.id);
        res.json(category);
    } catch (err) {
        next(err);
    }
})


module.exports = router;