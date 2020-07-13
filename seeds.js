const mongoose = require('mongoose'); 
const Workout = require('./models/workout'); 
const Comment = require('./models/comment'); 

let data = [
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

// let comments = [
//     {
//         comment: 'I like this'
//     },
//     {
//         comment: 'I like that'
//     },
//     {
//         comment: 'I like you'
//     },
// ]


const seedDB = () => {
    //remove all workouts
    Workout.remove({}, (err) => {
        if(err) {
            console.log(err);
        }
        console.log('removed workout');

        // add a few workouts with for each, single workout
        data.forEach(seed => {
            Workout.create(seed, (err, workout) => {
                if(err) {
                    console.log(err); 
                }
                console.log('added workout');     
                
                // create a comment to each workout
                Comment.create({
                    text: 'This workout is great', 
                    author: 'Someone'
                }, (err, comment) => {
                    if(err) {
                        console.log(err);
                    } else {
                        workout.comments.push(comment);
                        workout.save(); 
                        console.log('Created new comment');
                    }
                })
            })
        })
    })
}

module.exports = seedDB; 