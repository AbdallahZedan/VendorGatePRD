const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const validator = require('../middleware/validator');

const router = express.Router();

// POST /auth/psw_reset_req
router.post('/psw_reset_req', 
    validator.pswResetReq,
    authController.postPswResetReq);

// POST /auth/psw_reset
router.post('/psw_reset', 
    validator.pswReset,
    authController.postPswReset);

// POST /auth/login
router.post('/login', 
    validator.login,
    authController.postLogin);

    // POST /auth/submit_otp
    router.post('/submit_otp', 
        validator.otp,
        authController.postSubmitOtp);

module.exports = router;