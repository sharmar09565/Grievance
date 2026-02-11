const db = require('../config/db');

class User {
    static async create(userData) {
        const { name, email, password, role } = userData;
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT id, name, email, role FROM users');
        return rows;
    }

    // ============ UPDATE PASSWORD METHOD ============
    static async updatePassword(email, hashedPassword) {
        const [result] = await db.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, email]
        );
        return result.affectedRows;
    }
}

module.exports = User;
