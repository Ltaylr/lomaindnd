const path = require('path');

const express = require('express');

const isAuth = require('../middleware/is-auth');

const adminController = require('../controllers/admin');

const router = express.Router();

const {body} = require('express-validator');

router.get('/home', isAuth, adminController.getHome);
router.get('/add-character', isAuth, adminController.getAddCharacter);
// /admin/add-campaign => GET
router.get('/add-campaign', isAuth, adminController.getAddCampaign);

// /admin/campaigns => GET
router.get('/campaigns', isAuth, adminController.getCampaigns);

// /admin/add-campaign => POST
router.post(
    '/add-campaign',
    [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('description')
        .isLength({ min: 0, max: 2000 })
        .trim()
    ],
    isAuth,
    adminController.postAddCampaign
  );
  
router.post(
    '/add-character',
    [
      body('name')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('description')
        .isLength({ min: 0, max: 1200 })
        .trim()
    ],
    isAuth,
    adminController.postAddCampaign
  );

router.get('/edit-campaign/:campaignId', isAuth, adminController.getEditCampaign);

router.post(
    '/edit-campaign',
    [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('price').isFloat(),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    isAuth,
    adminController.postEditCampaign
  );

router.delete('/campaign/:campaignId', isAuth, adminController.deleteCampaign);

module.exports = router;
