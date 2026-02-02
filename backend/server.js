const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/grievances', grievanceRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('<h1>Grievance System Backend is Running</h1>');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
