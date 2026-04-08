const jwt = require('jsonwebtoken');
const Citizen = require('../models/Citizen');
const Politician = require('../models/Politician');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.role === 'politician') {
        req.user = await Politician.findById(decoded.id).select('-password');
      } else {
        req.user = await Citizen.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOrPolitician = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'politician')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as Admin or Politician' });
  }
};

module.exports = { protect, adminOrPolitician };
