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
    message: String
});

var User = mongoose.model("user_collection", userSchema);
var Message = mongoose.model("message_thread", messageSchema);

async function pushToDB(user) {
    let bleh = new User();

    var userResult = await User.findOne({username: user.username}).exec();

    console.log(userResult);
    var hashedPassword;
    if(!userResult){
        hashedPassword = bcrypt.hashSync(user.password,null,null);
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
async function makeNewMessage (message) {
    let mess = new Message({
        username: message.username,
        date: message.date,
        message: message.message
    });
    var results = await Message.create(mess);
    console.log("Message should've created");
    return results;
}

exports.makeNewMessage = makeNewMessage;

exports.updateUserAvatar = async (username, imageURL) => {
    var result = await User.findOne({username: username}).exec();
    if(result){
        result.imageURL = imageURL;
        result.save();
        return {user: result};
    }
    return {error: "No user found"};
}
exports.editUser = async (id, user) => {
    //this might not work, switching it to check the username instead of the _id might be better

    var results = await User.findByIdAndUpdate(id, user, {new: true});

    return results;
}
//hopefully just edits the message that was passed in
exports.editMessage = async (message) => {
    //this might not work, switching it to check the username instead of the _id might be better

    var results = await Message.findOneAndUpdate({_id: message._id}, {message: message.message, date: message.date})

    return results;
}
//should just blow up and delete the message
exports.deleteMessage = (message) => {
    return Message.findByIdAndRemove({_id: message._id}, function(err, message){
        if(err) console.error(err)
    }).exec();
}

async function getMessage(message){
    bleh = new Message();
    var results = await Message.findOne({_id: message._id})
    if(results){
        bleh = new Message({
            message: results.message,
            _id: results._id,
            username: results.username,
            date: results.date
        })
    }else{
        bleh = {
            error: "No Message like that was found"
        }
    }
    return bleh;
}

exports.getMessage = getMessage;


//should return an array of all messages
exports.getAllMessages = async (currUser) =>{
    currUser = currUser || {};

    bleh = [];
    var allMessages = await Message.find().exec();
    for (let i = 0; i < allMessages.length; i++) {
        const element = allMessages[i];
        // console.log("This is the entire message: " + element)

        var user = await User.findOne({username: allMessages[i].username}).exec();

        allMessages[i].imageURL = user.imageURL
        allMessages[i].canEdit = user._id.toHexString() === currUser._id
        allMessages[i].canDelete = user._id.toHexString() === currUser._id || currUser.isAdmin
        // bleh.push(
        //     {
        //         messageinfo: allMessages[i], 
        //         imageURL: user.imageURL
        //     }
        // )
    }
    return allMessages;
    //do a database call to get the avatar image
    //store that and all messages into a custom object
    //return those custom objects
}


exports.login = async (username, password) => {

    var user = await User.findOne({username: username}).exec();

    if(!user){
        return {error: "Login Failed Username not found"};
    }

    var res = bcrypt.compareSync(password, user.password)
    if(res){
        //the password matchs what was passed in
        return {user: user};
    }else{
        //the password does not match the what was passed in
        return {error: "Login failed because of password"}
    }
}

exports.getUserByID = async (id) => {
    try{
        var results = await User.findById(id).exec();
        return {user: results };
    } catch(err){
        console.log(err);
        return {error: err};
    }

    // var user = await User.findOne({_id: id}).exec();

    // if(!user){
    //     return {error: "Username not found"};
    // }
    // return { user };
}
exports.getUser = async (username) => {
    var user = await User.findOne({username: username}).exec();

    if(!user){
        return {error: "Login Failed Username not found"};
    }
    return { user };
}

exports.getAllUsers = async () => {
    var allUsers = await User.find().exec();

    return allUsers;
}

exports.getUserMessageCount = () =>{
    // exports.getUserMessageCount = (username) =>{
    // var bleh;
    // var count = 0;
    // Message.find({username: username})
    // .exec(function(err, allMessages){
    //     if(err) return console.log(err);
    //     for (let i = 0; i < allMessages.length; i++) {
    //         const element = allMessages[i];
    //         count++;
    //     }
    //     bleh = {
    //         messageCount: count,
    //         imageURL: User.findOne({username: allMessages[i]}).imageURL
    //     }
            
    //     return bleh;
    // })
    var bleh = [];
    var count = 0;
    Message.find()
    .exec(function(err, allMessages){
        if(err) return console.log(err);
        for (let i = 0; i < allMessages.length; i++) {
            const element = allMessages[i];
            count = 0;
            allMessages.forEach(mess => {
                if(mess.username === allMessages[i].username){
                    count++;
                }
            });
            if(!bleh.includes(allMessages[i].username)){
                bleh.push({
                    username: allMessages,
                    messageCount: count,
                    imageURL: User.findOne({username: username}).imageURL
                })
            }
        }

            
        return bleh;
    })
}

exports.deleteUser = async (username) => {
    Message.deleteMany({username: username}).exec();

    return await User.findOneAndDelete({username: username}, function(err, user){
        if(err) return console.log(err);
    }).exec();
}
