/**
 * Created by frublin on 1/18/16.
 */

var passport = require('passport')
var SlackStrategy = require('passport-slack').Strategy;
var mongoose = require('mongoose');
var SlackUser = mongoose.model('SlackUser');


passport.use(new SlackStrategy({
    //TODO this needs to not be in the .js
        clientID: "3265307277.19649948192",
        clientSecret: "e8edcbd10c0d1fa8227e9ed8b4300cdb",
        scope: 'identify channels:read channels:history users:read reactions:read'
    },
    function(accessToken, refreshToken, profile, done) {

        console.log("Profile: " + JSON.stringify(profile))

        var json = profile._json;

        var update = {
            team: json.team,
            user: json.user,
            access_token: accessToken,
            team_id: json.team_id,
            user_id: json.user_id,
            profile_image: json.info.user.profile.image_72,
            profile_thumb: json.info.user.profile.image_32,
            last_authenticated: new Date()
        };

        var query = {'user_id' : profile.id};
        SlackUser.find(query, function(err, user){

            if (err){

            }

        });
        SlackUser.findOneAndUpdate(query, update, {upsert:true, 'new':true }, function(err, user){
            console.log("ERROR: " + err);
            console.log("USER: " + user);
            return done(err, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    console.log("Serializing user:" + user.user_id)
    done(null, user.id);
});

passport.deserializeUser(function(user, done) {
    SlackUser.findById(user, function (err, user){
        console.log("Deserialized user: " + user);
        done(err, user);
    });
});

