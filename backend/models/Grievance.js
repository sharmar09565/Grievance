const db = require('../config/db');

class Grievance {
    static async create(data) {
        const {
            user_id, first_name, last_name, admission_no, roll_no,
            mobile, email, department, description
        } = data;

        // user_id can be null if not provided

        const [result] = await db.execute(
            `INSERT INTO grievances 
            (user_id, first_name, last_name, admission_no, roll_no, mobile, email, department, description) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id || null, first_name, last_name, admission_no, roll_no, mobile, email, department, description]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM grievances WHERE id = ?', [id]);
        return rows[0];
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM grievances ORDER BY created_at DESC');
        return rows;
    }

    static async updateStatus(id, status) {
        const [result] = await db.execute(
            'UPDATE grievances SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows;
    }
}

module.exports = Grievance;
