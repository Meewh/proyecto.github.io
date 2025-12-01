const db = require('./bd');

async function getAllProductsInCart() {
    try {
        const result = await db.query('SELECT * FROM cart ORDER BY id DESC');
        return result.rows;
    } catch (err) {
        console.error(err);
        return { error: 'Error en la base de datos' };
    }
}

async function addProductToCart(product) {
    try {
        const result = await db.query('INSERT INTO cart (idUser ,productId, quantity) VALUES ($1, $2, $3) RETURNING *', [product.idUser, product.productId, product.quantity]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return { error: 'Error en la base de datos' };
    }
}

async function removeProductFromCart(id) {
    try {
        const result = await db.query('DELETE FROM cart WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return { error: 'Error en la base de datos' };
    }
}

async function increaseQuantity(id) {
    try {
        const result = await db.query('UPDATE cart SET quantity = quantity + 1 WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return { error: 'Error en la base de datos' };
    }
}

async function decreaseQuantity(id) {
    try {
        const result = await db.query('UPDATE cart SET quantity = quantity - 1 WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return { error: 'Error en la base de datos' };
    }
}

async function removeAllProductsFromCart() {
    try {
        const result = await db.query('DELETE FROM cart');
        return result.rows;
    } catch (err) {
        console.error(err);
        return { error: 'Error en la base de datos' };
    }
}

module.exports = {
    getAllProductsInCart,
    addProductToCart,
    removeProductFromCart,
    increaseQuantity,
    decreaseQuantity,
    removeAllProductsFromCart
}