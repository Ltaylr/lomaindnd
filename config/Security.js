const {doubleCsrf} = require('csrf-csrf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

module.exports = function(app, secret) {
        const {
      invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
      generateCsrfToken, // Use this in your routes to provide a CSRF token.
      validateRequest, // Also a convenience if you plan on making your own middleware.
      doubleCsrfProtection, // This is the default CSRF protection middleware.
    } = doubleCsrf({
      getSecret: () => secret,
      getSessionIdentifier: (req) => req.session.id // return the requests unique identifier
    });

    app.use(helmet());
    app.use(cookieParser());
    app.use(doubleCsrfProtection);
    app.use((req, res, next) => {
      res.locals.csrfToken = generateCsrfToken(req, res);
      next();
    });

}