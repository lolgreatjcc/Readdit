const express = require('express');
const router = express.Router();
const post = require('../model/post.js')

router.post('/create', (req,res) => {
    
    var title = req.body.title;
    var content = req.body.content;
    var fk_subreaddit_id = req.body.subreaddit_id;
    var fk_user_id = req.body.user_id;

    post.createPost(title, content, fk_subreaddit_id,fk_user_id, function (err,result) {
        if(!err) {
            console.log(result);
            res.status(201).send({ "Result": "Post created successfully."});
        } else {
            res.status(500).send(err)
        }
    })
})

module.exports = router