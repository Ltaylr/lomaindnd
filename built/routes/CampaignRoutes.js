"use strict";
const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/CampaignController');
router.get('/campaigns', campaignController.getCampaigns);
router.get('/campaign/:campaignId', campaignController.getCampaign);
module.exports = router;
//# sourceMappingURL=CampaignRoutes.js.map