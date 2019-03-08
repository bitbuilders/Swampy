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
        bcrypt.hash(user.password,null,null,function(err,hash){
            console.log("idk what is suppposed to happen here: " + hash)
            var hashedPassword = hash;
        });
        bleh = new User({
            username: user.username,
            password: hashedPassword,
            imageUrl: user.imageUrl,
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
    Message.findOneAndUpdate({_id: message._id}, {message: message.message, date: message.date})
}

//should just blow up and delete the message
exports.deleteMessage = (message) => {
    Message.findByIdAndDelete({_id: message._id})
}

//should return an array of all messages
exports.getAllMessages = () =>{
    bleh = [];
    Message.find()
    .exec(function(err, allMessages){
        if(err) return console.log(err);
        for (let i = 0; i < allMessages.length; i++) {
            const element = allMessages[i];
            console.log("This is the entire message: " + element)
            bleh.push(
                {
                    messageinfo: allMessages[i], 
                    imageURL: User.findOne({username: allMessages[i]}).imageURL
                }
            )
        }
        return bleh;
    })
    //do a database call to get the avatar image
    //store that and all messages into a custom object
    //return those custom objects
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

exports.login = async (username, password) => {

    var user = await User.findOne({username: username}).exec();

    if(!user){
        return {error: "Login Failed Username not found"};
    }

    // if(user.password == password){
    //     return  {user: user};
    // } else {
    //     return {error: "Login Failed becase of password"};
    // }
    bcrypt.compare(user.password, password, function(err, res){
        if(res){
            //the password matchs what was passed in
            return {user: user};
        }else{
            //the password does not match the what was passed in
            return {error: "Login failed because of password"}
        }
    });



    // , function(err, results){
    //     if(!results){
    //         //found nothing so failed login
    //         bleh = {
    //             error: "Login Failed Username not found"
    //         }
    //     }else{
    //         //found something so log them in
    //         User.findOne({password: password}, function(err, otherResults){
    //             //i still need to check of the password hash is actually the true password
    //             if(!otherResults){
    //                 //found nothing so login still failed
    //                 bleh = {
    //                     error: "Login Failed becase of password"
    //                 }
    //             }
    //             bleh = new User({
    //                 username: results.username,
    //                 password: results.password,
    //                 avatar: results.avatar,
    //                 isAdmin: results.isAdmin,
    //                 email: results.email,
    //                 age: results.age
    //             });
    //         })
    //     }
    //     return bleh
    // })
}



// exports.create = () => {

// }