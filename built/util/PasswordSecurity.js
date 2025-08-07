"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcryptjs');
const getPasswordHash = async (plaintext) => {
    const rounds = 12;
    const salt = await bcrypt.genSalt(rounds);
    return await bcrypt.hash(plaintext, salt);
};
const comparePassword = async (plaintext, hashedPassword) => {
    return await bcrypt.compare(plaintext, hashedPassword);
};
module.exports = getPasswordHash;
module.exports = comparePassword;
//# sourceMappingURL=PasswordSecurity.js.map