"use strict";
const fs = require('fs');
const topPath = require('../util/path');
const path = require('path');
const Campaign = require("../models/CampaignModel");
exports.getCampaigns = async (req, res, next) => {
    const campaigns = await Campaign.find({});
    res.render('campaigns', {
        docTitle: 'Campaigns',
        campaigns: campaigns
    });
};
//# sourceMappingURL=CampaignController.js.map