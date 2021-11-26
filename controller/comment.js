const express = require('express');
const router = express.Router();
const comment = require('../model/comment.js')
const verify = require('./verify');

router.post('', verify.extractUserId, (req, res) => {
    var user_id = req.body.token_user_id;
    var comment_content = req.body.comment;
    var post_id = req.body.post_id;


    if (comment_content.length > 1000){
        res.status(400).send({"message":"Comment exceeds 1000 character limit."})
    }
    else if (!(comment_content.trim().length > 0)){
        res.status(400).send({"message":"Comment cannot be empty."})
    }
    else {
        comment.createComment(user_id, comment_content, post_id, (err, result) => {
            if (!err) {
                res.status(201).send({ "Result": "Comment created Successfully" });
            }
            else {
                res.status(500).send({ 'message': "Error in creating comment." });
            }
        })
    }

})

router.get('/:post_id', (req, res) => {
    var post_id = req.params.post_id;
    comment.getCommentsOfPost(post_id, (err, result) => {
        if (!err) {
            if (result.length == 0) {
                res.status(400).send({ 'message': "No comments found. Post has no comments or post doesn't exist yet." })
            }
            else {
                res.status(200).send({ "Result": result });
            }
        }
        else {
            console.log(err);
            res.status(500).send({ 'message': "Error in getting comments." });
        }
    })
})

//getCommentsbyOneUser
router.get('/user/:user_id', function (req, res) {
    var user_id = req.params.user_id;
    comment.getCommentsByUser(user_id, function (result, err) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send({ "message": "Error while retrieving comments." });
        }
    })
})

module.exports = router;