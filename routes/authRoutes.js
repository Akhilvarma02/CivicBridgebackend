const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOTP } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);

module.exports = router;
