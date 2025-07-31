const campaign = require('../models/CampaignModel');
const { validationResult } = require('express-validator');

exports.getAddCampaign = (req, res, next) => {
  
  res.render('admin/edit-campaign', {
    pageTitle: 'Add campaign',
    path: '/admin/add-campaign',
    editing: false,
    csrfToken: req.csrfToken(),
    errorMessage: null,
    hasError: false, 
    validationErrors: []
  });
};

exports.postAddCampaign = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const description = req.body.description;

  const errors = validationResult(req);
  if (!image){
    return res.status(422).render('admin/edit-campaign', {
      pageTitle: 'Add Campaign',
      path: '/admin/add-campaign',
      editing: false,
      hasError: true,
      campaign: {
        title: title,
        description: description
      },
      csrfToken: req.csrfToken(),
      errorMessage: 'attached file is not an image',
      validationErrors: errors.array()
    });
  }
  const imageUrl = image.path;
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-campaign', {
      pageTitle: 'Add campaign',
      path: '/admin/add-campaign',
      editing: false,
      hasError: true,
      campaign: {
        title: title,
        price: price,
        description: description
      },
      csrfToken: req.csrfToken(),
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const campaign = new campaign({
    title: title,
    description: description,
    imageURL: imageUrl,
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
        pageTitle: 'Edit campaign',
        path: '/admin/edit-campaign',
        editing: editMode,
        campaign: campaign,
        hasError: false,
        csrfToken: req.csrfToken(),
        errorMessage: null,
        validationErrors: []
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
      pageTitle: 'Edit campaign',
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
      if(campaign.userId.toString() !== req.user._id.toString())
      {
        return res.redirect('/');
      }
      campaign.title = updatedTitle;
      campaign.price = updatedPrice;
      campaign.description = updatedDesc;
      if(updatedImage){
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
  campaign.find({userId: req.user._id})
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(campaigns => {
      console.log(campaigns);
      res.render('admin/campaigns', {
        prods: campaigns,
        pageTitle: 'Admin campaigns',
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
  campaign.deleteOne({_id: prodId, userId: req.user._id})
    .then(() => {
      console.log('DESTROYED campaign');
      res.status(200).json({message: 'Success!'});
    })
    .catch(err => {
      res.status(500).json({message: 'Deletion Failed'});
    });
};
