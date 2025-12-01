const express = require('express');
const router = express.Router();

const cartService = require('../services/cart');

router.get('/', async (req, res) => {
    res.status(200).json(await cartService.getAllProductsInCart());
});

router.post('/', async (req, res) => {
    const response = await cartService.addProductToCart(req.body);
    res.status(201).json(response);
});

router.delete('/all', async (req, res) => {
    const response = await cartService.removeAllProductsFromCart();
    res.status(204).json(response);
});

router.delete('/:id', async (req, res) => {
    const response = await cartService.removeProductFromCart(req.params.id);
    res.status(204).json(response);
});

router.patch('/increase/:id', async (req, res) => {
    const response = await cartService.increaseQuantity(req.params.id);
    res.status(200).json(response);
});

router.patch('/decrease/:id', async (req, res) => {
    const response = await cartService.decreaseQuantity(req.params.id);
    res.status(200).json(response);
});

module.exports = router;