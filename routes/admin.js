var express = require('express');
var util = require('../utility/util');
var database = require('./database');

var router = express.Router();

router.get('/', (req, res) => {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);
    
    database.getAllUsers().then(users => {
        res.render('admin', { user, menu, users });
    });
});

module.exports = router;