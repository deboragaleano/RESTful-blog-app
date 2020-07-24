const express = require('express'); 
const router = express.Router(); 
const Workout = require('../models/workout'); 
const User = require('../models/user'); 
const workout = require('../models/workout');
const middleware = require('../middleware');


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
router.get('/workouts/new', middleware.isLoggedIn, (req, res) => {
    res.render('new');  
})

/* Create */
router.post('/workouts', middleware.isLoggedIn, (req, res) => {
    //add sanitizer to avoid JS scripts to be entered through input
    req.body.workout.body = req.sanitize(req.body.workout.body)
    const newWorkout = req.body.workout

    const author = {
        id: req.user._id,
        username: req.user.username
    }
    newWorkout.author = author; 
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
    Workout.findById(id).populate('comments').exec((err, foundWorkout) => {
        if(err) {
            console.log(err);    
        } else {
            res.render('show', {workout: foundWorkout})
        }
    })
})

/* Edit */
router.get('/workouts/:id/edit', middleware.checkWorkoutOwnership, (req, res) => {
    let id = req.params.id; 
    Workout.findById(id, (err, foundWorkout)  => {
        res.render('edit', {workout: foundWorkout})
    })
})


/* Update */
router.put('/workouts/:id', middleware.checkWorkoutOwnership, (req, res) => {
    let id = req.params.id; 
    let newData = req.body.workout
    req.body.workout.body = req.sanitize(req.body.workout.body)
    Workout.findByIdAndUpdate(id, newData, (err, updatedWorkout)  => {
        if(err) {
            res.redirect('/workouts');     
        } else {
            res.redirect(`/workouts/${id}`)
        }
    })
})

/* Delete */
router.delete('/workouts/:id', middleware.checkWorkoutOwnership, (req, res) => {
    let id = req.params.id; 
    Workout.findByIdAndDelete(id, (err)  => {
            req.flash('error', 'Workout deleted');
            res.redirect('/workouts'); 
    })
})

module.exports = router; 
