var express = require('express');
// var database = require('./database');
var API = require('../utility/api');
var util = require('../utility/util');

var router = express.Router();

// router.get('/Login', (req, res) => {
//     database.pushToDB(req);
//     // res.redirect('/');
// });

// Login User View
router.get('/Login', function(req, res) {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    res.render('Login', { user, menu });
});
// Login User Logic
router.post('/Login', function(req, res){
    // // Validate
    // var userName = req.body['userName'];
    // var password = req.body['password'];

    var success = false;

    // // Add Session
    // var profile = req.session.profile = {};
    // profile.username = userName;
    // profile.imageURL = API.BASE_URL + userName + '.png';

    // database.pushToDB(req);

    // Redirect
    if(success){
        res.redirect('/Profile');
    } else {
        res.redirect('/');
    }
});

router.get('/Register', function(req, res) {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    res.render('Register', { user, menu });
});
router.post('/Register', function(req, res) {
    // Validate
    var userName = req.body['username'];
    var password = req.body['password'];

    var success = userName && password;

    // Add Session
    var user = req.session.user = {};
    user.username = userName;
    user.imageURL = API.BASE_URL + userName + '.png';

    console.log('here');

    if(success){
        res.redirect('/Profile');
    } else {
        res.redirect('/');
    }
});

// Logout User - No Logic / View
router.all('/Logout', function(req, res){
    // Remove Session...
    req.session.profile = undefined;

    // Return to Home
    res.redirect('/');
});

module.exports = router;