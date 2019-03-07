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
    imageUrl: String,
    isAdmin: Boolean,
    email: String,
    age: Number
});

var messageSchema = mongoose.Schema({
    username: String,
    title: String,
    message: String
});

var User = mongoose.model("user_collection", {
    username: String,
    // password: String,
    // imageUrl: String,
    // isAdmin: Boolean,
    // email: String,
    // age: Number
});
var Message = mongoose.model("message_thread", messageSchema);

async function pushToDB(user) {
    let bleh = new User();

    console.log(user);

    // var userResult = await User.findOne({username: user.username}).exec();
    bleh = new User(user);
    var result = await User.create(bleh);
    console.log(result);
    console.log("User should've created");
    var ugh = {
        user: bleh,
        error: ""
    }
    return ugh;

    console.log(userResult);

    if(!userResult){

    } else {
        //this user already exists
        //return a user and the error message if he already exists
        var ugh = {
            user: null,
            error: "User already exists"
        }
        return ugh;
    }

    // User.findOne({username: user.username}, async function(err, results){
    //     console.log(results);
    //     if(!results){
    //         //this found nothing make a new user
    //         bleh = new User({
    //             username: user.username,
    //             password: user.password,
    //             imageUrl: user.imageUrl,
    //             isAdmin: user.isAdmin,
    //             email: user.email,
    //             age: user.age
    //         });
    //         var result = await User.create(bleh);
    //         console.log("User should've created");
    //         var ugh = {
    //             user: bleh,
    //             error: ""
    //         }
    //         // return ugh;
    //         return result;
    //     }
    //     else{
    //         //this user already exists
    //         //return a user and the error message if he already exists
    //         var ugh = {
    //             user: null,
    //             error: "User already exists"
    //         }
    //         return ugh;
    //     }
    // });
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