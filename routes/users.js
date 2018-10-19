const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');


// load model

require('../models/User');
const user = mongoose.model('Users');

// user login route
router.post('/login', function (req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})

// user login get

router.get('/login', function (req, res) {
  res.render('./users/login');
})


// user register route
router.get('/register', function (req, res) {
  res.render('users/register');
})


// Register form post
router.post('/register', (req, res) => {
  let errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Password do not match' });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    user.findOne({ email: req.body.email })
      .then(use => {
        if (use) {
          req.flash('error_msg', 'email already registered');
          res.redirect('/users/register');
        } else {
          const newUser = new user({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          })

          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
              if (err) {
                throw err;
              }
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered');
                  res.redirect('/users/login');
                })
            })
          })
        }
      })


  }

});
module.exports = router;