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
exports.getCampaign = (req, res, next) => {
    const campId = req.params.campaignId;
    console.log("HERE", campId);
    Campaign.findById(campId)
        .then(campaign => {
        res.render('campaign', {
            campaign: campaign,
            docTitle: campaign.title,
            path: '/campaign',
            isAuthenticated: req.session.isLoggedIn,
        });
    })
        .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
//# sourceMappingURL=CampaignController.js.map