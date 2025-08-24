const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/CampaignController');


router.get('/campaigns', campaignController.getCampaigns);

router.get('/campaign/:campaignId', campaignController.getCampaign);

router.get('/campaign/gallery/:campaignId', campaignController.getGallery);

router.get('/campaign/journal/:campaignId', campaignController.getJournal);

router.get('/campaign/characters/:campaignId', campaignController.getCharacters);

router.get('/campaign/locations/:campaignId', campaignController.getLocations);

module.exports = router;