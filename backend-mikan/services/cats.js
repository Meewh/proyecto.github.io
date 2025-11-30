const db = require('./bd');

async function getAllCategories() {
    try {
        const result = await db.query('SELECT * FROM categories');
        return result.rows;
    } catch (err) {
        console.error(err);
        return { error: 'Error en la base de datos' };
    }
}

async function getCategoryById(id) {
    try {
        const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return { error: 'Categoria no encontrada' };
        }
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return { error: 'Error en la base de datos' };
    }
}

module.exports = {
    getAllCategories,
    getCategoryById
}