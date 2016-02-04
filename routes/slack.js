/**
 * Created by frublin on 1/25/16.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');

var SlackUser = mongoose.model('SlackUser');
var SlackMessage = mongoose.model('SlackMessage');

/* AUTH */

router.get('/auth',
    passport.authenticate('slack'));

router.get('/auth/callback',
    passport.authenticate('slack', { failureRedirect: '/login' }),
    function(req, res) {
        console.log("Successfully authenticated");
        // Successful authentication, redirect home.
        res.redirect('/slack');
    });



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('slack', { title: 'Slack' });
});

router.get('/messages', function(req, res, next){
    SlackMessage.find(function(err, messages) {
        if (err) { next (err); }
        res.json(messages)
    })
});

router.put('/messages', function(req, res, next){

    if (typeof req.body.attachments === 'undefined' || req.body.attachments.length == 0){
        res.send("NO ATTACHMENTS");
        return;
    }

    var attachment = req.body.attachments[0];

    var update = {
        text: req.body.text,
        ts: req.body.ts,
        channel: req.body.channel,
        subtype: req.body.subtype,
        slackUserId: req.body.user,
        linkTitle: attachment.title,
        linkUrl: attachment.fromUrl,
        linkText: attachment.text,
        linkServiceName: attachment.serviceName
    }

    if (typeof attachment.thumbUrl !== 'undefined'){
        update['linkThumbWidth'] = attachment.thumbWidth;
        update['linkThumbHeight'] = attachment.thumbHeight;
        update['linkThumbUrl'] = attachment.thumbUrl;
    }
    else if (typeof attachment.imageUrl !== 'undefined'){
        update['linkThumbWidth'] = attachment.imageWidth;
        update['linkThumbHeight'] = attachment.imageHeight;
        update['linkThumbUrl'] = attachment.imageUrl;
    }

    var query = {'ts':req.body.ts, 'channel': req.body.channel};
    SlackMessage.findOneAndUpdate(query, update, {upsert:true}, function(err, message){
        if (err) { return next(err); }
        return res.json(message);
    });
});

/* USER */
//TODO this should not be exposed
router.get('/users', function(req, res, next){

    SlackUser.find(function(err, users) {
        if (err) { next (err); }

        res.json(users)
    })

});

router.get('/loggedin', function(req, res) {
    if (req.isAuthenticated()){
        var user = req.user;
        console.log("USER: " + user)
        res.send(user)
    } else {
        res.send({ err: "No user session found "})
    }
});

router.get('/users/me', function (req, res) {
    if (true) {
        console.log("User found")
        return res.json(req.user);
    } else {
        return res.status(401).json({err: "No user session found"});
    }
});


function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        console.log("User is authenticated");
        return next();
    }
    res.redirect('/slack/auth');
}

/* SLACK API */

var WebClient = require('../node_modules/slack-client/lib/clients/web/client');

router.get('/channels', function(req, res){

    console.log("ACCESS TOKEN: " + req.user.access_token);

    var web = new WebClient(req.user.access_token);

    web.channels.list(null, function channels(err, channels) {
        if (err) return console.log('Error:', err);
        console.log(channels)
        res.json(channels);
    });

})

var token = process.env.SLACK_API_TOKEN || '';


module.exports = router;
