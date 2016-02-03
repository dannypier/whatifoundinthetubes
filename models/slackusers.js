/**
 * Created by frublin on 1/14/16.
 */
var mongoose = require('mongoose');

var SlackUserSchema = new mongoose.Schema({
    access_token: String,
    team: String,
    user: String,
    team_id: String,
    user_id: String,
    profile_image: String,
    profile_thumb: String,
    last_authenticated    : { type: Date },
});



mongoose.model('SlackUser', SlackUserSchema);