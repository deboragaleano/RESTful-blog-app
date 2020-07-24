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
    let newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash('error', err.message); 
            res.redirect('register');
        } 
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

router.post('/login', passport.authenticate('local', {
    successRedirect: '/workouts', 
    failureRedirect: '/login'
}), (req, res) => {

});

/*** LOGOUT ROUTE ***/  

router.get('/logout', (req, res) => {
    req.logout(); 
    req.flash('success', 'Logged you out!'); 
    res.redirect('/workouts'); 
})

module.exports = router; 