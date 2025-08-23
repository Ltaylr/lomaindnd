const Campaign = require('../models/CampaignModel');
const Character = require('../models/Character');
const GalleryImage = require('../models/GalleryImage');
const path = require('path');

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
  const image = req.file;
  const description = req.body.description;
  console.log("HERE");
  const errors = validationResult(req);
  //console.log(image.path);
  const imageUrl = (!image) ? 'd20Large.png' : path.basename(image.path);
  console.log(imageUrl);
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    throw new Error('validation error')
  }
  Campaign.findById({$eq:campaignId} )
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

  
  Campaign.findById({_id: campaignId})
    .then(campaign => {
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


exports.getCharacters = (req, res, next) => {
  
  Character.find({})
    .then(characters => {
      
      res.render('admin/characters', {
        characters: characters,
        docTitle: 'Admin characters',
        path: '/admin/characters',
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

exports.deleteCharacter = (req, res, next) => {
  const charId = req.params.charId;
  Character.deleteOne({_id: charId})
    .then(() => {
      console.log('DESTROYED Character');
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
  const image = req.files.image;
  const level = req.body.levels;
  const pdfFile = req.files.pdfFile;
  const description = req.body.description;
  const errors = validationResult(req);
  const imageUrl = (!image) ? 'd20Large.png' : path.basename(image[0].path);
  const pdfUrl = path.basename(pdfFile[0].path);
  if(!pdfFile){
    return res.status(422).render('admin/add-character', {
      docTitle: 'Add character',
      path: '/admin/add-character',
      editing: false,
      hasError: true,
      character: {
        name: name,
        description: description,
        level: level
      },
      csrfToken: req.csrfToken(),
      errorMessage: errorMessage,
      isAuthenticated: req.session.isLoggedIn,
      validationErrors: errors.array()
    });
  }

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return return422(errors.array()[0].msg);
  }

  const character = new Character({
    name: name,
    level:Number(level),
    isPregen: true,
    description: description,
    imageUrl: imageUrl,
    hasCharacterSheet: true,
    isPlayerChar: false,
    characterSheetUrl: pdfUrl,
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

exports.postAddImageToCampaign = (req,res,next) => {
  const campId = req.params.campaignId;
  console.log(req.body);
  const desc = req.body.description;
  const image = req.file;
  const errors = validationResult(req);
  const imageUrl = path.basename(image.path);

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

  
  Campaign.findById({_id: campId})
    .then(campaign => {
      if(campaign.userId.toString() !== req.session.user._id.toString())
      {
        return res.redirect('/');
      }
      const image = new GalleryImage({
        imageUrl: imageUrl,
        description: desc,
        userId: req.session.user,
        campaignId: campaign
      })
      const res = image.save();
      campaign.imageCollection.push(image);
      return campaign.save().then(result => {
        console.log('UPDATED campaign!');
        
      });
    })
    .then(result => {
      res.status(200).send();
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

