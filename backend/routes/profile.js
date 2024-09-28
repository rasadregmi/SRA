const express = require('express');
const User = require('../models/user');
const authenticate = require('../middleware/authenticate'); // Ensure you have this middleware for authentication
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename file to prevent collisions
    },
});

const upload = multer({ storage });

// Get user profile
// Backend route to get user profile (e.g., in auth.js)
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password'); // Ensure phone number is included
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Update user profile
router.put('/profile', [authenticate, upload.single('photo')], async (req, res) => {
    const { username, email, phone } = req.body;
    const photoPath = req.file ? req.file.path : null; // Get the path of the uploaded file

    try {
        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { username, email, phone, photo: photoPath }, // Update fields
            { new: true, runValidators: true } // Return updated document
        ).select('-password'); // Exclude password from response

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

module.exports = router;
