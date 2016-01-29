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
        clientSecret: "e8edcbd10c0d1fa8227e9ed8b4300cdb",
        scope: 'identify channels:read channels:history users:read reactions:read'
    },
    function(accessToken, refreshToken, profile, done) {

        var update = {
            SlackId: profile.id
        };

        var query = {'SlackId' : profile.id};
        User.findOneAndUpdate(query, update, {upsert:true}, function(err, user){
            console.log("ERROR: " + err);
            console.log("USER: " + user);
            return done(err, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

