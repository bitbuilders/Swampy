var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
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
    avatar: String,
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

exports.pushToDB = (user) => {
    let user = new User();
    User.findOne({username: req.body.username}, function(err, results){
        if(!results){
            //this found nothing make a new user
            user = new User({
                username: user.username,
                password: user.password,
                // imageUrl: api call using the req.body.username,
                isAdmin: user.isAdmin,
                email: user.email,
                age: user.age
            });
            User.create(user);
            console.log("User should've created");
            var ugh = {
                user,
                error: ""
            }
            return ugh;
        }
        else{
            //this user already exists
            //return a user and the error message if he already exists
            var ugh = {
                user: "",
                error: "User already exists"
            }
            return ugh;
        }
    });
}

exports.makeNewMessage = (req, res) => {
    let mess = new Message({
        username: req.body.username,
        title: req.body.title,
        message: req.body.message
    });
    Message.create(mess);
    console.log("Message should've created");
}

exports.updateUserAvatar = (username, imageUrl) => {
    User.findOne({username: username}, function(err,results){
        if(!results){
            //this found nothing and should be impossiple 
        }else{
            //this found something
            // bleh = new User({
            //     imageUrl: imageUrl
            // });
            results.imageUrl = imageUrl;
            results.save();
        }
    })
}

exports.login = (username, password) => {
    let bleh = new User();
    User.findOne({username: username}, function(err, results){
        if(!results){
            //found nothing so failed login
            bleh = {
                error: "Login Failed Username not found"
            }
        }else{
            //found something so log them in
            User.findOne({password: password}, function(err, otherResults){
                //i still need to check of the password hash is actually the true password
                if(!otherResults){
                    //found nothing so login still failed
                    bleh = {
                        error: "Login Failed becase of password"
                    }
                }
                bleh = new User({
                    username: results.username,
                    password: results.password,
                    avatar: results.avatar,
                    isAdmin: results.isAdmin,
                    email: results.email,
                    age: results.age
                });
            })
        }
        return bleh
    })
}

// exports.create = () => {

// }