const express = require('express');
const router = express.Router();
const post = require('../model/post.js')
const verify = require('./verify')

// save a post
router.post('/post',verify.verifySameUserId, function (req,res) {
    var post_id = req.body.post_id;
    var user_id = req.body.token_user_id;
    post.savePost(post_id, user_id, function (result,err) {
        if(!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send({'message':"Error saving post."});
        }
    })
})

router.get('/posts', function (req,res) {
    var user_id = req.query.user_id;
    post.getSavedPosts(user_id, function (result,err) {
        if(!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send({'message':"Error getting saved posts."});
        }
    })
})

router.delete('/post',verify.verifySameUserId, function (req,res) {
    var post_id = req.body.post_id;
    var user_id = req.body.user_id;
    post.unsavePost(post_id, user_id, function (result,err) {
        if(!err) {
            res.sendStatus(204);
        } else {
            console.log(err);
            res.status(500).send({'message':"Error deleting report."})
        }
    })
})

module.exports = router;