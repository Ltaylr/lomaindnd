"use strict";
const path = require('path');
const express = require('express');
const isAuth = require('../middleware/is-auth');
const adminController = require('../controllers/admin');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image')
            cb(null, path.join('./public/images'));
        if (file.fieldname === 'pdfFile')
            cb(null, './public/chars');
    },
    filename: (req, file, cb) => {
        cb(null, randomstring.generate(8) + '_' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    console.log(file);
    if (file.fieldname === 'image') {
        if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            console.log("here");
            cb(null, true);
        }
        cb(null, false);
    }
    else {
        if (file.fieldname === 'pdfFile') {
            console.log("here2");
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            }
            cb(null, false);
        }
    }
};
const singleImageUpload = multer({ storage: fileStorage, limits: { fileSize: '10mb' }, fileFilter: fileFilter });
//const multiUpload = multer({storage: fileStorage, limits:{ fileSize: '10mb'}, fileFilter: fileFilter});
router.get('/home', isAuth, adminController.getHome);
router.get('/add-character', isAuth, adminController.getAddCharacter);
// /admin/add-campaign => GET
router.get('/add-campaign', isAuth, adminController.getAddCampaign);
// /admin/campaigns => GET
router.get('/campaigns', isAuth, adminController.getCampaigns);
// /admin/add-campaign => POST
router.post('/add-campaign', [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body('description')
        .isLength({ min: 0, max: 2000 })
        .trim()
], isAuth, singleImageUpload.single('image'), adminController.postAddCampaign);
router.post('/add-character', [
    body('name')
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body('description')
        .isLength({ min: 0, max: 1200 })
        .trim()
], isAuth, 
//multiUpload.fields([ {name: 'pdfFile', maxCount: 1}, {name:'image', maxCount: 1}]),
adminController.postAddCampaign);
router.get('/edit-campaign/:campaignId', isAuth, adminController.getEditCampaign);
router.post('/edit-campaign', [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
], isAuth, adminController.postEditCampaign);
router.delete('/campaign/:campaignId', isAuth, adminController.deleteCampaign);
module.exports = router;
//# sourceMappingURL=admin.js.map