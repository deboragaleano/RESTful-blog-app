const express = require('express'); 
const router = express.Router(); 
const Workout = require('../models/workout'); 
const Comment = require('../models/comment'); 
const User = require('../models/user'); 


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

                    //we can add username and id to the comment by assigning the author's info 
                    // to the current user, which is: req.user(id or username)
                    // so, req.user contains the ID and the username, this is assuming
                    // that a user is actually logged in thanks to the middleware
                    
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username; 
                    //here we have to save the comment 
                    comment.save(); 
          
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