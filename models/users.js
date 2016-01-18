/**
 * Created by frublin on 1/14/16.
 */
var mongoose = require('mongoose');

var crypto = require('crypto');

var UserSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    photo: String,
    email: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String
});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pdkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

UserSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash == hash;
}

UserSchema.methods.generateJWT = function(){

    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(exp.getTime() / 1000),
    },

        //TODO This needs to be a environment variable not available in your codebase
        'SECRET');
}

mongoose.model('User', UserSchema);