var express = require('express');
var database = require('./database');
var API = require('../utility/api');
var util = require('../utility/util');

var faceConfig = require('../config/face.json');

var router = express.Router();

// Display User Profile... Assume in Session
router.get('/', function(req, res) {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    console.log('Session User is', user);

    // Check existing User Session
    if(!user){
        console.log('Redirecting');
        res.redirect('/');
        return;
    }

    res.render('profile', { menu, user });
});
// Edit user Profile
router.get('/Edit', function(req, res) {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    // Check existing User Session
    if(!user){
        res.redirect('/');
        return;
    }

    res.render('profileEdit', {menu, user, face: faceConfig["face"]});
});

// Display Other Profile
router.get('/:username', function(req, res) {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    var username = req.params['username'];

    var displayUser = database.getUser(username);

    res.render('profile', {menu, user: displayUser});
});

// Edit user Profile
router.post('/Edit', async function(req, res) {
    var user = util.getUser(req, res);
    var profileEdit = req.body;

    // Check existing User Session
    if(!user){
        res.redirect('/');
        return;
    }
    if(user.username !== profileEdit.username){
        throw new Error("You do not have permission to Edit that user");
    }

    if(profileEdit.imageURL){
        database.updateUserAvatar(user.username, profileEdit.imageURL)
            .then(result => {
                if(result.error){
                    console.log(error);
                }

                req.session.user = result.user;
                res.redirect('/Profile');
            })
    }
});

// Deletes the current User
router.delete('/', function(req, res){
    res.send('Deleting Profile is not Implemented');
})

module.exports = router;