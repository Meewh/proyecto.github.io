const express = require('express');
const router = express.Router();
const productsService = require('../services/products');
const catsService = require('../services/cats');

//get de todos los productos por categoría
router.get("/category/:cat", async (req, res, next) => {
    const product = await productsService.getProductByCategory(req.params.cat);
    const cat = await catsService.getCategoryById(req.params.cat);
    console.log("Fetching category for ID:", req.params.cat);
    console.log("Result from getCategoryById:", cat);
    if (!cat) {
        return res.status(404).json({ message: "Category not found" });
    }
    res.json({
        "catID": req.params.cat,
        "catName": cat.name,
        "products": product
    })
})

//get de todos los productos
router.get("/", async (req, res, next) => {
    res.json(await productsService.getAllProducts())
})

//get de un producto por id
router.get("/:id", async (req, res, next) => {
    const product = productsService.getProductById(req.params.id);
    res.json(product)
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