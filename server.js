// set up ======================================================================
// get all the tools we need
var express  = require('express'); //y
var app      = express(); //y
var port     = process.env.PORT || 3000; //y
const MongoClient = require('mongodb').MongoClient //y

var mongoose = require('mongoose');

var passport = require('passport'); //user authentication
var flash    = require('connect-flash');

var morgan       = require('morgan'); //debugger
var cookieParser = require('cookie-parser'); //enables us to look
var bodyParser   = require('body-parser'); //form data //y
var session      = require('express-session'); //keeps us log in

var configDB = require('./config/database.js'); //object - go to the config folder and look for the db.js that is holding an object; when you're requiring you're getting the object
//gives us the ability to hide it //y

var db //y

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => { //grabbing the url property, and once is connected
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db); //function call; let's go to apps, routes.js and spit the function;app, passport, db are arguments; require grab the function; api
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration; function call that grabs a function\

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcboot', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
