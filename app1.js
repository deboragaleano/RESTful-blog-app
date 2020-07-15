const bodyParser = require('body-parser'), 
      PORT = 3000,
      mongoose = require('mongoose'),
      express = require('express'), 
      app = express(), 
      passport = require('passport'), 
      User = require('./models/user'),
      LocalStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose')

/*** APP CONFIG ***/  

mongoose.connect('mongodb://localhost/auth_demo_app', { useNewUrlParser: true, useUnifiedTopology: true });
app.set('view engine', 'ejs');

//we need these 3 options to make passport work 
app.use(require('express-session')({
    secret: "I love bebecito", 
    resave: false,
    saveUninitialized: false
}))
//we need these lines everytime we need to use passport 
app.use(passport.initialize());
app.use(passport.session()); 

//these 2 methods are really important on passport
// these are responsible for reading the session,
// taking the data from the session that's encoded, and unencoding it 
// and encoding it and putting back in the session (this is serializeUser method)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

//================
// ROUTES 
//=================

app.get('/', (req, res) => {
    res.render('test'); 
})

app.get('/secret', (req, res) => {
    res.render('secret'); 
})

// Auth Routes

//get route/register.. 

app.listen(PORT, () => {
    console.log('Serving test')
})