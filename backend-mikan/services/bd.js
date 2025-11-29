const { Pool } = require('pg');

class Database {
    constructor() {
        this.pool = new Pool({
            host: "localhost",
            port: "5432",
            user: "mikan",
            password: "mikan",
            database: "mikan",
        });

        this.pool.on('error', (err) => {
            console.error('Error en el pool de PostgreSQL:', err);
        });
    }

    async query(text, params) {
        try {
            const result = await this.pool.query(text, params);
            return result;
        } catch (error) {
            console.error('Error ejecutando query:', error);
            throw error;
        }
    }

    async close() {
        await this.pool.end();
    }
}

module.exports = new Database();
