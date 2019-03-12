var express = require('express');
var util = require('../utility/util');
var database = require('./database');

var router = express.Router();

router.get('/', (req, res) => {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    // console.log(user);

    database.getAllMessages(user)
        .then(success => {
            var board = success;
            res.render('index', { user, menu, board });
        });
});

module.exports = router;