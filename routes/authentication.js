var express = require('express');
var database = require('./database');

var router = express.Router();

router.get('/login', (req, res) => {
    database.pushToDB(req);
    res.redirect('/');
});

module.exports = router;