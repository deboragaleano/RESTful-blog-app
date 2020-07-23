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
      flash = require('connect-flash'),
      seedsDB = require('./seeds') 

// requiring routes 
const workoutsRoutes = require('./routes/workouts'),
      commentRoutes = require('./routes/comments'),
      indexRoutes = require('./routes/index')

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
app.use(flash()); 

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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success'); 
    next(); 
})

// Use our routes:
app.use(indexRoutes);
app.use(workoutsRoutes);
app.use(commentRoutes);

app.listen(PORT, ()=> {
    console.log(`Server is running on:${PORT}`);
})