const multer = require('multer');
var randomstring = require("randomstring");
const path = require('path');
const express = require('express');
const fs = require('fs');
const topPath = require('../util/path');

module.exports = function(app) {
    const fileStorage = multer.diskStorage({
          destination: (req, file, cb) => {
            if(file.fieldname ==='image') cb(null,  path.join('./public/images'));
            if(file.fieldname ==='pdfFile') cb(null, './public/chars');
          },
          filename: (req, file, cb) => {
            cb(null, randomstring.generate(8) + '_'  + file.originalname);
          }
        });
         
        const fileFilter = (req, file, cb) => {
          console.log(file);
          if(file.fieldname === 'image'){
            if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
              console.log("here");
              cb(null, true);
            }
            cb(null, false);
          }
          else{
          if(file.fieldname === 'pdfFile')
          {
            
            if(file.mimetype === 'application/pdf'){
             cb(null, true);
            }
            cb(null, false);
          }
        }
        }
    

    app.use((req, res, next) => {
      console.log(req.path);
      next();
    })
    app.use(express.static(path.join(topPath, '../public')));

    

}