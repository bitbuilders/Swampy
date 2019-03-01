var express = require('express');
var pug = require('pug');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var path = require('path');
var configDefault = require('./config-default.json');

var app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));

app.use(expressSession({
    secret: 'SwampyNo1',
    saveUninitialized: true,
    resave: true
}));

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', (req, res) => {
    let menu = [];
    menu = menu.concat(configDefault.menu);
    let user = {};
    user.isAdmin = true;
    if(req.session.user && req.session.user.isAuthenticated) {
        menu.push(["Hello " + req.session.username, "/profile", "menuItem right"]);
        menu.push(["Logout", "/logout", "menuItem right"]);
        user.isAdmin = req.session.user.isAdmin;
        if (user.isAdmin) {
            menu.push(["Admin Page", "/admin", "menuItem"]);
        }
    }
    else{
        menu.push(["Create Account", "/create", "menuItem right"]);
        menu.push(["Login", "/login", "menuItem right"]);
    }
    console.log(menu);
    res.render('index', {
        user,
        menu
    });
});

app.post('/login', urlencodedParser, (req, res) => {
    if(req.body.username=='user' && req.body.pass=='password'){
        req.session.user={
          isAuthenticated: true,
          username: req.body.username,
          isAdmin: req.body.isAdmin
        };
        res.redirect('/');
      }else{
        res.redirect('/');
      }
});

app.listen(3000);