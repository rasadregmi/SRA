// Review.js
import React, { useState } from 'react'; 
import { FaStar } from 'react-icons/fa';
import './Review.css';

export default function Review() {
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: websiteUrl,
                    message,
                    rating,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Review submitted successfully!');
                // Reset form fields
                setWebsiteUrl('');
                setMessage('');
                setRating(null);
            } else {
                alert('Error submitting review: ' + result.message);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <div className="container1">
                <h1>Website Review</h1>
                <div className="web">
                    <input 
                        type="text" 
                        placeholder="Enter website URL" 
                        value={websiteUrl} 
                        onChange={(e) => setWebsiteUrl(e.target.value)} 
                        required 
                        className="url-input" 
                    />
                </div>
                <div>
                    <textarea
                        name="message"
                        placeholder="Your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="message"
                    ></textarea>
                </div>
                <div className="rating-container">
                    {[...Array(5)].map((star, index) => {
                        const currentRating = index + 1;
                        return (
                            <label key={index}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={currentRating}
                                    onClick={() => setRating(currentRating)}
                                />
                                <FaStar
                                    className="star"
                                    size={50}
                                    color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                    onMouseEnter={() => setHover(currentRating)}
                                    onMouseLeave={() => setHover(null)}
                                />
                            </label>
                        );
                    })}
                </div>
                <button type="submit" className="btn">Submit</button>
            </div>
        </form>
    );
}
