const express = require('express');
const router = express.Router();
const productsService = require('../services/products');

//get de todos los productos
router.get("/", (req, res, next) => {
    res.json({
        message: "Lista de productos",
        status: "OK",
        products: productsService.getAllProducts()
    })
})

//get de un producto por id
router.get("/:id", (req, res, next) => {

})

//post de un producto
router.post("/", (req, res, next) => {

})

//put de un producto
router.put("/:id", (req, res, next) => {

})

//delete de un producto
router.delete("/:id", (req, res, next) => {

})


module.exports = router;