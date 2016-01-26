/**
 * Created by frublin on 1/25/16.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var SlackMessage = mongoose.model('SlackMessage');

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

module.exports = router;
