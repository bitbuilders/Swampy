var express = require('express');
var util = require('../utility/util');

var router = express.Router();

router.get('/', (req, res) => {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    res.render('index', { user, menu });
});

module.exports = router;