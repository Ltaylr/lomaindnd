const path = require('path');

const express = require('express');

const isAuth = require('../middleware/is-auth');

const adminController = require('../controllers/admin');

const router = express.Router();

const {body, param} = require('express-validator');

const csrfSynchronisedProtection = require('../config/Security');

const multer = require('multer');

const topPath = require('../util/path');

var randomstring = require("randomstring");

const fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        console.log("here");
        if(file.fieldname ==='galleryImage') cb(null,  path.join(topPath, '../public', 'images'));
        if(file.fieldname ==='image') cb(null,  path.join(topPath, '../public', 'images'));
        if(file.fieldname ==='pdfFile') cb(null, path.join(topPath, '../public', 'chars'));
      },
      filename: (req, file, cb) => {
        cb(null, randomstring.generate(8) + '_'  + file.originalname);
      }
    });
     
    const fileFilter = (req, file, cb) => {
      if(file.fieldname === 'image' || file.fieldname ==='galleryImage'){
        if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp'){
          cb(null, true);
        }
        else{
          cb(null, false);
        }
      }
      else{
      if(file.fieldname === 'pdfFile')
      {
        if(file.mimetype === 'application/pdf'){
         cb(null, true);
        }
        else{
          cb(null, false);
        }
      }
    }
    }
const singleImageUpload = multer({storage: fileStorage, limits:{ fileSize: '10mb'}, fileFilter: fileFilter});
const multiUpload = multer({storage: fileStorage, limits:{ fileSize: '10mb'}, fileFilter: fileFilter});

router.get('/home', 
  isAuth, 
  csrfSynchronisedProtection, 
  adminController.getHome);

router.get('/add-character', 
  isAuth, 
  csrfSynchronisedProtection, 
  adminController.getAddCharacter);
// /admin/add-campaign => GET
router.get('/add-campaign', 
  csrfSynchronisedProtection, 
  isAuth, 
  adminController.getAddCampaign);

// /admin/campaigns => GET
router.get('/campaigns', 
  csrfSynchronisedProtection, 
  isAuth, 
  adminController.getCampaigns);

router.get('/characters', 
  csrfSynchronisedProtection, 
  isAuth, 
  adminController.getCharacters);

// /admin/add-campaign => POST
router.post(
    '/add-campaign',
    singleImageUpload.single('image'),
    [
      body('title')
      .isString(),
      body('title')
      .isLength({ min: 3 })
      .trim(),
      body('description')
        .isLength({ min: 0, max: 2000 })
        .trim()
    ],
    isAuth,
    csrfSynchronisedProtection,
    adminController.postAddCampaign
  );
  
router.post(
    '/add-character',
    multiUpload
    .fields([ 
      {name: 'pdfFile', maxCount: 1}, 
      {name:'image', maxCount: 1}]),
    [
      body('name')
        .isString(),
        body('name')
        .isLength({ min: 3 })
        .trim(),
      body('description')
        .isLength({ min: 0, max: 1200 })
        .trim()
    ],
    isAuth,
    csrfSynchronisedProtection,
    adminController.postAddCharacter
  );

router.get('/edit-campaign/:campaignId', 
  [param('campaignId').isString()],
  isAuth,
  csrfSynchronisedProtection, 
  adminController.getEditCampaign);

router.post(
    '/edit-campaign',
    
    singleImageUpload.single('image'),
    
    [
      body('title')
        .isString(),
        body('title')
        .isLength({ min: 3 })
        .trim(),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    isAuth,
    csrfSynchronisedProtection,
    adminController.postEditCampaign
  );

router.delete('/campaign/:campaignId',
  [param('campaignId').isString()], 
  isAuth, 
  csrfSynchronisedProtection, 
  adminController.deleteCampaign);

router.delete('/character/:charId', 
isAuth, 
csrfSynchronisedProtection, 
adminController.deleteCharacter);

router.post(
    '/campaign/imageUpload/:campaignId',
    
    singleImageUpload.single('galleryImage'),
    
    [
      body('description')
        .isLength({ min: 0, max: 400 })
        .trim()
    ],
    isAuth,
    csrfSynchronisedProtection,
    adminController.postAddImageToCampaign
  );

module.exports = router;
