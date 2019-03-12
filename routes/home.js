var express = require('express');
var util = require('../utility/util');
var database = require('./database');

var router = express.Router();

router.get('/', async (req, res) => {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);
    var posts = await database.getUserMessageCount();
    console.log(posts);

    database.getAllMessages(user)
        .then(success => {
            var board = success;
            console.log('Message Board', board);
            res.render('index', { user, menu, board, posts });
        });
});

module.exports = router;