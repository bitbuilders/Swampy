var express = require('express');
var util = require('../utility/util');
var database = require('./database');

var router = express.Router();

router.get('/', (req, res) => {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    if(!user.isAdmin){
        console.log('You are not authorized to View this Page!');
        res.redirect('/');
        return;
    }
    
    database.getAllUsers().then(users => {
        res.render('admin', { user, menu, users });
    });
});

module.exports = router;