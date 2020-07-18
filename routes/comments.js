const express = require('express'); 
const router = express.Router(); 
const Workout = require('../models/workout'); 
const Comment = require('../models/comment'); 


// Comments new - this will be the form
// here we add the middleware to send the user to login if not loggedin already 
router.get('/workouts/:id/comments/new', isLoggedIn, (req, res) => {
    let id = req.params.id; 

    Workout.findById(id, (err, foundWorkout) => {
        if(err) {
            console.log(err)            
        } else {
            res.render('comments/show', {workout: foundWorkout}); 
        }
    })
})

// Comments create 
// here we add the middleware as well  
router.post('/workouts/:id/comments', isLoggedIn,(req, res) => {
    let id = req.params.id; 
    let newComment = req.body.comment; 
    Workout.findById(id, (err, foundWorkout) => {
        if(err) {
            console.log(err)
        } else {
            //once found right workout, add comment, push into array 
            // save and redirect
            Comment.create(newComment, (err, comment) => {
                if(err) {
                    console.log(err)
                } else {
                    foundWorkout.comments.push(comment);
                    foundWorkout.save(); 
                    res.redirect(`/workouts/${id}`); 
                }
            })
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