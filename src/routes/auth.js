const express = require('express');

const { check, body  } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

const User = require('../models/User');

const validateCode = require('../util/checkSignupCode');

const multer = require('multer');

const csrfSynchronisedProtection = require('../config/Security');

router.get('/login', csrfSynchronisedProtection, authController.getLogin);

router.get('/signup', csrfSynchronisedProtection, authController.getSignup);

router.get('/reset', csrfSynchronisedProtection,authController.getReset);

router.post('/reset', csrfSynchronisedProtection, authController.postReset);

router.get('/reset/:resetToken', authController.getResetWithToken);

router.post('/reset/:resetToken', csrfSynchronisedProtection, authController.postResetPassword);

router.post('/login', 
    [
        body('email')
        .isEmail()
        .custom((value, {req}) => {
        return User.findOne({email: value}).then(user => {
            if(user)
            {
                return true;
            }
            return Promise.reject('Incorrect Email/Password');
        })})
        
    ],
    csrfSynchronisedProtection,
    authController.postLogin);

router.post('/signup', [
    body('signupCode')
    .custom((value)=>{
        if(validateCode(value)) return true;
        return Promise.reject('Please enter a valid code');
       
    }),
    body('password', 'please enter a password with atleast 10 characters')
    .isLength({min: 10}),
    body('password', 'must be alphanumeric')
    .isStrongPassword({minLength: 10})
    .trim(),
    body('confirmPassword')
    .custom((value, {req}) => {
        if(value !== req.body.password)
        {
            return Promise.reject('Passwords have to match');
        }
        else{
            return true;
        }
    })
    .trim(),
    body('email')
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
    
    ]
    ,csrfSynchronisedProtection,authController.postSignup);

router.post('/logout', 
    (req, res, next)=>{
        console.log("hitting logout route...");
        next();
    },
    csrfSynchronisedProtection, authController.postLogout);

module.exports = router;   