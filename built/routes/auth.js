"use strict";
const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/auth');
const router = express.Router();
const User = require('../models/User');
const validateCode = require('../util/checkSignupCode');
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:resetToken', authController.getResetWithToken);
router.post('/reset/:resetToken', authController.postResetPassword);
router.post('/login', [
    body('email')
        .isEmail()
        .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
            if (user) {
                return true;
            }
            return Promise.reject('Incorrect Email/Password');
        });
    })
], authController.postLogin);
router.post('/signup', [
    body('signupCode')
        .custom((value) => {
        if (validateCode(value))
            return true;
        return Promise.reject('Please enter a valid code');
    }),
    body('password', 'please enter a password with atleast 10 characters')
        .isLength({ min: 10 }),
    body('password', 'must be alphanumeric')
        .isStrongPassword({ minLength: 10 })
        .trim(),
    body('confirmPassword')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            return Promise.reject('Passwords have to match');
        }
        else {
            return true;
        }
    })
        .trim(),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
            if (user) {
                return Promise.reject('Email Already in Use');
            }
        });
    })
        .normalizeEmail(),
], authController.postSignup);
router.post('/logout', authController.postLogout);
module.exports = router;
//# sourceMappingURL=auth.js.map