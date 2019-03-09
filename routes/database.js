var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Data', {
    useNewUrlParser:true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(callback){

});

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    imageURL: String,
    isAdmin: Boolean,
    email: String,
    age: Number
});

var messageSchema = mongoose.Schema({
    username: String,
    title: String,
    message: String
});

var User = mongoose.model("user_collection", userSchema);
var Message = mongoose.model("message_thread", messageSchema);

async function pushToDB(user) {
    let bleh = new User();

    var userResult = await User.findOne({username: user.username}).exec();

    console.log(userResult);

    if(!userResult){
        bleh = new User({
            username: user.username,
            password: user.password,
            imageURL: user.imageURL,
            isAdmin: user.isAdmin,
            email: user.email,
            age: user.age
        });
        var result = await User.create(bleh);
        console.log(result);
        console.log("User should've created");
        var ugh = {
            user: bleh,
            error: ""
        }
        return ugh;
    } else {
        //this user already exists
        //return a user and the error message if he already exists
        var ugh = {
            user: null,
            error: "User already exists"
        }
        return ugh;
    }

}
exports.pushToDB = pushToDB;

exports.makeNewMessage = (req, res) => {
    let mess = new Message({
        username: req.body.username,
        title: req.body.title,
        message: req.body.message
    });
    Message.create(mess);
    console.log("Message should've created");
}

exports.updateUserAvatar = async (username, imageURL) => {
    var result = await User.findOne({username: username}).exec();
    if(result){
        result.imageURL = imageURL;
        result.save();
        return {user: result};
    }
    return {error: "No user found"};
}

exports.login = async (username, password) => {

    var user = await User.findOne({username: username}).exec();

    if(!user){
        return {error: "Login Failed Username not found"};
    }

    if(user.password == password){
        return  {user: user};
    } else {
        return {error: "Login Failed becase of password"};
    }
}


exports.getUser = async (username) => {
    var user = await User.findOne({username: username}).exec();

    if(!user){
        return {error: "Login Failed Username not found"};
    }
    return { user };
}

exports.getMessageBoard = () => {
    var board = [];
    var randAmo = (Math.random() * 10 | 0) + 1;

    var API = require('../utility/api');

    for(var i = 0; i < randAmo; i++){
        var username = Math.random().toString(36).substr(2,5);
        var imageURL =  API.BASE_URL + username + '.png'
        var message = Math.random().toString(36).substr(2,5);
        var date = Date.now() - i * Math.random();
        var _id = 

        board.push({username, imageURL, message, date});
    }
    return board;
}

exports.updateMessage = (messageID, user, messageContent) => {
    return "No";
}

// exports.create = () => {

// }