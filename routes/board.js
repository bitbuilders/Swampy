var express = require('express');
var database = require('./database');
var API = require('../utility/api');
var util = require('../utility/util');

var router = express.Router();

router.get('/', function(req, res) {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    if(!user){
        res.redirect('/Auth/Login');
        return;
    }

    var board = database.getAllMessages();

    res.render('board', { menu, user, board });
})

router.post('/', function(req, res) {
    var user = util.getUser(req, res);

    if(!user){
        res.redirect('/Auth/Login');
        return;
    }

    var message = {
        username: user.username,
        message: req.body["message"],
        date: Date.now()
    }

    database.makeNewMessage(message);

    res.redirect('board');
})

router.delete('/', function(req, res) {
    var user = util.getUser(req, res);


})

router.put('/', function (req,res){
    var user = util.getUser(req, res); // Assuming session Info is correct...

    var id = req.body["id"];

    var message = database.getMessage()

    var message = req.body["message"];

    if(!user){
        res.redirect('/Auth/Login');
        return;
    }
    if(!id){
        console.log('ID is required')
        res.redirect('/Board');
        return;
    }

    var message = {
        _id: id,
        message: message,
        date: Date.now()
    }

    database.editMessage(message)
        .then(success => {
            if(success.error){
                console.log('Message Update Failed:', success.error);
            } 

            res.redirect('/Board');
        })
        .catch(fail => {
            console.log(fail);
            res.redirect('/Board');
        })

});

module.exports = router;