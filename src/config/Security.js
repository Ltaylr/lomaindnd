//const tinyCsrf = require('tiny-csrf');
const helmet = require('helmet');
const contentSecurityPolicy = require('helmet-csp')
const cookieParser = require('cookie-parser');
const crypto = require('node:crypto');
const express = require('express');
const { csrfSync } = require("csrf-sync");

const {
  invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
  generateToken, // Use this in your routes to generate, store, and get a CSRF token.
  getTokenFromRequest, // use this to retrieve the token submitted by a user
  getTokenFromState, // The default method for retrieving a token from state.
  storeTokenInState, // The default method for storing a token in state.
  revokeToken, // Revokes/deletes a token by calling storeTokenInState(undefined)
  csrfSynchronisedProtection, // This is the default CSRF protection middleware.
} = csrfSync({
    ignoreMethods : ["GET", "HEAD", "OPTIONS"],
    getTokenFromState : (req) => {return req.session.csrfToken;},
    getTokenFromRequest: (req) => {
        
        // If the incoming request is a multipart content type
        // then get the token from the body.
        if (req.is('multipart') || req.is('application/x-www-form-urlencoded')) {
            return req.body['_csrf'];
        }
        // Otherwise use the header for all other request types
        return req.headers['x-csrf-token'];
    
    },
    
});
module.exports = function(app, secret) {
    
    app.use((req, res, next) => {
        crypto.randomBytes(32, (err, randomBytes) =>{
            if (err) {
                next(err);
            } else {
                res.locals.cspNonce = randomBytes.toString("hex");
                next();
            }
        })
    })
    
    app.use(helmet(
        {
            contentSecurityPolicy: {
                directives:{
                    "script-src": [
                        "'self'", 
                        
                        "'unsafe-hashes'",
                        (_req, res) => `'nonce-${res.locals.cspNonce}'`,
                        "ajax.googleapis.com",
                    ]
                },
            },
        }),
    );
    app.use(express.json());
    //app.use((req, res, next) =>{ console.log(req.body); next()});
    app.use(cookieParser(secret));
    //app.use(csrfSynchronisedProtection);
    //app.use((req, res, next) => {
    //  res.locals.csrfToken = generateToken(req, res);
    //  res.header('x-csfr-token', res.locals.csrfToken);
    //  next();
    //});

    module.exports = csrfSynchronisedProtection; // This is the default CSRF protection middleware.

}