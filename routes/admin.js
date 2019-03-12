var express = require('express');
var util = require('../utility/util');

var router = express.Router();

router.get('/admin', (req, res) => {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);
    var users = [{ image: 'https://wvtourism.com/wp-content/uploads/2018/04/3144431-shrek2-480x240.jpg', name: 'Colin', level: 'admin', email: 'colin@misbach.com', age: 20 }];

    res.render('admin', { user, menu, users });
});

module.exports = router;