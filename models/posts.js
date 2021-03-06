/**
 * Created by frublin on 1/11/16.
 */
var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title: String,
    link: String,
    author: String,
    upvotes: {type: Number, default: 1},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

PostSchema.methods.upvote = function (cb) {
    this.upvotes += 1;
    this.save(cb);
}

mongoose.model('Post', PostSchema);