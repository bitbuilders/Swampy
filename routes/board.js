var express = require('express');
var database = require('./database');
var API = require('../utility/api');
var util = require('../utility/util');

var router = express.Router();

router.get('/Post', function(req, res) {
    console.log('Getting Create Message View');
    var user = util.getUser(req, res);
    var menu = util.getMenu(user);

    if(!user){
        res.redirect('/Auth/Login');
        return;
    }

    res.render('messageEdit', { menu, user });
})
router.get('/Edit', async function(req, res) {
    console.log('Getting Edit Message View');
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
    if(message.username !== user.username){
        console.log('You are not authorized to Edit this Message!');
        res.redirect('/');
        return;
    }

    res.render('messageEdit', { menu, user, message });
})

router.post('/Post', function(req, res) {
    console.log('Posting Message');
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

router.post('/Edit', async function (req,res){
    console.log('Editing Message');
    var user = util.getUser(req, res); // Assuming session Info is correct...

    var id = req.body["id"];
    var messageContents = req.body["message"];

    if(!user){
        res.redirect('/Auth/Login');
        return;
    }
    if(!id){
        console.log('ID is required');
        res.redirect('/');
        return;
    }

    var message = await database.getMessage({_id: id});
    if(message.username !== user.username){
        console.log('You are not authorized to Edit this Message!');
        res.redirect('/');
        return;
    }

    message.message = messageContents;
    message.date = new Date(Date.now()).toString();

    database.editMessage(message)
        .then(success => {
            if(success.error){
                console.log('Message Update Failed:', success.error);
            } 

            res.redirect('/');
        })
        .catch(fail => {
            console.log('Error in Edit Message:', fail);
            res.redirect('/');
        })

});

router.all('/Delete', async function(req, res) {
    console.log('deleting Message');
    var user = util.getUser(req, res);

    var id = req.body["id"] || req.query["id"];

    if(!user){
        res.redirect('/Auth/Login');
        return;
    }
    if(!id){
        console.log('ID is required');
        res.redirect('/');
        return;
    }

    var message = await database.getMessage({_id: id});
    if(message.username !== user.username && !user.isAdmin){
        console.log('You are not authorized to Delete this Message!');
        res.redirect('/');
        return;
    }

    var result = await database.deleteMessage(message);
    console.log('Delete Result', result);
    res.redirect('/');
})

module.exports = router;