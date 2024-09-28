const mongoose = require('mongoose');

// Define a schema and model for Profile
const profileSchema = new mongoose.Schema({
    username: String,
    email: String,
    phone: String,
    photo: String,
});

const Profile = mongoose.model('Profile', profileSchema);