const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDb() {
    console.log('Initializing database...');
    try {
        // Connect to MySQL server (without selecting DB)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        // Read Schema
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split queries (simple semi-colon split, requires proper SQL formatting)
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);

        for (const statement of statements) {
            await connection.query(statement);
            console.log('Executed SQL statement.');
        }

        console.log('Database initialized successfully!');

        // Seed an admin user for testing?
        await connection.changeUser({ database: process.env.DB_NAME || 'grievance_db' });
        // Optional: Check if admin exists, if not create

        await connection.end();
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

initDb();
