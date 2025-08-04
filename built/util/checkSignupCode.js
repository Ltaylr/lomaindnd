"use strict";
const fs = require('fs');
const topPath = require('../util/path');
const path = require('path');
function checkSignupCode(code) {
    const codes = fs.readFileSync(path.join(topPath, 'files', 'signupCodes.txt'), 'utf-8').split('\n');
    if (codes.includes(code))
        return true;
    return false;
}
module.exports = checkSignupCode;
//# sourceMappingURL=checkSignupCode.js.map