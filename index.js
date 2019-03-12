var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var homeRouter = require('./routes/home');
var authRouter = require('./routes/authentication');
var adminRouter = require('./routes/admin');
var profileRouter = require('./routes/profile');
var boardRouter = require('./routes/board')

var app = express();
var secret = process.env.SECRET || 'Web-Final';

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({secret: secret, saveUninitialized: true, resave: true}));

app.use('/Auth', authRouter);
app.use('/Admin', adminRouter);
app.use('/Board', boardRouter);
app.use('/Profile', profileRouter);
app.use('/', homeRouter);

app.listen(3000);
console.log('Listening at http://localhost:3000');