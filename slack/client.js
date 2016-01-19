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
    console.log(message);
});