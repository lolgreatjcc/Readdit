const express = require('express');
const router = express.Router();
const comment = require('../model/comment.js')
const verify = require('./verify');
router.post('', verify.extractUserId, (req,res) => {
    var user_id = req.body.token_user_id;
    var comment_content = req.body.comment;
    var post_id = req.body.post_id;
    comment.createComment(user_id, comment_content, post_id, (err, result) => {
        if(!err) {
            res.status(201).send({ "Result": "Comment created Successfully"});
        }
        else {
            res.status(500).send({ "ErrorMsg": "Error in creating comment"});
        }
    })
})

router.get('/:post_id', (req,res) => {
    var post_id = req.params.post_id;
    console.log('post_id: ' + post_id);
    comment.getCommentsOfPost(post_id, (err, result) => {
        if(!err) {
            res.status(200).send({ "Result": result });
        }
        else {
            console.log(err);
            res.status(500).send({ "ErrorMsg": "Error in getting comments"});
        }
    })
})

module.exports = router;