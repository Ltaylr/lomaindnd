"use strict";
function userRequired(req, res, next) {
    if (req.user) {
        next();
    }
    else {
        next(new Error('Not Logged In'));
    }
}
module.exports = userRequired;
//# sourceMappingURL=userCheck.js.map