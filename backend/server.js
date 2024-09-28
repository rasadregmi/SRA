require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
// Adjust the path if necessary
const cors = require('cors');
const Report = require('./models/Report');
const Review = require('./models/Review');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/report');
const reviewRoutes = require('./routes/review');
const profileRoutes = require('./routes/profile'); 
const nodemailer = require('nodemailer');
const path = require('path');
const multer = require('multer');
const morgan = require('morgan');
const authenticate = require('./middleware/authenticate'); // Import the authentication middleware

const app = express();

// Configure Multer for file uploads
const upload = multer({
    dest: 'uploads/', // Specify your upload directory
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', authRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/profile', profileRoutes); // Use the profile routes
app.use('/uploads', express.static('uploads')); // Serve uploaded files

app.post('/reviews', async (req, res) => {
    const { url, message, rating } = req.body;

    // Check if rating is within valid range (0-5)
    if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }

    const newReview = new Review({
        url,
        message,
        rating
    });

    try {
        await newReview.save();
        res.status(201).json({ message: "Review added successfully" });
    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).json({ message: "Error adding review", error: error.message });
    }
});

// Endpoint to get trust score
app.get('/trust-score/:url', async (req, res) => {
    const { url } = req.params;

    try {
        const reviews = await Review.find({ url: url });
        
        if (reviews.length === 0) {
            return res.json({ trustScorePercentage: 0 });
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const trustScorePercentage = (totalRating / (reviews.length * 5)) * 100;

        res.json({ trustScorePercentage: trustScorePercentage.toFixed(2) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to get and update profile (Protected)
app.put('/api/profile', authenticate, upload.single('photo'), async (req, res) => {
    const { username, email, phone } = req.body;
    const photoPath = req.file ? req.file.path : null;

    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { _id: req.user.userId }, // Find the profile by user ID
            { username, email, phone, photo: photoPath },
            { new: true, upsert: true }
        );

        res.json(updatedProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(`${req.method} request for '${req.url}'`);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
        },
    });
});

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send report to the cyber bureau
const sendReportToCyberBureau = async (reporting, reports) => {
    const reportDetails = reports.map((report, index) => (
        `${index + 1}. Reporting: ${report.reportingTo}\n` +
        ` - Description: ${report.description}\n` +
        ` - Date: ${report.createdAt ? report.createdAt.toLocaleDateString() : 'N/A'}\n`
    )).join('\n');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'regmirasad53@gmail.com',
        subject: `Cyber Bureau Alert - ${reporting}`,
        text: `To the Cyber Bureau,\n\nThis is to inform you that we have received five or more unique reports regarding "${reporting}". Below are the details:\n\nTotal Reports: ${reports.length}\n\nReport Details:\n${reportDetails}\n\nBest regards,\nScam Aggregator Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent to cyber bureau');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Function to send notification to the user
const sendUserNotification = async (email, reporting, description) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Thank You for Your Report Regarding ${reporting}`,
        text: `Dear User,\n\nThank you for submitting your report regarding "${reporting}".\n\nYour report has been successfully received and logged. Our team will review the details and take the necessary actions.\n\nReport Summary:\n- Reporting: ${reporting}\n- Issue: ${description}\n- Date: ${new Date().toLocaleDateString()}\n\nBest regards,\nScam Aggregator Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`User notification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending user notification email:', error);
    }
};

// API endpoint to add a report
app.post('/api/report', async (req, res) => {
    const { reportingTo, scamType, description, location, attachments } = req.body;

    try {
        const existingReport = await Report.findOne({
            reportingTo,
            scamType,
            description,
        });

        if (existingReport) {
            return res.status(400).json({ message: "You have already reported this issue." });
        }

        const newReport = new Report({
            reportingTo,
            scamType,
            description,
            location,
            attachments,
        });

        await newReport.save();

        if (location) {
            await sendUserNotification(location, reportingTo, description).catch(console.error);
        }

        const reports = await Report.aggregate([
            { $match: { reportingTo } },
            { $group: { _id: "$reportingTo", count: { $sum: 1 } } }
        ]);

        if (reports.length >= 5) {
            await sendReportToCyberBureau(reportingTo, reports).catch(console.error);
        }

        res.json({ message: "Report added successfully." });
    } catch (error) {
        console.error('Error adding report:', error);
        res.status(500).json({ message: "Error adding report", error });
    }
});

// Test email route
app.get('/test-email', (req, res) => {
    sendReportToCyberBureau("Test Reporting", []);
    sendUserNotification("lamintamang945@gmail.com", "Cyber Bureau", "Test");
    res.send("Test email sent.");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
