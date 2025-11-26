const catsJSON = require('../mock_bd/cats/cat.json');

function getAllCategories() {
    return catsJSON;
}

function getCategoryById(id) {
    return catsJSON.find(cat => cat.id === id);
}

module.exports = {
    getAllCategories,
    getCategoryById
}