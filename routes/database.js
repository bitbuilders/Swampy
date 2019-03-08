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

exports.updateUserAvatar = (username, imageURL) => {
    User.findOne({username: username}, function(err,results){
        if(!results){
            //this found nothing and should be impossiple 
        }else{
            //this found something
            // bleh = new User({
            //     imageUrl: imageUrl
            // });
            results.imageURL = imageURL;
            results.save();
        }
    })
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


// exports.create = () => {

// }