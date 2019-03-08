var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var homeRouter = require('./routes/home');
var loginRouter = require('./routes/login');
var profileRouter = require('./routes/profile');

var app = express();
var secret = process.env.SECRET || 'Web-Final';

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var urlencodedParser = bodyParser.urlencoded({
    extended: true
});

app.use(cookieParser());
app.use(expressSession({secret: secret, saveUninitialized: true, resave: true}));
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/', homeRouter);

var checkAuth = function(req, res, next) {
    if (req.session.user && req.session.user.isAuthenticated) {
      next();
    }
    else {
      res.redirect('/');
    }
}

// app.post('/login', urlencodedParser, (req, res) => {
//     if(req.body.username=='user' && req.body.pass=='password'){
//     req.session.user={
//         isAuthenticated: true,
//         username: req.body.username,
//         isAdmin: req.body.isAdmin
//     };
//     res.redirect('/');
//     }else{
//     res.redirect('/');
//     }
// });

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

app.listen(3000);