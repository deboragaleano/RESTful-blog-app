const mongoose = require('mongoose'); 
const Workout = require('./models/workout'); 
const Comment = require('./models/comment'); 

let seeds = [
    {
        title: '10 MIN BOOTY WORKOUT', 
        video: 'https://www.youtube.com/embed/5-tH4gdpKiU',
        description: 'a leg workout with a focus on booooty - which will not kill you :D I made it a bit easier than usual, I promise ♥︎ / Werbung'
    },
    {
        title: 'MIN BOOTY WORKOUT', 
        video: 'https://www.youtube.com/embed/5-tH4gdpKiU',
        description: 'a leg workout with a focus on booooty - which will not kill you :D I made it a bit easier than usual, I promise ♥︎ / Werbung'
    },
    {
        title: '30 MIN BOOTY WORKOUT', 
        video: 'https://www.youtube.com/embed/5-tH4gdpKiU',
        description: 'a leg workout with a focus on booooty - which will not kill you :D I made it a bit easier than usual, I promise ♥︎ / Werbung'
    },
]


async function seedDB() {
    try {
      // we don't need to save these in a var because we do want 
      await Workout.deleteMany({}); 
      console.log('Workouts removed');
      await Comment.deleteMany({})
      console.log('Comments removed');
  
      // loop through seeds and create a workout
      for(const seed of seeds) {
          // we save it in a variable because we do want something to be returned 
          // the value that gets returned after the await is done is what we're going 
          // to use to push comments into newly created workout 
          let workout = await Workout.create(seed); 
          console.log('Workout created');
  
          // create a comment to each workout
          let comment = await Comment.create({
              text: 'This workout is great', 
              author: 'Someone'
          })
          console.log('Comment created');
  
          workout.comments.push(comment);
          workout.save(); 
          console.log('Comment added to Workout');
      }   
    // handle error with try and catch  
    } catch(err) {
        console.log(err)
    }
}

module.exports = seedDB; 