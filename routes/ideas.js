const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');





//load Idea Model
require('../models/Idea');
const Idea = mongoose.model('Ideas');

// idea index page
router.get('/', (req, res) => {
  Idea.find({})
    .sort({date : 'desc'})
    .then(ideas => {
      res.render('./ideas/index', {
        ideas : ideas
      });
    });
  
})
// edit idea form
router.get('/edit/:id', function (req, res) {
  Idea.findOne({
    _id : req.params.id
  })
  .then(idea => {
    res.render('./ideas/edit', {
      idea : idea
    });
  })
})

// edit post form idea
router.put('/:id', function (req, res) {
  Idea.findOne({
    _id : req.params.id
  })
  .then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save()
    .then(idea => {
      res.redirect('/ideas');
    })
  })
})

// Delete Idea
router.delete('/:id', function (req, res) {
  Idea.deleteOne({
    _id : req.params.id
  }).then(() => {
    req.flash('success_msg', 'Video Idea removed')
    res.redirect('/ideas');
  })
})


router.get('/add', function (req, res) {
  res.render('./ideas/add');
})
// post add ideas form
router.post('/', function (req, res) {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'Please add title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add details' });
  }
  if (errors.length > 0) {
    res.render('./ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title : req.body.title,
      details : req.body.details
    }

    new Idea(newUser)
    .save()
    .then(idea => {
      res.redirect('/ideas');
    })
  }
})


module.exports = router;