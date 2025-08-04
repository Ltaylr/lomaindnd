"use strict";
const tinyCsrf = require('tiny-csrf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
module.exports = function (app, secret) {
    app.use(helmet());
    app.use(cookieParser(secret));
    app.use(tinyCsrf(secret));
    //app.use((req, res, next) => {
    //  res.locals.csrfToken = generateToken(req, res);
    //  res.header('x-csfr-token', res.locals.csrfToken);
    //  next();
    //});
};
//# sourceMappingURL=Security.js.map