const express = require('express'); 
const router = express.Router(); 
const bodyParser = require('body-parser'); 
const methodOverride = require('method-override'); 
const Workout = require('../models/workout'); 
const Comment = require('../models/comment'); 
const User = require('../models/user'); 
const { render } = require('ejs');



router.use(bodyParser.urlencoded({extended: true}));
router.use(methodOverride('_method')); 

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

//Edit comment 
router.get('/workouts/:id/comments/:comment_id/edit', (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect('back'); 
        } else {
            res.render('comments/edit', {comment: foundComment, workout_id: req.params.id}); 
        }
    })
})

//Update comment
router.put('/workouts/:id/comments/:comment_id', (req, res) => {
    const newComment = req.body.comment; 
    Comment.findByIdAndUpdate(req.params.comment_id, newComment, (err, updatedComment) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect(`/workouts/${req.params.id}`)
        }
    })
})

// add destroy route 






//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/login'); 
}

module.exports = router;    