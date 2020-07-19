const express = require('express'); 
const router = express.Router(); 
const Workout = require('../models/workout'); 
const User = require('../models/user'); 

/* Index */
router.get('/workouts', (req, res) => {
    Workout.find({}, (err, workouts) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {workouts: workouts})
        }
    })
})

/* New */
router.get('/workouts/new', isLoggedIn, (req, res) => {
    res.render('new');  
})

/* Create */
router.post('/workouts', isLoggedIn, (req, res) => {
    //add sanitizer to avoid JS scripts to be entered through input
    req.body.workout.body = req.sanitize(req.body.workout.body)
    const newWorkout = req.body.workout

    //this object is for associating the user info by adding the current user (req.user)
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    newWorkout.author = author; 
    // It will look like this: 
    // const newWorkout = {
    //     title: workout.title, 
    //     video: workout.video,
    //     description:  workout.description,
    //     author: {id:..., username, ... }
    // }
    console.log(newWorkout); 
    Workout.create(newWorkout, (err, workout) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('workouts')
        }
    })
})

/* Show */
router.get('/workouts/:id', (req, res) => {
    let id = req.params.id; 
    // here we need to populate the comments into Workout and execute it 
    Workout.findById(id).populate('comments').exec((err, foundWorkout) => {
        if(err) {
            console.log(err);    
        } else {
            // console.log(foundWorkout);
            res.render('show', {workout: foundWorkout})
        }
    })
})

/* Edit */
router.get('/workouts/:id/edit', isLoggedIn, (req, res) => {
    let id = req.params.id; 

    Workout.findById(id, (err, foundWorkout)  => {
        if(err) {
            console.log(err);    
        } else {
            res.render('edit', {workout: foundWorkout})
        }
    })
})

/* Update */
router.put('/workouts/:id', (req, res) => {
    let id = req.params.id; 
    let newData = req.body.workout
    //this sanitizes the data to avoid malicious inputs
    req.body.workout.body = req.sanitize(req.body.workout.body)
    //finds the ID and the existing workout and updates it with new data
    //it takes 3 args, id, newData and callback
    Workout.findByIdAndUpdate(id, newData, (err, updatedWorkout)  => {
        if(err) {
            res.redirect('/workouts');     
        } else {
            res.redirect(`/workouts/${id}`)
        }
    })
})

/* Delete */
router.delete('/workouts/:id', isLoggedIn, (req, res) => {
    let id = req.params.id; 
    Workout.findByIdAndDelete(id, (err)  => {
        if(err) {   
            res.redirect('/workouts');     
        } else {
            res.redirect('/workouts'); 
        }
    })
})


//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/login'); 
}

module.exports = router; 
