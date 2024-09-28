import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Authform.css';

export default function AuthForm() {
  // Initial form state
  const initialFormState = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const navigate = useNavigate(); // Hook for navigation

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage(''); // Reset error message on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for signup
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const endpoint = isLogin
      ? 'http://localhost:5000/api/login'
      : 'http://localhost:5000/api/signup';

    setLoading(true); // Start loading

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (response.ok) {
        if (isLogin) {
          // Store token if login is successful
          localStorage.setItem('token', data.token);
          navigate('/profile'); // Replace '/profile' with your actual profile route
        } else {
          alert('Signed up successfully!');
        }
      } else {
        setErrorMessage(data.message || "An error occurred."); // Handle errors
      }
      
      setFormData(initialFormState); // Reset form data
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage("An error occurred while processing your request.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='container'>
        <div className='form-container'>
          <div className='form-toggle'>
            <button
              type='button'
              className={isLogin ? 'active' : ''}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              type='button'
              className={!isLogin ? 'active' : ''}
              onClick={() => setIsLogin(false)}
            >
              SignUp
            </button>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Error Message Display */}

          {isLogin ? (
            <div className='form'>
              <h1>Login</h1>
              <input
                type='tel'
                name='phoneNumber'
                placeholder='Phone Number'
                pattern='[0-9]{10}'
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              <input
                type='password'
                name='password'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type='submit' disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            </div>
          ) : (
            <div className='form'>
              <h1>SignUp</h1>
              <input
                type='text'
                name='firstName'
                placeholder='First Name'
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type='text'
                name='lastName'
                placeholder='Last Name'
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <input
                type='tel'
                name='phoneNumber'
                placeholder='Phone Number'
                pattern='[0-9]{10}'
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              <input
                type='email'
                name='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type='password'
                name='password'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type='password'
                name='confirmPassword'
                placeholder='Confirm Password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type='submit' disabled={loading}>{loading ? 'Signing up...' : 'SignUp'}</button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
