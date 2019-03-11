var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var hash;
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
    date: String,
    message: String,
    imageURL: String
});

var User = mongoose.model("user_collection", userSchema);
var Message = mongoose.model("message_thread", messageSchema);

async function pushToDB(user) {
    let bleh = new User();

    var userResult = await User.findOne({username: user.username}).exec();

    console.log(userResult);
    var hashedPassword;
    if(!userResult){
        var hashedPassword = bcrypt.hashSync(user.password,null,null);
        bleh = new User({
            username: user.username,
            password: hashedPassword,
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
        var ugh = {
            user: null,
            error: "User already exists"
        }
        return ugh;
    }
}
//this is the export for the register function
exports.pushToDB = pushToDB;

//this will take in a message 
exports.makeNewMessage = (req, res) => {
    let mess = new Message({
        username: req.body.username,
        date: req.body.title,
        message: req.body.message
    });
    Message.create(mess);
    console.log("Message should've created");
}

//hopefully just edits the message that was passed in
exports.editMessage = (message) => {
    return Message.findOneAndUpdate({_id: message._id}, {message: message.message, date: message.date}).exec();
}

//should just blow up and delete the message
exports.deleteMessage = (message) => {
    return Message.findByIdAndDelete({_id: message._id}).exec();
}

//should return an array of all messages
exports.getAllMessages = async () =>{
    bleh = [];
    var allMessages = await Message.find().exec();
    for (let i = 0; i < allMessages.length; i++) {
        const element = allMessages[i];
        console.log("This is the entire message: " + element)
        var user = await User.findOne({username: allMessages[i].username}).exec();
        allMessages[i].imageURL = user.imageURL
        // bleh.push(
        //     {
        //         messageinfo: allMessages[i], 
        //         imageURL: user.imageURL
        //     }
        // )
    }
    return bleh;
    //do a database call to get the avatar image
    //store that and all messages into a custom object
    //return those custom objects
}

exports.updateUserAvatar = async (username, imageUrl) => {
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

    var result = bcrypt.compareSync(password, user.password);
    if(result){
        return user;
    } else {
        return {user: undefined, error: "Invalid Password"};
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