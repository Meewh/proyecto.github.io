const productsJSON = require('../mock_bd/products.json');
const db = require('./bd');

async function getAllProducts() {
    try {
        const result = await db.query('SELECT * FROM products');
        return result.rows;
    } catch (err) {
        console.error(err);
        return { error: 'Error en la base de datos' };
    }
}


async function getProductById(id) {
    try {
        const result = await db.query('SELECT * FROM products where id = $1', [id]);

        if (result.rows.length === 0) {
            return { error: 'Producto no encontrado' };
        }
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return { error: 'Error en la base de datos' };
    }
}

async function getProductByCategory(cat) {
    try {
        const result = await db.query('SELECT * FROM products WHERE categoryid = $1', [cat]);
        if (result.rows.length === 0) {
            return { error: 'Producto no encontrado' };
        }
        return result.rows;
    } catch (err) {
        console.error(err);
        return { error: 'Error en la base de datos' };
    }
}

function createProduct(product) {
    productsJSON.push(product);
    return product;
}

function updateProduct(id, product) {
    const index = productsJSON.findIndex(product => product.id === id);
    productsJSON[index] = product;
    return product;
}

function deleteProduct(id) {
    const index = productsJSON.findIndex(product => product.id === id);
    productsJSON.splice(index, 1);
    return id;
}

module.exports = {
    getAllProducts,
    getProductById,
    getProductByCategory,
    createProduct,
    updateProduct,
    deleteProduct
}
