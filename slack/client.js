/**
 * Created by frublin on 1/19/16.
 */
/**
 * Example for creating and working with the Slack RTM API.
 */

/* eslint no-console:0 */
var request = require('request');
var RtmClient = require('../node_modules/slack-client/lib/clients/rtm/client');

var token = 'xoxp-3265307277-3265307281-18870919619-20124e0285';

var rtm = new RtmClient(token, { logLevel: 'debug' });
rtm.start();

rtm.on('message', function handleRtmMessage(message) {

    var messageContents = message.message;
    var previousMessage = message.previousMessage;

    if (message.subtype !== 'undefined' && message.previousMessage != undefined){

        if (message.subtype == 'message_deleted') {
            console.log("Delete post with timestamp: " + previousMessage.ts);
        } else {
            if (message.subtype == 'message_changed') {
                console.log("Change post with timestamp: " + previousMessage.ts);
            }
            console.log("Message:\n" + JSON.stringify(message) + "\n\n");

            var url = 'http://localhost:3000/slack/messages'
            var options = {
                method: 'PUT',
                body: messageContents,
                json: true,
                url: url
            }

            request(options,
                function (error, response, body) {
                    if (!error) {
                        console.log("Body: " + body);
                    } else {
                        console.log("Error: " + error)
                    }
                }
            );

        }
    }
});

rtm.on('reaction_added', function handleRtmReactionAdded(reaction){
    console.log("Reaction added");
});

rtm.on('reaction_removed', function handleRtmReactionAdded(reaction){
    console.log("Reaction removed");
});


function extractLink(message){

    console.log('\n');
    console.log(message);
    console.log('\n');

    var messageText = message.message;

    if (typeof messageText !== 'undefined' && typeof messageText.attachments !== 'undefined'){

        var linkPost = {};

        var attachment = messageText.attachments[0];
        var link = attachment.fromUrl;
        console.log('\n');
        console.log('Attachments:');
        console.log(attachment)
        console.log('\n');
        console.log('Link: ' + link);
        console.log('\n');

        linkPost['url'] = link;
        linkPost['author'] = messageText.user;
        linkPost['ts'] = messageText.ts;
        linkPost['text'] = attachment.text;
        linkPost['raw'] = attachment;
    }

    return linkPost;
}