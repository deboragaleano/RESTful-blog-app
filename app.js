const bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      express = require('express'), 
      app = express(); 

// APP CONFIG
mongoose.connect('mongodb://localhost/workout_app', { useNewUrlParser: true, useUnifiedTopology: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// MONGOOSE/MODEL CONFIG 
const workoutSchema = new mongoose.Schema({
    title: String, 
    video: String, 
    body: String, 
    created: {type: Date, default: Date.now}
})
const Workout = mongoose.model('Workout', workoutSchema); 

// Workout.create({
//     title: '30-Minute Cardio Latin Dance Workout', 
//     video: 'https://www.youtube.com/embed/8DZktowZo_k',
//     body: 'Cardio is more than just running on a treadmill! This Latin dance workout proves you can get your heart rate up while shaking your hips and shimmying your shoulders. Nicole Steen, a cardio dance expert at Equinox, knows how to keep you moving and to keep it fun. New to dance? No worries, we offer modifications. Press play and get ready to cha-cha.',
// }, (err, workout) => {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(workout)
//     }
// })

// RESTFUL ROUTES

app.get('/', (req, res) => {
    res.redirect('/workouts');     
})
/* Index */
app.get('/workouts', (req, res) => {
    Workout.find({}, (err, workouts) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {workouts: workouts})
        }
    })
})

app.listen(3000, ()=> {
    console.log('its working');
})
