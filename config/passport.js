/**
 * Created by frublin on 1/18/16.
 */

var passport = require('passport')
var SlackStrategy = require('passport-slack').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

/// /passport.use(new LocalStrategy(
//    {usernameField: 'email'},
//    function(username, password, done){
//        User.findOne({ email: username }, function(err, user){
//            if (err) { return done(err); }
//            if (!user){
//                return done(null, false, {message: 'Incorrect username.'});
//            }
//            if (!user.validPassword(password)){
//                return done(null, false, { message: 'Incorrect password.'});
//            }
//            return done(null, user);
//        })
//    })
//)

passport.use(new SlackStrategy({
    //TODO this needs to not be in the .js
        clientID: "3265307277.19649948192",
        clientSecret: "e8edcbd10c0d1fa8227e9ed8b4300cdb"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ SlackId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));