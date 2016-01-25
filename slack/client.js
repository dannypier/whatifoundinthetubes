/**
 * Created by frublin on 1/19/16.
 */
/**
 * Example for creating and working with the Slack RTM API.
 */

/* eslint no-console:0 */

var RtmClient = require('../node_modules/slack-client/lib/clients/rtm/client');

var token = 'xoxp-3265307277-3265307281-18870919619-20124e0285';

var rtm = new RtmClient(token, { logLevel: 'debug' });
rtm.start();

rtm.on('message', function handleRtmMessage(message) {

    var linkSubmission = extractLink(message);

    console.log("Link Post:\n" + JSON.stringify(linkSubmission));

});


function extractLink(message){

    var linkPost = {};

    console.log('\n');
    console.log(message);
    console.log('\n');

    var messageText = message.message;

    if (typeof messageText !== 'undefined' && typeof messageText.attachments !== 'undefined'){

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