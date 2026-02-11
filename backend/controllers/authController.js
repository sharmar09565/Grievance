const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Store OTPs in memory (in production, use Redis or database)
const otpStore = {};

// Generate random OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate reset token
function generateResetToken() {
    return jwt.sign(
        { timestamp: Date.now() },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '10m' }
    );
}

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email and password' });
        }

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword, role: role || 'student' });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ============ FORGOT PASSWORD METHODS ============

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide email' });
        }

        // Check if user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP and reset token
        const otp = generateOtp();
        const resetToken = generateResetToken();

        // Store OTP in memory (expires in 5 minutes)
        otpStore[email] = {
            otp,
            resetToken,
            expiresAt: Date.now() + 5 * 60 * 1000
        };

        // In production, send OTP via email
        console.log(`OTP for ${email}: ${otp}`);

        res.json({ 
            message: 'OTP sent to your email',
            resetToken // For development, included in response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp, resetToken } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Please provide email and OTP' });
        }

        // Check if OTP exists and is valid
        const otpData = otpStore[email];
        if (!otpData) {
            return res.status(400).json({ message: 'OTP not found or expired' });
        }

        if (Date.now() > otpData.expiresAt) {
            delete otpStore[email];
            return res.status(400).json({ message: 'OTP expired' });
        }

        if (otpData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide email' });
        }

        // Check if user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate new OTP and reset token
        const otp = generateOtp();
        const resetToken = generateResetToken();

        // Store OTP in memory (expires in 5 minutes)
        otpStore[email] = {
            otp,
            resetToken,
            expiresAt: Date.now() + 5 * 60 * 1000
        };

        // In production, send OTP via email
        console.log(`OTP resent for ${email}: ${otp}`);

        res.json({ 
            message: 'OTP resent to your email',
            resetToken // For development, included in response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Please provide email and new password' });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        await User.updatePassword(email, hashedPassword);

        // Clear OTP
        delete otpStore[email];

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
