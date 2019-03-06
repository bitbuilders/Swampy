var express = require('express');
var API = require('../utility/api');
var util = require('../utility/util');

var faceConfig = require('../config/face.json');

var router = express.Router();

// Display User Profile... Assume in Session
router.get('/', function(req, res) {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    console.log(user);

    // Check existing User Session
    if(!user){
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

    var userName = req.params['username'];
    var size = req.query['size'] || req.body['size'] || 256;

    var url = `${API.BASE_URL}${size}/${userName}.png`;
    res.render('profile', {menu, user, userName: userName, imageURL: url});
});

// Edit user Profile
router.post('/Edit', function(req, res) {
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
        user.imageURL = profileEdit.imageURL;
    }
    
    res.redirect('/Profile');
});

// Deletes the current User
router.delete('', function(req, res){
    res.send('Deleting Profile is not Implemented');
})

module.exports = router;