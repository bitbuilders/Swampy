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

    var board = database.getMessageBoard();

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
    var user = util.getUser(req, res);

    var id = req.body["id"];
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



    database.updateMessage(id, user, message)
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