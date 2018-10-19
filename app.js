const express = require('express');
const expressbar = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();


// load router
const ideas = require('./routes/ideas');
const users = require('./routes/users');


// passport config
require('./config/passport')(passport);

//connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useNewUrlParser: true
})
  .then(function () {
    console.log('MongoDB Connected');
  })
  .catch(err => console.log(err));




// Handlebars Middleware
app.engine('handlebars', expressbar({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// method override middleware
app.use(methodOverride('_method'));

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// flash connect middleware
app.use(flash());




// Global variables 
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Welcome'
  });
})

app.get('/about', function (req, res) {
  res.render('about');
})





app.use('/ideas', ideas)
app.use('/users', users)


app.listen(3000, function () {
  console.log('Port is listening');
})