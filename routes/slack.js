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

    if (typeof attachment.linkWidth !== 'undefined' && typeof  attachment.linkHeight !== 'undefined'){
        update['linkThumbWidth'] = attachment.linkWidth;
        update['linkThumbHeight'] = attachment.linkHeight;
    }

    if (typeof attachment.thumbWidth !== 'undefined' && typeof  attachment.thumbHeight !== 'undefined'){
        update['linkThumbWidth'] = attachment.thumbWidth;
        update['linkThumbHeight'] = attachment.thumbHeight;
    }

    var query = {'ts':req.body.ts, 'channel': req.body.channel};
    SlackMessage.findOneAndUpdate(query, update, {upsert:true}, function(err, message){
        if (err) { return next(err); }
        return res.json(message);
    });
});

module.exports = router;
