/**
 * Created by frublin on 1/25/16.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var SlackMessage = mongoose.model('SlackMessage');

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("HIT A SLACK ROUTE")
    res.send("YEAH");
});

router.get('/messages', function(req, res, next){
    SlackMessage.find(function(err, posts) {
        if (err) { next (err); }
        res.json(posts)
    })
});

router.put('/messages', function(req, res, next){

    //var jsonBody = JSON.parse(req.body);
    //res.send(req.body.text);

    var attachment;
    if (req.body.attachments !== 'undefined'){
        attachment = req.body.attachments[0];
    }

    var message = new SlackMessage(req.body);
    message.linkTitle = attachment.title;
    message.linkUrl = attachment.fromUrl;
    message.linkText = attachment.text;
    message.linkThumbWidth = attachment.thumbWidth;
    message.linkThumbHeight = attachment.thumbHeight;
    message.linkServiceName = attachment.serviceName;

    message.save(function(err, message){
        if (err) { return next(err); }
        res.json(message);
    })
});

module.exports = router;
