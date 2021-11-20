const express = require('express');
const router = express.Router();
const post = require('../model/post.js')
const verify = require('./verify')

// save a post
router.post('/post', verify.extractUserId, function (req,res) {
    var post_id = req.body.post_id;
    var user_id = req.body.token_user_id;
    post.savePost(post_id, user_id, function (result,err) {
        if(!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send({"message":"Error saving post."});
        }
    })
})

router.get('/posts', function (req,res) {
    var user_id = req.query.user_id;
    post.getSavedPosts(user_id, function (result,err) {
        if(!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send({"message":"Error getting saved posts."});
        }
    })
})

router.delete('/post', function (req,res) {
    console.log("req.body", req.body);
    var post_id = req.body.post_id;
    var user_id = req.body.user_id;
    console.log("post_id", post_id);
    post.unsavePost(post_id, user_id, function (result,err) {
        console.log("result: " + result);
        if(!err) {
            res.sendStatus(204);
        } else {
            console.log(err);
            res.status(500).send({"message":"Error deleting report."})
        }
    })
})

module.exports = router;