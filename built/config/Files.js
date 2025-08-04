"use strict";
const multer = require('multer');
var randomstring = require("randomstring");
const path = require('path');
const express = require('express');
module.exports = function (app) {
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'files/images');
        },
        filename: (req, file, cb) => {
            cb(null, randomstring.generate(8) + '_' + file.originalname);
        }
    });
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        cb(null, false);
    };
    app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')); //named image because file picker is named image
    app.use(express.static(path.join(__dirname, '../public')));
    app.use('/images', express.static(path.join(__dirname, 'images')));
    app.use('/files', express.static(path.join(__dirname, '../files')));
    app.use(express.static(path.join(__dirname, 'files', 'characters')));
};
//# sourceMappingURL=Files.js.map