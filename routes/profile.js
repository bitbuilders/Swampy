var express = require('express');
var database = require('./database');
var bodyParser = require('body-parser');
var util = require('../util');

var urlencodedParser = bodyParser.urlencoded({
    extended: true
});

var router = express.Router();

router.get('/', util.auth, (req, res) => {
    var userData = util.getMenu(req, res);
    console.log('HI');
    res.render('profile', {
        user: userData.user,
        menu: userData.menu
    });
});

router.get('/Edit', util.auth, (req, res) => {
    var userData = util.getMenu(req, res);
    res.render('profileEdit', {
        user: userData.user,
        menu: userData.menu
    });
});

router.post('/Edit', util.auth, (req, res) => {
    var userData = util.getMenu(req, res);
    res.redirect('/');
});

module.exports = router;