CREATE DATABASE IF NOT EXISTS grievance_db;
USE grievance_db;

-- Users Table (Students, Admin, Committee)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin', 'committee') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grievances Table
CREATE TABLE IF NOT EXISTS grievances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, 
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    admission_no VARCHAR(50),
    roll_no VARCHAR(50),
    mobile VARCHAR(15),
    email VARCHAR(255),
    department VARCHAR(100),
    description TEXT,
    status ENUM('Pending', 'Under Review', 'Resolved') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
