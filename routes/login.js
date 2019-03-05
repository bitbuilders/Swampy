var express = require('express');
var database = require('./database');
var bodyParser = require('body-parser');
var util = require('../util');

var urlencodedParser = bodyParser.urlencoded({
    extended: true
});

var router = express.Router();

router.get('/login', (req, res) => {
    var userData = util.getMenu(req, res);
    res.render('login', {
        user: userData.user,
        menu: userData.menu
    });
});

router.post('/login', urlencodedParser, (req, res) => {
    var data = database.pushToDB(req);
    if (data.error === '') {
        req.session.user={
            isAuthenticated: true,
            username: req.body.username,
            isAdmin: req.body.isAdmin
        };
        res.redirect('/');
    }
    else {
        res.redirect('/login');
    }
});

module.exports = router;