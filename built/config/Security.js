"use strict";
const tinyCsrf = require('tiny-csrf');
const helmet = require('helmet');
const contentSecurityPolicy = require('helmet-csp');
const cookieParser = require('cookie-parser');
const crypto = require('node:crypto');
const express = require('express');
module.exports = function (app, secret) {
    app.use((req, res, next) => {
        crypto.randomBytes(32, (err, randomBytes) => {
            if (err) {
                next(err);
            }
            else {
                res.locals.cspNonce = randomBytes.toString("hex");
                next();
            }
        });
    });
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                "script-src": [
                    "'self'",
                    "'unsafe-hashes'",
                    (_req, res) => `'nonce-${res.locals.cspNonce}'`,
                    "ajax.googleapis.com",
                ]
            },
        },
    }));
    //app.use(express.json());
    app.use((req, res, next) => { console.log(req.body); next(); });
    app.use(cookieParser(secret));
    app.use(tinyCsrf(secret));
    //app.use((req, res, next) => {
    //  res.locals.csrfToken = generateToken(req, res);
    //  res.header('x-csfr-token', res.locals.csrfToken);
    //  next();
    //});
};
//# sourceMappingURL=Security.js.map