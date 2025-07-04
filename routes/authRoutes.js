const express = require('express');
const router = express.Router();
const { loginAdmin,sendOtpToAdmin, resetPasswordWithOtp} = require('../controllers/authControllers');

router.post('/login', loginAdmin);
router.post('/forgot-password',sendOtpToAdmin);
router.post('/reset-password',resetPasswordWithOtp);

module.exports = router;
