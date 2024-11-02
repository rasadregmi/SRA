const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) return res.sendStatus(401); // No token found

  // Verify token
  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user; // Attach user information to the request
    next(); // Proceed to the next middleware or route handler
  });
};

// Export the authenticateToken function
module.exports = authenticateToken;
