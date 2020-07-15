const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose'); 

const UserSchema = new mongoose.Schema({
    username: String, 
    password: String
}); 

//This line will add a bunch of methods/features/funtionalities that come with the passportpackage to the UserSchema
// that we will need to use in order to have user authentication 
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema); 