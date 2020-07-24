const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    title: String, 
    video: String, 
    description: String, 
    created: {type: Date, default: Date.now},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }], 
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String 
    } 
})

module.exports = mongoose.model('Workout', workoutSchema); 