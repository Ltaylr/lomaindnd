"use strict";
module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.redirect('/auth/login');
    }
    next();
};
//# sourceMappingURL=is-auth.js.map