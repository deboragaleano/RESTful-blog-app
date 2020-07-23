const express = require('express'); 
const router = express.Router(); 
const passport = require('passport'); 
const User = require('../models/user'); 

//ROOT ROUTE
router.get('/', (req, res) => {
    res.render('landing');     
})

/*** REGISTER ROUTE ***/  

//get route for the form - to show the form
router.get('/register', (req, res) => {
    res.render('register'); 
})

//handles sign up logic - post method, to receive data
router.post('/register', (req, res) => {
    // here the USER REGISTER will takes 3 arguments
    // FIRST we CREATE a new user with the username ONLY
    // SECOND we add password as a 2nd param AFTER we create the username
    // which will NOT be saved in the DB but it will turn this into HASH
    // and this HASH password is what will be stored in the DB
    // then, THIRD our  3rd is the callback
    let newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash('error', err.message); 
            res.redirect('register');
        } 
        // this will happen once the user has been created
        // this line will log the user in, it will take care of everything in the session
        // it will store the correct info and run the serialize lines 
        // and we specify that we want to use the 'local' strategy, which can be 'twitter' or others 
        // then we add req, res and a callback 
        passport.authenticate('local')(req, res, () => {
            req.flash('success', `Welcome to the Workout App, ${user.username}`);
            res.redirect('/workouts'); 
        })
    })

})

/*** LOGIN ROUTE ***/  

// get login shows the form
router.get('/login', (req, res) => {
    res.render('login'); 
}); 

// responsible for the login
// we pass in passport as a 2nd arg here, and this is known as
// middleware: it's some code that runs before our final route callback
// Its called middleware because it can run before, during and after the route
// PASSPORT here will take the username/pass from the form and compare that 
// automatically with the one HASH/info we have on our DB 
// then we provide an object with 2 params, sucess/failure redirect
router.post('/login', passport.authenticate('local', {
    successRedirect: '/workouts', 
    failureRedirect: '/login'
}), (req, res) => {

});

/*** LOGOUT ROUTE ***/  

router.get('/logout', (req, res) => {
    // with this simple line coming from passport we can logout a user
    // and just provide the link somewhere in the browser :) 
    req.logout(); 
    req.flash('success', 'Logged you out!'); 
    res.redirect('/workouts'); 
})

module.exports = router; 