/**
 * Created by frublin on 1/25/16.
 */
var mongoose = require('mongoose');

var SlackMessagesSchema = new mongoose.Schema({
    text: String,
    user: mongoose.Schema.Types.ObjectId,
    ts: String,
    channel: String,
    subtype: String,
    linkTitle: String,
    linkUrl: String,
    linkServiceName: String,
    linkText: String,
    linkThumbWidth: Number,
    linkThumbHeight: Number,
    reactions: [{type: mongoose.Schema.Types.ObjectId, ref: 'SlackReactions'}]
});


mongoose.model('SlackMessage', SlackMessagesSchema);