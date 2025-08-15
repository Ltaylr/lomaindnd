"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    isAdmin: {
        type: Boolean,
        require: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
});
module.exports = mongoose.model('User', userSchema);
//# sourceMappingURL=User.js.map