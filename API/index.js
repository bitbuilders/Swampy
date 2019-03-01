var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var app = express();
var secret = process.env.SECRET || 'Web-Final';

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('public', express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({secret: secret, saveUninitialized: true, resave: true}));

app.get('/', function(req, res) {
    res.render('home');
});

// Login User View
app.get('/Login', function(req, res) {
    res.render('Login');
});
// Login User Logic
app.post('/Login', function(req, res){
    // Validate
    var userName = req.body['userName'];
    var password = req.body['password'];

    var success = userName && password;

    // Add Session
    var profile = req.session.profile = {};
    profile.username = userName;

    // Redirect
    if(success){
        res.redirect('/Profile');
    } else {
        res.redirect('/');
    }
});

// Logout User - No Logic / View
app.all('/Logout', function(req, res){
    // Remove Session...
    req.session.profile = undefined;

    // Return to Home
    res.redirect('/');
});

// Display User Profile... Assume in Session
app.get('/Profile', function(req, res) {
    var profile = req.session.profile;

    // Check existing User Session
    if(!profile){
        res.redirect('/');
        return;
    }

    var userName = profile.userName;
    var url = `https://api.adorable.io/avatars/256/${userName}.png`;
    res.render('profile', { userName: userName, imageURL: url});
});
// Edit user Profile
app.get('/Profile/Edit', function(req, res) {
    var profile = req.session.profile;

    // Check existing User Session
    if(!profile){
        res.redirect('/');
        return;
    }

    var url = `https://api.adorable.io/avatars/256/${userName}.png`;
    res.render('profile', { userName: userName, imageURL: url});
});
// Display Other Profile
app.get('/Profile/:username', function(req, res) {
    var userName = req.params['username'];
    var size = req.query['size'] || req.body['size'] || 256;

    var url = `https://api.adorable.io/avatars/${size}/${userName}.png`;
    res.render('profile', { userName: userName, imageURL: url});
});


// Creates a new Profile
app.post('/Profile', function(req, res){
    res.send('Creating Profile is not Implemented');
})
// Updates the current User
app.put('/Profile', function(req, res){
    res.send('Updating Profile is not Implemented');
})
// Deletes the current User
app.delete('/Profile', function(req, res){
    res.send('Deleting Profile is not Implemented');
})

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening at localhost:${port}`);   
});

exports = app;