const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateTokens } = require('../utils/token.util');
const User = require('../models/user.model.js');
const RefreshToken = require('../models/token.model.js');


// Register a new user with hashed password
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

// Login existing user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const payload = { email: user.email, id: user._id, username: user.username };

        const tokens = generateTokens(payload);

        await RefreshToken.create({ token: tokens.refreshToken, user: user._id });

        res.json(tokens);
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

// Refresh access token
exports.refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);

    try {
        const storedToken = await RefreshToken.findOne({ token });
        if (!storedToken) return res.sendStatus(403);

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) return res.sendStatus(403);

            const payload = { email: user.email, id: user.id, username: user.username };
            const tokens = generateTokens(payload);

            await RefreshToken.deleteOne({ token }); // Remove old token
            await RefreshToken.create({ token: tokens.refreshToken, user: user.id });

            res.json(tokens);
        });
    } catch (error) {
        res.status(500).json({ error: 'Token refresh failed' });
    }
};

// Protected route
exports.protectedRoute = (req, res) => {
    res.json({
        message: `Hello ${req.user.username}, this is a protected route!`,
    });
};