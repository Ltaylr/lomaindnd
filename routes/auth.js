const express = require('express');

const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

const User = require('../models/User');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:resetToken', authController.getResetWithToken);

router.post('/reset/:resetToken', authController.postResetPassword);

router.post('/login', 
    [
        body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
        body('password', 'Please enter a valid password')
        .isLength({min: 5})
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin);

router.post('/signup', [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, {req}) => {
        return User.findOne({email: value}).then(user => {
            if(user)
            {
              return Promise.reject('Email Already in Use');
            }
        });
    })
    .normalizeEmail(),
    body('password', 'please enter a password with atleast 6 characters and letters and numbers only')
    .isLength({min: 6})
    .isAlphanumeric()
    .trim(),
    body('confirmPassword')
    .custom((value, {req}) => {
        if(value !== req.body.password)
        {
            throw new Error('Passwords have to match')
        }
    })
    .trim()
    ]
    ,authController.postSignup);

router.post('/logout', authController.postLogout);

module.exports = router;   