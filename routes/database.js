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

var User = mongoose.model("User_Collection", userSchema);

exports.pushToDB = req => {
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        // avatar: api call using the req.body.username,
        isAdmin: req.body.admin,
        email: req.body.email,
        age: req.body.age
    });
    user.save(function(err, user){
        if(err)return err;
        console.log(req.body.username + "was added");
    });
}



// exports.create = () => {

// }