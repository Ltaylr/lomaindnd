const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/CampaignController');


router.get('/campaigns', campaignController.getCampaigns);

router.get('/campaign/:campaignId', campaignController.getCampaign);

router.get('/campaign/gallery/:campaignId', campaignController.getGallery);

router.get('/campaign/journal/:campaignId', campaignController.getJournal);

router.get('/campaign/characters/:campaignId', campaignController.getCharacters);

router.get('/campaign/locations/:campaignId', campaignController.getLocations);

router.get('/campaigns/data',
    (req, res, next) => {
        res.setHeader("access-control-allow-origin", '*');
        next();
    }
    ,campaignController.sendCampaigns);

router.get('/campaign/data/:campaignId',
    (req, res, next) => {
        res.setHeader("access-control-allow-origin", '*');
        next();
    }
    ,campaignController.sendCampaign);

router.get('/campaign/data/images/:campaignId',
    (req, res, next) => {
        res.setHeader("access-control-allow-origin", '*');
        next();
    }
    ,campaignController.sendGallery);

module.exports = router;