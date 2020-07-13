const bodyParser = require('body-parser'), 
      PORT = 3000,
      methodOverride = require('method-override'),
      expressSanitizer = require('express-sanitizer'),
      mongoose = require('mongoose'),
      express = require('express'), 
      app = express(), 
      Workout = require('./models/workout'),
      Comment = require('./models/comment'),
      seedsDB = require('./seeds') 

// seedsDB();      
// APP CONFIG
mongoose.connect('mongodb://localhost/workout_app', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false); 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); 
app.use(methodOverride('_method')); 

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
    //add sanitizer to avoid JS scripts to be entered through input
    req.body.workout.body = req.sanitize(req.body.workout.body)
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
    // here we need to populate the comments into Workout and execute it 
    Workout.findById(id).populate('comments').exec((err, foundWorkout) => {
        if(err) {
            console.log(err);    
        } else {
            // console.log(foundWorkout);
            res.render('show', {workout: foundWorkout})
        }
    })
})

/* Edit */
app.get('/workouts/:id/edit', (req, res) => {
    let id = req.params.id; 

    Workout.findById(id, (err, foundWorkout)  => {
        if(err) {
            console.log(err);    
        } else {
            res.render('edit', {workout: foundWorkout})
        }
    })
})

/* Update */
app.put('/workouts/:id', (req, res) => {
    let id = req.params.id; 
    let newData = req.body.workout
    //this sanitizes the data to avoid malicious inputs
    req.body.workout.body = req.sanitize(req.body.workout.body)
    //finds the ID and the existing workout and updates it with new data
    //it takes 3 args, id, newData and callback
    Workout.findByIdAndUpdate(id, newData, (err, updatedWorkout)  => {
        if(err) {
            res.redirect('/workouts');     
        } else {
            res.redirect(`/workouts/${id}`)
        }
    })
})

/* Delete */
app.delete('/workouts/:id', (req, res) => {
    let id = req.params.id; 
    Workout.findByIdAndDelete(id, (err)  => {
        if(err) {
            res.redirect('/workouts');     
        } else {
            res.redirect('/workouts'); 
        }
    })
})

// =====================
// COMMENT ROUTES
// =====================

// add new - this will be the form
app.get('/workouts/:id/comments/new', (req, res) => {
    let id = req.params.id; 

    Workout.findById(id, (err, foundWorkout) => {
        if(err) {
            console.log(err)            
        } else {
            res.render('comments/show', {workout: foundWorkout}); 
        }
    })
})

// create comment
app.post('/workouts/:id/comments', (req, res) => {
    let id = req.params.id; 
    let newComment = req.body.comment; 
    Workout.findById(id, (err, foundWorkout) => {
        if(err) {
            console.log(err)
        } else {
            //once found right workout, add comment, push into array 
            // save and redirect
            Comment.create(newComment, (err, comment) => {
                if(err) {
                    console.log(err)
                } else {
                    foundWorkout.comments.push(comment);
                    foundWorkout.save(); 
                    res.redirect(`/workouts/${id}`); 
                }
            })
        }
    })
})

app.listen(PORT, ()=> {
    console.log(`Server is running on:${PORT}`);
})