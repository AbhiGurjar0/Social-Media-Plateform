const express = require('express');
const passport = require('passport');
const router = express.Router();
const { generateToken } = require("../utils/generateToken")

// Route: GET /auth/google
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route: GET /auth/google/callback
// Callback route
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/signin',
    }),
    (req, res) => {
        const token = generateToken(req.user); // your JWT logic
        res.cookie("token", token); // Set JWT cookie

        // Redirect to dashboard/home
        res.redirect('/');
    }
);


module.exports = router;
