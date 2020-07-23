const Workout = require('../models/workout'); 
const Comment = require('../models/comment'); 

//all middleware goes here
const middlewareObj = {};

middlewareObj.checkWorkoutOwnership = (req, res, next) => {
//middleware ownership permission
    if(req.isAuthenticated()) {
        Workout.findById(req.params.id, (err, foundWorkout) => {
            if(err) {
                res.redirect('back'); 
            } else {
                // does user own the workout? 
                // we use equals here, method from mongoose to check if its the same
                if(foundWorkout.author.id.equals(req.user._id)) {
                    next(); 
                } else {
                    res.redirect('back'); 
                }
            }
        })
    } else {
        // this will take the user back to where they were 
        res.redirect('back'); 
    }             
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                res.redirect('back');
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next(); 
                } else {
                    res.redirect('back'); 
                }
            }
        })
    } else {
        res.redirect('back'); 
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/login'); 
}

module.exports = middlewareObj;