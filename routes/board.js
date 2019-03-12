var express = require('express');
var database = require('./database');
var API = require('../utility/api');
var util = require('../utility/util');

var router = express.Router();

router.get('/Post', function(req, res) {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    if(!user){
        res.redirect('/Auth/Login');
        return;
    }

    res.render('messageEdit', { menu, user });
})
router.get('/Edit', async function(req, res) {
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    var id = req.query['id'] || req.body['id'];

    if(!user){
        res.redirect('/Auth/Login');
        return;
    }

    if(!id){
        console.log('No Id given');
        res.redirect('/');
        return;
    }

    var message = await database.getMessage({_id: id});

    res.render('messageEdit', { menu, user, message });
})

router.post('/Post', function(req, res) {
    var user = util.getUser(req, res);

    if(!user){
        res.redirect('/Auth/Login');
        return;
    }

    
    var message = {
        username: user.username,
        message: req.body["message"],
        date: new Date(Date.now()).toString()
    }
    console.log(message);

    database.makeNewMessage(message);

    res.redirect('/');
})

router.post('/Edit', function (req,res){
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
        date: new Date(Date.now()).toString()
    }

    database.editMessage(message)
        .then(success => {
            if(success.error){
                console.log('Message Update Failed:', success.error);
            } 

            res.redirect('/');
        })
        .catch(fail => {
            console.log(fail);
            res.redirect('/');
        })

});

router.all('/Delete', function(req, res) {
    var user = util.getUser(req, res);
})

module.exports = router;