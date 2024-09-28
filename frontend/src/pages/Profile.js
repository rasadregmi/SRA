import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState(''); // Add this line to define newPhone and setNewPhone
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch profile on initial load
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from localStorage
                const response = await fetch('http://localhost:5000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setProfile(data);
                } else {
                    console.error('Failed to fetch profile:', data.message);
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const toggleEditProfile = () => {
        setIsEditing(!isEditing);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from local storage
        window.location.href = '/login'; // Redirect to the login page
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const updateData = {
            username: newUsername || profile.username,
            email: newEmail || profile.email,
            phoneNumber: newPhone || profile.phoneNumber,
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });
            const data = await response.json();

            if (response.ok) {
                setProfile(data);
                setIsEditing(false);
            } else {
                setErrors({ message: data.message });
            }
        } catch (error) {
            setErrors({ message: error.message });
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>{profile.username}</h1>
                <button className="logout-button" onClick={handleLogout}>Logout</button> {/* Logout button */}
            </div>
            <div className="profile-details">
                <p><strong>First Name:</strong> {profile.firstName}</p>
                <p><strong>Last Name:</strong> {profile.lastName}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
                <button className="edit-button" onClick={toggleEditProfile}>
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            {isEditing && (
                <div className="form-container">
                    <h2>Edit Profile</h2>
                    {errors.message && <p className="error-message">{errors.message}</p>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Change Email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <button type="submit" className="edit-button">Save Changes</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Profile;
