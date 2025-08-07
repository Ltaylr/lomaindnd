const Campaign = require('../models/CampaignModel');
const { validationResult } = require('express-validator');

exports.getHome = (req, res, next) => {
  res.render('admin/admin-home', 
    { docTitle: 'Admin', path: '/admin/admin-home'});
}
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

function return422(req, res, errorMessage, title, description, errors){
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
  const image = req.body.image;
  const description = req.body.description;
  console.log("HERE");
  const errors = validationResult(req);
  if (!image){
    return return422(req, res, 'attached file is not an image', title, description, errors);
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
  console.log(req.params)
  const campaignId = req.params.campaignId;
  Campaign.findById(campaignId)
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
        isAuthenticated: req.session.isLoggedIn,
        nonce: res.locals.cspNonce
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
        _id: campaignId
      },
      csrfToken: req.csrfToken(),
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  
  Campaign.findById(campaignId)
    .then(campaign => {
      console.log(req);
      if(campaign.userId.toString() !== req.session.user._id.toString())
      {
        return res.redirect('/');
      }
      campaign.title = updatedTitle;
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
  
  Campaign.find({userId: req.session.user._id})
    .then(campaigns => {
      
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
  const campId = req.params.campaignId;
  Campaign.deleteOne({_id: campId, userId: req.session.user._id})
    .then(() => {
      console.log('DESTROYED campaign');
      res.status(200).send();
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
}

exports.postAddCharacter = (req, res, next) => {
  const name = req.body.name;
  const image = req.file;
  const level = req.level;
  const pdfFile = req.pdfFile;
  const description = req.body.description;

  const errors = validationResult(req);
  if (!image){
    return return422('attached file is not an image');
  }
  const imageUrl = image.path;
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return return422(errors.array()[0].msg);
  }

  const character = new Character({
    name: name,
    level:level,
    isPregen: true,
    description: description,
    imageUrl: imageUrl,
    pdfFile: pdfFile,
    userId: req.session.user
  });
  character
    .save()
    .then(result => {
      // console.log(result);
      console.log('Added Character');
      res.redirect('/admin/characters');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
