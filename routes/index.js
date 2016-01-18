var express = require('express');
var passport = require('passport');
var router = express.Router();
var jwt = require('express-jwt');
//TODO Make an environment variable
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
var mongoose = require('mongoose');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

/* POSTS */

router.get('/posts', function(req, res, next){
    Post.find(function(err, posts) {
        if (err) { next (err); }

        res.json(posts)
    })
});

router.post('/posts', auth, function(req, res, next){
    var post = new Post(req.body);
    post.author = req.payload.name;

    post.save(function(err, post){
        if (err) { return next(err); }

        res.json(post);
    })
});

router.param('post', function(req,res,next,id){
    var query = Post.findById(id);

    query.exec(function (err, post){
        if (err) { return next(err); }
        if (!post) { return next(new Error("can't find post")); }

        req.post = post;
        return next();

    });
});

router.get('/posts/:post', function(req, res){
    req.post.populate('comments', function(err, post){

        if (err) { return next(err); }

        res.json(req.post);
    });
});

router.put('/posts/:post/upvote', auth, function(req,res,next){
    req.post.upvote(function(err,post){
        if (err) {return next(err); }
            res.json(post)
    });
});

/* COMMENTS */

router.get('/posts/:post/comments', function(req, res, next){
    Comment.find(function(err, comments) {
        if (err) { next (err); }

        res.json(comments)
    })
});

router.post('/posts/:post/comments', auth, function(req,res,next){
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.author = req.payload.name;

    comment.save(function(err, comment){
        if (err) { return next(err); }

        req.post.comments.push(comment);
        req.post.save(function(err,post){
            if (err) { return next(err); }

            res.json(comment)
        });

    });
});

router.param('comment', function(req,res,next,id){
    var query = Comment.findById(id);

    query.exec(function (err, comment){
        if (err) { return next(err); }
        if (!comment) { return next(new Error("can't find comment")); }

        req.comment = comment;
        return next();

    });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req,res,next){
    req.comment.upvote(function(err,comment){
        if (err) {return next(err); }
        res.json(comment)
    });
});

/* USER */

router.post('/register', function(req, res, next){
    if(!req.body.email || !req.body.password){
        return res.status(400).json({message: 'Email and password parameters required'});
    }

    var user = new User();

    user.email = req.body.email;

    user.setPassword(req.body.password);

    user.save(function (err){

        if (err) { return next(err); }

        return res.json({token : user.generateJWT()})
    });
});

router.post('/login', function(req, res, err){
    if (!req.body.email || !req.body.password){
        return res.status(400).json({message: 'Email and password parameters required'});
    }

    passport.authenticate('local', function(err, user, info){
        if (err){ return next(err); }

        if (user){
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
})




module.exports = router;
