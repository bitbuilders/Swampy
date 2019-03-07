var express = require('express');
var database = require('./database');
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
    var username = req.body['username'];
    var password = req.body['password'];

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

    database.login(username, password)

});

router.get('/Register', function(req, res) {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    res.render('Register', { user, menu });
});
router.post('/Register', function(req, res) {
    // Validate
    var user = {};
    user.username = req.body['username'];
    user.password = req.body['password'];
    user.imageURL = API.BASE_URL + user.username + '.png';
    user.isAdmin = req.body['admin'] === "on";
    user.email = req.body['email'];
    user.age = req.body['age'];

    // Create
    database.pushToDB(user)
        .then(success => {
            req.session.user = success.user;
            res.redirect('/Profile');
        })
        .catch(fail => {
            console.log('Creation Failed')
            console.log(fail);
            res.redirect('/');
        });
});

// Logout User - No Logic / View
router.all('/Logout', function(req, res){
    // Remove Session...
    req.session.user = undefined;

    // Return to Home
    res.redirect('/');
});

module.exports = router;