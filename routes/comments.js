const express = require('express'); 
const router = express.Router(); 
const bodyParser = require('body-parser'); 
const methodOverride = require('method-override'); 
const Workout = require('../models/workout'); 
const Comment = require('../models/comment'); 
const User = require('../models/user'); 
const middleware = require('../middleware');


router.use(bodyParser.urlencoded({extended: true}));
router.use(methodOverride('_method')); 

// Comments new - this will be the form
router.get('/workouts/:id/comments/new', middleware.isLoggedIn, (req, res) => {
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
router.post('/workouts/:id/comments', middleware.isLoggedIn,(req, res) => {
    let id = req.params.id; 
    let newComment = req.body.comment; 
    Workout.findById(id, (err, foundWorkout) => {
        if(err) {
            console.log(err)
        } else {
            Comment.create(newComment, (err, comment) => {
                if(err) {
                    console.log(err)
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username; 
                    comment.save(); 
                    foundWorkout.comments.push(comment);
                    foundWorkout.save(); 
                    req.flash('success', 'Successfully added comment!');
                    res.redirect(`/workouts/${id}`); 
                }
            })
        }
    })
})

//Edit comment 
router.get('/workouts/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect('back'); 
        } else {
            res.render('comments/edit', {comment: foundComment, workout_id: req.params.id}); 
        }
    })
})

//Update comment
router.put('/workouts/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    const newComment = req.body.comment; 
    Comment.findByIdAndUpdate(req.params.comment_id, newComment, (err, updatedComment) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect(`/workouts/${req.params.id}`)
        }
    })
})

// Destroy route 
router.delete('/workouts/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted');
            res.redirect(`/workouts/${req.params.id}`); 
        }
    })
})

module.exports = router;    