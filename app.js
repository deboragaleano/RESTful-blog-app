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
    description: String, 
    created: {type: Date, default: Date.now}
})
const Workout = mongoose.model('Workout', workoutSchema); 

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

/* New */
app.get('/workouts/new', (req, res) => {
    res.render('new');  
})

/* Create */
app.post('/workouts', (req, res) => {
    const newWorkout = req.body.workout
    // It will look like this: 
    // const newWorkout = {
    //     title: workout.title, 
    //     video: workout.video,
    //     description:  workout.description
    // }
    Workout.create(newWorkout, (err, workout) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('workouts')
        }
    })
})

/* Show */
app.get('/workouts/:id', (req, res) => {
    let id = req.params.id; 

    Workout.findById(id, (err, foundWorkout)  => {
        if(err) {
            console.log(err);    
        } else {
            res.render('show', {workout: foundWorkout})
        }
    })
})


app.listen(3000, ()=> {
    console.log('Server is connected');
})
