const express = require('express');
const router = express.Router();

//Model Imports
const post = require('../model/post.js');
const media = require('../model/media.js');
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

//uploading post images
router.post('/create', upload.array("media",8), (req,res) => {
    
    //data from front-end
    var title = req.body.title;
    var content = req.body.content;
    var fk_subreaddit_id = req.body.subreaddit_id;
    var fk_user_id = req.body.user_id;
    var file = req.files;

    post.createPost(title, content, fk_subreaddit_id,fk_user_id, async function (err,result) {
        if(!err) {
            var fk_post_id = result.post_id
            //uploading media to cloudinary + saving record to media table
                var success = true;
                var fileLength = file.length;
                var progress = 0;
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
                            throw err.message;
                        }}
                        catch(err){
                            console.log("Error: " + err);
                            if (err == "Invalid File Type"){
                                success = false;
                                res.status(400).send({Error:err});
                            }
                            else{
                                success = false;
                                res.status(500).send({Error:err});
                            }
                            
                        }
                    });
                };          
            
        } else {
            res.status(500).send({Error:err});
        }
    })
})

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

module.exports = router