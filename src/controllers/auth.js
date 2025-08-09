const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator');



var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "75c634a82f9a19",
    pass: "ae0c1966756c77"
  }
});

exports.getLogin = (req, res, next) => {
  let errorMsg = req.flash('error');
    if(errorMsg.length > 0)
    {
      errorMsg = errorMsg[0];
    }
    else{
      errorMsg = null;
    }
    
  res.render('auth/login', {

    path: '/login',
    docTitle: 'Login',
    isAuthenticated: false,
    errorMessage: errorMsg,
    csrfToken: req.csrfToken(),
    oldInput: {email: '', password: ''},
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let errorMsg = req.flash('error');
    if(errorMsg.length > 0)
    {
      errorMsg = errorMsg[0];
    }
    else{
      errorMsg = null;
    }
  
  
  res.render('auth/signup',{
    
    path:'signup',
    docTitle: 'Signup',
    isAuthenticated: false,
    csrfToken: req.csrfToken(),
    errorMessage: errorMsg,
    oldInput: {email: '', password: '', confirmPassword: ''},
    validationErrors: []
  })
}

exports.postLogin = (req, res, next) => {

  const email = req.body.email;
  const pass = req.body.password;
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).render('auth/login',{
      path:'login',
      docTitle: 'Login',
      isAuthenticated: false,
      csrfToken: req.csrfToken(),
      errorMessage: errors.array()[0].msg,
      oldInput: {email: email, password: pass},
      validationErrors: errors.array()
    });
  }

  User.findOne({email: email})
  .then(userDoc => {
    
    if(!userDoc)
    {
      req.flash('error', 'Incorrect Email/Password');
      return res.redirect('/auth/login');
    }
    bcrypt.compare(pass, userDoc.password)
    .then(doMatch => {
      if(doMatch)
      {
        req.session.isLoggedIn = true;
        req.session.user = userDoc;
        return req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
      }
      req.flash('error', 'Incorrect Email/Password');
      res.redirect('/auth/login');
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  })
  .catch(err => console.log(err));
    
};

exports.getReset = (req, res, next) =>
{
  let errorMsg = req.flash('error');
    if(errorMsg.length > 0)
    {
      errorMsg = errorMsg[0];
    }
    else{
      errorMsg = null;
    }
  res.render('auth/reset', {
    path: '/reset',
    docTitle: 'Reset Password',
    isAuthenticated: false,
    errorMessage: errorMsg,
    csrfToken: req.csrfToken()
  });
}

exports.getResetWithToken = (req, res, next) =>
{
  const token = req.params.resetToken;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user =>
  {
    let errorMsg = req.flash('error');
    if(errorMsg.length > 0)
    {
      errorMsg = errorMsg[0];
    }
    else{
      errorMsg = null;
    }
    const resetToken = req.params.resetToken;
    res.render('auth/resetPassword', {
      path: '/resetPassword',
      docTitle: 'Reset Password',
      isAuthenticated: false,
      errorMessage: errorMsg,
      csrfToken: req.csrfToken(),
      resetToken: token,
      userId: user._id.toString()
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}
exports.postReset = (req, res, next) =>
{
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if(err){
      console.log(err);
      return res.render('/reset');
    }

    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user => {
      if(!user)
      {
        req.flash('error', 'No account with email');
        return res.redirect('reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    })
    .then(result => {
      return transport.sendMail({
        to: email,
        from: 'shop@node-complete.com',
        subject: 'Reset Password for Node Complete Shop',
        html: `<h1>Reset Password Link</h1>
        <p> You requested a password reset </p>
        <p>Click this link <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
        `
      })
    })
    .then(result => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  })
}

exports.postResetPassword = (req, res, next) =>
{
 
  const oldPass = req.body.oldPassword;
  const newPass = req.body.newPassword;
  const userId = req.body.userId;
  const confirmNewPass = req.body.confirmNewPassword;

  const token = req.params.resetToken;
  User.findOne({ _id: userId, resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(userDoc => {
    
    if(!userDoc)
    {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/login');
    }
    bcrypt.compare(oldPass, userDoc.password)
    .then(doMatch => {
        if(doMatch)
        {
          if(newPass !== confirmNewPass)
          {
            req.flash('error', 'new Passwords do not match');
            return res.redirect('/signup');
          }
          return bcrypt.hash(newPass, 12)
          .then(hash => {
            
            userDoc.password = hash;
            userDoc.resetToken = undefined;
            userDoc.resetTokenExpiration = undefined;
            return userDoc.save();
          })
      }
      else{
        req.flash('error', 'Old Password does not match');
        return res.redirect('/signup');
      }
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err)
      return res.redirect('/login');
  });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const pass = req.body.password;
  const confirmPass = req.body.confirmPassword;
  const signupCode = req.body.signupCode;
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).render('auth/signup',{
      path:'signup',
      docTitle: 'Signup',
      isAuthenticated: false,
      csrfToken: req.csrfToken(),
      errorMessage: errors.array()[0].msg,
      oldInput: {email: email, password: pass, confirmPassword: confirmPass},
      validationErrors: errors.array()
    });
  }
  
  return bcrypt.hash(pass, 12)
    .then( hash => {
      const user = new User({
        email: email,
        password: hash,
        cart: {items: []}
      });
      return user.save();
    })
    .then(result =>
      {
        return transport.sendMail({
          to: email,
          from: 'shop@node-complete.com',
          subject: 'signup success',
          html: '<h1>successfully signed up for nodecomplete shop!</h1>'
        })
        
        
    })
    .then(result => {
      res.redirect('/admin/campaigns');
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  console.log("here");
  const sessionId = req.session.id;
  req.session.destroy((err)=> {
    if (err) {
        console.log('Error destroying session in store:', err);
        next(err);
    } else {
        console.log('Session destroyed in store');
    }
    res.status(200).redirect('/')
  });
};
