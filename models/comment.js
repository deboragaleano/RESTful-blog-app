const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: String, 
    //this will associate the comment with the User model 
    // we in the object we just get the ID and the username of the author
    // because we don't need the HASH or the SALT or any other info about the user
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    created: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Comment', commentSchema); 