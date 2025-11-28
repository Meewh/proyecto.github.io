const express = require('express');
const router = express.Router();
const productsService = require('../services/products');
const verificarToken = require('../middleware/auth');

// GET /products          → todos los productos envueltos
// GET /products?cat=101  → solo los de esa categoría, envueltos en { products: [...] }
// GET /products?category=Juguetes → también permitir filtrar por nombre
router.get("/", verificarToken, (req, res) => {
    // 🔥 Nuevo: aceptar cat o category
    const catParam = req.query.cat || req.query.category;
    const todos = productsService.getAllProducts();

    if (catParam) {
        // 🔥 Nuevo filtrado flexible:
        // - si catParam es numérico, compara con p.catID
        // - si no es numérico, compara con p.category (nombre)
        const filtrados = todos.filter(p => {
            if (p.catID && String(p.catID) === String(catParam)) return true;
            if (p.category && String(p.category).toLowerCase() === String(catParam).toLowerCase()) return true;
            return false;
        });

        return res.json({ products: filtrados });
    }

    // Si no hay query → devuelve todos
    res.json({ products: todos });
});

// GET /products/50921 → devuelve { product: { ... } }
router.get("/:id", verificarToken, (req, res) => {
    const product = productsService.getProductById(req.params.id);

    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    // CLAVE: devolver envuelto exactamente como espera el frontend
    res.json({ product: product });
});

// (Opcional) Ruta vieja que tenías, la dejo por si alguien la usa
router.get("/category/:cat", verificarToken, (req, res) => {
    const todos = productsService.getAllProducts();
    const filtrados = todos.filter(p => String(p.catID) === String(req.params.cat));
    res.json({ products: filtrados });
});

// POST - Crear producto (protegido)
router.post("/", verificarToken, (req, res) => {
    const product = productsService.createProduct(req.body);
    res.status(201).json({ message: "Producto creado", product });
});

// PUT - Actualizar producto
router.put("/:id", verificarToken, (req, res) => {
    const product = productsService.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto actualizado", product });
});

// DELETE - Eliminar producto
router.delete("/:id", verificarToken, (req, res) => {
    const eliminado = productsService.deleteProduct(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
});

module.exports = router;
