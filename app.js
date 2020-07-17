const bodyParser = require('body-parser'), 
      PORT = 3000,
      methodOverride = require('method-override'),
      expressSanitizer = require('express-sanitizer'),
      mongoose = require('mongoose'),
      express = require('express'), 
      app = express(), 
      Workout = require('./models/workout'),
      Comment = require('./models/comment'),
      User = require('./models/user'),
      passport = require('passport'), 
      LocalStrategy = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      seedsDB = require('./seeds') 

// seedsDB();      

//================
// APP CONFIG 
//=================

mongoose.connect('mongodb://localhost/workout_app', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false); 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); 
app.use(methodOverride('_method')); 

//================
// PASSPORT CONFIG 
//=================

//we need these 3 options to make passport work 
app.use(require('express-session')({
    secret: "I love bebecito", 
    resave: false,
    saveUninitialized: false
}))

//we need these lines everytime we need to use passport 
passport.use(new LocalStrategy(User.authenticate())); 
app.use(passport.initialize());
app.use(passport.session()); 

//these 2 methods are really important on passport
// these are responsible for reading the session,
// taking the data from the session that's encoded, and unencoding it 
// and encoding it and putting back in the session (this is serializeUser method)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

//adding middleware function to include USER in every TEMPLATE, automatically!
// if there's no user loggined in, then req.user will be empty or undefined 
// whatever we put in res.locals is what's available in our current templates 
// remember to add next at the end which will allow it to run for EVERY single route - VERY IMPORTANT! 
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next(); 
})


//================
// RESTFUL ROUTES 
//=================

app.get('/', (req, res) => {
    res.redirect('/workouts');     
})
/* Index */
app.get('/workouts', (req, res) => {
    Workout.find({}, (err, workouts) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {workouts: workouts, currentUser: req.user})
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

// COMMENT ROUTES

// add new - this will be the form
// here we add the middleware to send the user to login if not loggedin already 
app.get('/workouts/:id/comments/new', isLoggedIn, (req, res) => {
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
// here we add the middleware as well  
app.post('/workouts/:id/comments', isLoggedIn,(req, res) => {
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

//================
// AUTH ROUTES 
//=================

/*** REGISTER ROUTE ***/  

//get route for the form - to show the form
app.get('/register', (req, res) => {
    res.render('register'); 
})

//post route for the form - to receive data
app.post('/register', (req, res) => {
    // here the USER REGISTER will takes 3 arguments
    // FIRST we CREATE a new user with the username ONLY
    // SECOND we add password as a 2nd param AFTER we create the username
    // which will NOT be saved in the DB but it will turn this into HASH
    // and this HASH password is what will be stored in the DB
    // then, THIRD our  3rd is the callback
    let newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            res.redirect('register');
        } 
        // this will happen once the user has been created
        // this line will log the user in, it will take care of everything in the session
        // it will store the correct info and run the serialize lines 
        // and we specify that we want to use the 'local' strategy, which can be 'twitter' or others 
        // then we add req, res and a callback 
        passport.authenticate('local')(req, res, () => {
            res.redirect('/workouts'); 
        })
    })

})

/*** LOGIN ROUTE ***/  

// get login shows the form
app.get('/login', (req, res) => {
    res.render('login'); 
}); 

// responsible for the login
// we pass in passport as a 2nd arg here, and this is known as
// middleware: it's some code that runs before our final route callback
// Its called middleware because it can run before, during and after the route
// PASSPORT here will take the username/pass from the form and compare that 
// automatically with the one HASH/info we have on our DB 
// then we provide an object with 2 params, sucess/failure redirect
app.post('/login', passport.authenticate('local', {
    successRedirect: '/workouts', 
    failureRedirect: '/login'
}), (req, res) => {

});

/*** LOGOUT ROUTE ***/  

app.get('/logout', (req, res) => {
    // with this simple line coming from passport we can logout a user
    // and just provide the link somewhere in the browser :) 
    req.logout(); 
    res.redirect('/'); 
})

// HERE WE WILL ADD A MIDDLEWARE to prevent the user 
// from going to the secret page if not loggedin 
// this function is standard for a middleware, to use 3 params
function isLoggedIn(req, res, next){
    // this method comes with passport and will return next
    // or run next, show the secret page, if not then login again 
    if(req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/login'); 
}

app.listen(PORT, ()=> {
    console.log(`Server is running on:${PORT}`);
})