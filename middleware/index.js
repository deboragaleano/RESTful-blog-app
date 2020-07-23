const Workout = require('../models/workout'); 
const Comment = require('../models/comment'); 

//all middleware goes here
const middlewareObj = {};

middlewareObj.checkWorkoutOwnership = (req, res, next) => {
//middleware ownership permission
    if(req.isAuthenticated()) {
        Workout.findById(req.params.id, (err, foundWorkout) => {
            if(err) {
                req.flash('error', 'Workout not found'); 
                res.redirect('back'); 
            } else {
                // does user own the workout? 
                // we use equals here, method from mongoose to check if its the same
                if(foundWorkout.author.id.equals(req.user._id)) {
                    next(); 
                } else {
                    req.flash('error', 'You do not have permission to do that');
                    res.redirect('back'); 
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in to continue');
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
                    req.flash('error', 'You do not have permission to do that');
                    res.redirect('back'); 
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in to continue');
        res.redirect('back'); 
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next(); 
    }
    req.flash('error', 'You need to be logged in to continue');
    res.redirect('/login'); 
}

module.exports = middlewareObj;