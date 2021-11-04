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
      cb(null, './imageUploadTemp/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  })
const upload = multer({dest: './imageUploadTemp', storage:storage})
const mediaUpload = require("./mediaUpload");

//uploading post images
router.post('/create', upload.array("media",8), (req,res) => {
    
    //data from front-end
    var title = req.body.title;
    var content = req.body.content;
    var fk_subreaddit_id = req.body.subreaddit_id;
    var fk_user_id = req.body.user_id;
    var file = req.files;

    post.createPost(title, content, fk_subreaddit_id,fk_user_id, function (err,result) {
        if(!err) {
            var fk_post_id = result.post_id
            //uploading media to cloudinary + saving record to media table
                var success = true;
                for (var i=0;i<file.length;i++){
                    if (!success){
                        break;
                    }
                    //uploading media to cloudinary
                    mediaUpload(file[i], function (err,result){
                        try{
                        if (result){
                            
                            //saving record to media table 
                            var {media_url,content_type} = result;
                            media.createMedia(media_url, content_type, fk_post_id, function(err,result){
                                if (err){
                                    throw "Error saving media_url to media table";
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
                if (success){
                    res.status(201).send({ "Result": "Post created successfully."});
                }         
            
        } else {
            res.status(500).send({Error:err});
        }
    })
})

module.exports = router