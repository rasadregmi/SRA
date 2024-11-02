const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import JWT
const User = require('../models/user');
const authenticate = require('../middleware/authenticate'); // Import authentication middleware
const multer = require('multer');
const path = require('path');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use an environment variable for security

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to store uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
    }
});

const upload = multer({ storage });

// Signup route
router.post('/signup', async (req, res) => {
    const { firstName, lastName, phoneNumber, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        firstName,
        lastName,
        phoneNumber,
        email,
        password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
});

// Login route
router.post('/login', async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Send the token and user data to the client
        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                photo: user.photo
            } 
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile (requires authentication)
router.get('/profile', authenticate, async (req, res) => {
   try {
       const user = await User.findById(req.user.userId).select('-password'); // Fetch user without password
       if (!user) {
           return res.status(404).json({ message: 'User not found' });
       }
       res.status(200).json(user); // Ensure the phone number is included here
   } catch (error) {
       res.status(500).json({ message: 'Server error' });
   }
});

// Update user profile (requires authentication)
router.put('/profile', authenticate, upload.single('photo'), async (req, res) => {
   const { firstName, lastName, email, phone } = req.body;
   const photo = req.file ? req.file.path : undefined; // Get the path of the uploaded file

   try {
       const updatedUser = await User.findByIdAndUpdate(
           req.user.userId,
           { firstName, lastName, email, phone, photo }, // Ensure all fields are updated
           { new: true, runValidators: true }
       ).select('-password'); // Return updated user without password

       if (!updatedUser) {
           return res.status(404).json({ message: 'User not found' });
       }

       res.status(200).json(updatedUser);
   } catch (error) {
       res.status(500).json({ message: 'Server error' });
   }
});


module.exports = router;
