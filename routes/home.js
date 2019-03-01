var express = require('express');
var util = require('../util');

var router = express.Router();

router.get('/', (req, res) => {
    var userData = util.getMenu(req, res);
    res.render('index', {
        user: userData.user,
        menu: userData.menu
    });
});

module.exports = router;