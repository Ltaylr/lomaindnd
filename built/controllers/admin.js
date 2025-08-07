"use strict";
const Campaign = require('../models/CampaignModel');
const { validationResult } = require('express-validator');
exports.getHome = (req, res, next) => {
    res.render('admin/admin-home', { docTitle: 'Admin', path: '/admin/admin-home' });
};
exports.getAddCampaign = (req, res, next) => {
    res.render('admin/edit-campaign', {
        docTitle: 'Add campaign',
        path: '/admin/add-campaign',
        editing: false,
        csrfToken: req.csrfToken(),
        errorMessage: null,
        hasError: false,
        isAuthenticated: req.session.isLoggedIn,
        validationErrors: []
    });
};
function return422(errorMessage) {
    return res.status(422).render('admin/edit-campaign', {
        docTitle: 'Add Campaign',
        path: '/admin/add-campaign',
        editing: false,
        hasError: true,
        campaign: {
            title: title,
            description: description
        },
        csrfToken: req.csrfToken(),
        errorMessage: errorMessage,
        isAuthenticated: req.session.isLoggedIn,
        validationErrors: errors.array()
    });
}
exports.postAddCampaign = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const errors = validationResult(req);
    if (!image) {
        return return422('attached file is not an image');
    }
    const imageUrl = image.path;
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return return422(errors.array()[0].msg);
    }
    const campaign = new Campaign({
        title: title,
        description: description,
        imageUrl: imageUrl,
        userId: req.session.user
    });
    campaign
        .save()
        .then(result => {
        // console.log(result);
        console.log('Created campaign');
        res.redirect('/admin/campaigns');
    })
        .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
exports.getEditCampaign = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const campaignId = req.params.campaignId;
    campaign.findById(campaignId)
        .then(campaign => {
        if (!campaign) {
            return res.redirect('/');
        }
        res.render('admin/edit-campaign', {
            docTitle: 'Edit campaign',
            path: '/admin/edit-campaign',
            editing: editMode,
            campaign: campaign,
            hasError: false,
            csrfToken: req.csrfToken(),
            errorMessage: null,
            validationErrors: [],
            isAuthenticated: req.session.isLoggedIn
        });
    })
        .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
exports.postEditCampaign = (req, res, next) => {
    const campaignId = req.body.campaignId;
    const updatedTitle = req.body.title;
    const updatedImage = req.file;
    const updatedDesc = req.body.description;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-campaign', {
            docTitle: 'Edit campaign',
            path: '/admin/edit-campaign',
            editing: true,
            hasError: true,
            campaign: {
                title: updatedTitle,
                description: updatedDesc,
                _id: prodId
            },
            csrfToken: req.csrfToken(),
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    campaign.findById(campaignId)
        .then(campaign => {
        if (campaign.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        campaign.title = updatedTitle;
        campaign.price = updatedPrice;
        campaign.description = updatedDesc;
        if (updatedImage) {
            campaign.imageUrl = updatedImage.path;
        }
        return campaign.save().then(result => {
            console.log('UPDATED campaign!');
            res.redirect('/admin/campaigns');
        });
    })
        .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
exports.getCampaigns = (req, res, next) => {
    console.log(req.session.user._id);
    Campaign.find({ userId: req.session.user._id })
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(campaigns => {
        console.log(campaigns);
        res.render('admin/campaigns', {
            campaigns: campaigns,
            docTitle: 'Admin campaigns',
            path: '/admin/campaigns',
            csrfToken: req.csrfToken(),
            isAuthenticated: req.session.isLoggedIn
        });
    })
        .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
exports.deleteCampaign = (req, res, next) => {
    const prodId = req.params.campaignId;
    campaign.deleteOne({ _id: prodId, userId: req.user._id })
        .then(() => {
        console.log('DESTROYED campaign');
        res.status(200).json({ message: 'Success!' });
    })
        .catch(err => {
        res.status(500).json({ message: 'Deletion Failed' });
    });
};
exports.getAddCharacter = (req, res, next) => {
    console.log('here');
    res.render('admin/add-character', {
        docTitle: 'Add character',
        path: '/admin/add-character',
        editing: false,
        csrfToken: req.csrfToken(),
        errorMessage: null,
        hasError: false,
        isAuthenticated: req.session.isLoggedIn,
        validationErrors: []
    });
};
//# sourceMappingURL=admin.js.map