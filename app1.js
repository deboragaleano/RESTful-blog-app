const { urlencoded } = require('body-parser');

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

// we use then everytime there's a form and we need to parse the body of it je
app.use(bodyParser.urlencoded({extended: true})); 

//we need these 3 options to make passport work 
app.use(require('express-session')({
    secret: "I love bebecito", 
    resave: false,
    saveUninitialized: false
}))

//we need these lines everytime we need to use passport 
passport.use(new LocalStrategy(User.authenticate())); 
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

/*** REGISTER ROUTE ***/  

//get route for the form - to show the form
app.get('/register', (req, res) => {
    res.render('register'); 
})

//post route for the form - to receive data
app.post('/register', (req, res) => {
    // here the USER REGISTER will takes 3 arguments
    // FIRST we CREATE a new user with the username ONLY
    // SECOND we add password as a 2nd param AFTER we create the username
    // which will NOT be saved in the DB but it will turn this into HASH
    // and this HASH password is what will be stored in the DB
    // then, THIRD our  3rd is the callback
    User.register(new User({username: req.body.username}), req.body.password, (err, newUser) => {
        if(err) {
            console.log(err);
            res.redirect('register');
        } 
        // this will happen once the user has been created
        // this line will log the user in, it will take care of everything in the session
        // it will store the correct info and run the serialize lines 
        // and we specify that we want to use the 'local' strategy, which can be 'twitter' or others 
        // then we add req, res and a callback 
        passport.authenticate('local')(req, res, () => {
            res.redirect('/secret'); 
        })
    })

})

/*** LOGIN ROUTE ***/  

// get login shows the form
app.get('/login', (req, res) => {
    res.render('login'); 
}); 

// responsible for the login
// we pass in passport as a 2nd arg here, and this is known as
// middleware: it's some code that runs before our final route callback
// Its called middleware because it can run before, during and after the route
// PASSPORT here will take the username/pass from the form and compare that 
// automatically with the one HASH/info we have on our DB 
// then we provide an object with 2 params, sucess/failure redirect
app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret', 
    failureRedirect: '/login'
}), (req, res) => {

});


app.listen(PORT, () => {
    console.log('Serving test')
})