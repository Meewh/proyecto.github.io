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
    const product = productsService.getProductById(req.params.id);
    res.json({
        message: "Producto encontrado",
        status: "OK",
        product: product
    })
})

//get de todos los productos por categoría
router.get("/category/:cat", (req, res, next) => {
    res.json({
        message: `Lista de productos por ${req.params.cat}`,
        status: "OK",
        products: productsService.getProductByCategory(req.params.cat)
    })
})

//post de un producto
router.post("/", (req, res, next) => {
    const product = productsService.createProduct(req.body);
    res.json({
        message: "Producto creado",
        status: "OK",
        product: product
    })
})

//put de un producto
router.put("/:id", (req, res, next) => {
    const product = productsService.updateProduct(req.params.id, req.body);
    res.json({
        message: "Producto actualizado",
        status: "OK",
        product: product
    })
})

//delete de un producto
router.delete("/:id", (req, res, next) => {
    productsService.deleteProduct(req.params.id);
    res.status(403).json({
        message: "Producto eliminado",
        status: "OK",
    })
})


module.exports = router;