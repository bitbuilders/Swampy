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

    // Check existing User Session
    if(!user){
        console.log('No Valid User');
        res.redirect('/Auth/Login');
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
        res.redirect('/Auth/Login');
        return;
    }

    res.render('profileEdit', {menu, user, face: faceConfig["face"]});
});

// Edit user Profile
router.post('/Edit', async function(req, res) {
    var user = util.getUser(req, res);
    var profileEdit = req.body;

    // Check existing User Session
    if(!user){
        res.redirect('/Auth/Login');
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
router.all('/Delete', async function(req, res){
    console.log('Deleting Profile')
    var user = util.getUser(req, res);

    var id = req.body["id"] || req.query["id"];

    if(!user){
        res.redirect('/Auth/Login');
        return;
    }
    if(!id){
        console.log('ID is required');
        res.redirect('/');
        return;
    }
    if(!user.isAdmin){
        console.log('You are not authorized to Delete this Profile!');
        res.redirect('/');
        return;
    }

    var profile = await database.getUserByID(id);
    console.log(profile);
    if(profile.error){
        console.log(profile.error);
        res.redirect('/');
        return;
    }
    //http://localhost:3000/Profile/Delete?id=5c874f522854e01af4e62817

    var result = await database.deleteUser(profile.user.username);
    console.log('Delete Result', result);
    res.redirect('/');
})

// Display Other Profile
router.get('/:username', function(req, res) {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    var username = req.params['username'];

    var displayUser = database.getUser(username);

    res.render('profile', {menu, user: displayUser});
});

module.exports = router;