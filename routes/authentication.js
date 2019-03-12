var express = require('express');
var database = require('./database');
var API = require('../utility/api');
var util = require('../utility/util');

var router = express.Router();

// Login User View
router.get('/Login', function(req, res) {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    res.render('Login', { user, menu });
});
// Login User Logic
router.post('/Login', async function(req, res){
    console.log('Logging In');
    // // Validate
    var username = req.body['username'];
    var password = req.body['password'];

    var data = await database.login(username, password);
   
    if(!data.error){
        req.session.user = data.user 
        console.log('User', data.user);
        res.redirect('/Profile');
    } else {
        console.log('Error', data.error)
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
    var user = {};
    user.username = req.body['username'];
    user.password = req.body['password'];
    user.imageURL = API.BASE_URL + user.username + '.png';
    user.isAdmin = req.body['admin'] === "on";
    user.email = req.body['email'];
    user.age = req.body['age'];

    // Create
    console.log('Creating new User')
    database.pushToDB(user)
        .then(success => {
            console.log('In then', success);
            if(success.error){
                console.log('Error:', success.error);
                res.redirect('/');
            } else {
                req.session.user = success.user;
                console.log('User', success.user);
                res.redirect('/Profile');
            }  
        })
        .catch(fail => {
            console.log('In Catch', fail);
            res.redirect('/');
        });
});

// Logout User - No Logic / View
router.all('/Logout', function(req, res){
    console.log('Logging out');

    // Remove Session...
    req.session.user = undefined;

    // Return to Home
    res.redirect('/');
});

module.exports = router;