exports.getAllProducts = getAllProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getProductByCategory = getProductByCategory;

const productsJSON = require('../mock_bd/products.json');

function getAllProducts() {
    return productsJSON;
}

function getProductById(id) {
    return productsJSON.find(product => product.id === id);
}

function getProductByCategory(cat) {
    let category = require('../mock_bd/cats_products/' + cat + '.json');
    return category;
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
