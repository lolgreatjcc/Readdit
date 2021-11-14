const express = require('express');
const router = express.Router();
const printDebugInfo = require('./printDebugInfo');
//Model Imports
const post = require('../model/post.js');
const media = require('../model/media.js');
const moderator = require("../model/moderator.js")
var path = require('path');

//Imports required for media upload
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './mediaUploadTemp/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  })
const upload = multer({dest: './mediaUploadTemp', storage:storage})
const mediaUpload = require("./mediaUpload");
const app = require('./app');
const verify = require('./verify');

function checkModerator(req, res, next){
    var fk_subreaddit_id = req.body.fk_subreaddit_id;
    var fk_user_id = req.body.token_user_id;
    moderator.checkModerator(fk_user_id, fk_subreaddit_id, function (err, result) {
        if(!err) {
            next();
        }
        else{
            res.status(403).send({"Error":"Logged In user is not moderator"});
        }
        
    })
}

//uploading post images
router.post('/create', upload.array("media",8), (req,res) => {
    
    //data from front-end
    var title = req.body.title;
    var content = req.body.content;
    var fk_subreaddit_id = req.body.subreaddit_id;
    var fk_user_id = req.body.user_id;
    var fk_flair_id = req.body.fk_flair_id;
    var file = req.files;

    if (isNaN(fk_flair_id)){
        fk_flair_id = null;
    }


    post.createPost(title, content, fk_subreaddit_id,fk_user_id, fk_flair_id, async function (err,result) {
        if(!err) {
            var fk_post_id = result.post_id
            //uploading media to cloudinary + saving record to media table
                var success = true;
                var fileLength = file.length;
                var progress = 0;
                if (fileLength > 0){
                    for (var i=0;i<fileLength;i++){
                    progress++;
                    if (!success){
                        break;
                    }
                    //uploading media to cloudinary
                     await mediaUpload(file[i], async function (err,result){
                        try{
                            var result = await result;
                        if (result){
                            //saving record to media table 
                            var {media_url,content_type} = result;
                            console.log("Media Url: " + media_url);
                            media.createMedia(media_url, content_type, fk_post_id, function(err,result){
                                if (err){
                                    throw "Error saving media_url to media table";
                                }
                                else if (result){
                                    progress--;
                                    if (progress == 0){
                                        res.status(201).send({ "Result": "Post created successfully."});
                                    }
                                }
                                
                            });
                        }
                        else{
                            await unlinkAsync(file[i].path);
                            throw err.message;
                        }}
                        catch(err){
                            console.log("Error: " + err);
                            if (err == "Invalid File Type"){
                                success = false;
                                await unlinkAsync(file[i].path);
                                res.status(400).send({Error:err});
                            }
                            else{
                                success = false;
                                await unlinkAsync(file[i].path);
                                res.status(500).send({Error:err});
                            }
                            
                        }
                    });
                    }; 
                }
                else{
                    res.status(201).send({ "Result": "Post created successfully."});
                }
                         
            
        } else {
            res.status(500).send({Error:err});
        }
    })
})

//get posts from one subreaddit
router.get('/get/r/:subreaddit', function (req,res) {
    req_subreaddit = req.params.subreaddit;
    post.getPostsInSubreaddit(req_subreaddit, function (result,err) {
        if(!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send(err);
        }
    })
})


//get post searches
router.get('/search', printDebugInfo, function (req, res) {
    var query = req.query.query;
    
    post.searchPost(query, function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({"Result:":"Internal Server Error"});
        }
    });

});

//get specific post from one subreaddit
router.get('/get/r/:subreaddit/:post_id', function (req,res) {
    req_subreaddit = req.params.subreaddit;
    post_id = req.params.post_id
    
    post.getOnePostInSubreaddit(req_subreaddit,post_id, function (result,err) {
        if(!err) {
            if (result == null){
                res.status(404).send({"Error":"Unable to find requested post."})
            }
           res.status(200).send(result);
        } else {
            res.status(500).send(err);
        }
    })
})


router.get('/:post_id', function (req,res) {
    req_post_id = req.params.post_id;
    post.getPost(req_post_id, function (result,err) {
        if(!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send(err);
        }
    })
})

router.put('/pin', verify.extractUserId, checkModerator, function (req,res) {
    var {post_id, fk_subreaddit_id} = req.body;
    post.pinPost(post_id, fk_subreaddit_id, function (err,result) {
        if(!err) {
            res.status(204).send();
        } else {
            res.status(500).send(err);
        }
    })
})

module.exports = router