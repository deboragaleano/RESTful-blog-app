const mongoose = require('mongoose');

// MONGOOSE/MODEL CONFIG 
const workoutSchema = new mongoose.Schema({
    title: String, 
    video: String, 
    description: String, 
    created: {type: Date, default: Date.now},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

module.exports = mongoose.model('Workout', workoutSchema); 