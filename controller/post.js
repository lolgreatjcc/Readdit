const express = require('express');
const router = express.Router();
const printDebugInfo = require('./printDebugInfo');
//Model Imports
const post = require('../model/post.js');
const media = require('../model/media.js');
const moderator = require("../model/moderator.js");
const subreaddit = require("../model/subreaddit.js");
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
const upload = multer({ dest: './mediaUploadTemp', storage: storage })
const mediaUpload = require("./mediaUpload");
const app = require('./app');
const verify = require('./verify');

// functions
function checkModerator(req, res, next) {
    var fk_subreaddit_id = req.body.fk_subreaddit_id;
    var fk_user_id = req.body.token_user_id;
    moderator.checkModerator(fk_user_id, fk_subreaddit_id, function (err, result) {
        if (!err) {
            next();
        }
        else{
            subreaddit.getSubreadditByID(fk_subreaddit_id, function (err, result) {
                if(!err) {
                    var result = result.dataValues;
                    if (result.fk_creator_user_id == fk_user_id){
                        next();
                    }
                    else{
                        res.status(403).send({"Error":"Logged In user is not moderator"});
                    }
                }else {
                    res.status(500).send(err);
                }
                
            })
        }

    })
}

function similarity(string, string2) {
    var arr2 = string2.split(" ");
    var checklst = [];
    var returnNum;
    for (var i = 0; i < arr2.length; i++) {
        var longer = string;
        var shorter = arr2[i];
        if (string.length < arr2[i].length) {
            longer = arr2[i];
            shorter = string;
        }
        var longerLength = longer.length; 
        var num = (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
        if (num > 0.5) {
            checklst.push(num);
        }
    }
    longer = string;
    shorter = string2;
    if (string.length < string2.length) {
        longer = string2;
        shorter = string;
    }
    var longerLength = longer.length; 

    var num = (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    if (num > 0.5) {
        checklst.push(num);
    }

    var result = 0;
    for (var i = 0; i < checklst.length; i++) {
        result += checklst[i];
    }

    return (result/checklst.length);
}

//Levenshtein Distance
function editDistance(string, string2) {
    string = string.toLowerCase();
    string2 = string2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= string.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= string2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (string.charAt(i - 1) != string2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[string2.length] = lastValue;
    }
    return costs[string2.length];
}

//uploading post images
router.post('/create', upload.array("media", 8), verify.extractUserId, (req, res) => {

    //data from front-end
    var title = req.body.title;
    var content = req.body.content;
    var fk_subreaddit_id = req.body.subreaddit_id;
    var fk_user_id = req.body.token_user_id;
    var fk_flair_id = req.body.fk_flair_id;
    var file = req.files;

    if (isNaN(fk_flair_id) || fk_flair_id == "") {
        fk_flair_id = null;
    }

    post.createPost(title, content, fk_subreaddit_id, fk_user_id, fk_flair_id, async function (err, result) {
        if (!err) {
            var fk_post_id = result.post_id
            //uploading media to cloudinary + saving record to media table
            var success = true;
            var fileLength = file.length;
            var progress = 0;
            if (fileLength > 0) {
                for (var i = 0; i < fileLength; i++) {
                    progress++;
                    if (!success) {
                        break;
                    }
                    //uploading media to cloudinary
                    await mediaUpload(file[i], async function (err, result) {
                        try {
                            var result = await result;
                            if (result) {
                                //saving record to media table 
                                var { media_url, content_type } = result;
                                console.log("Media Url: " + media_url);
                                media.createMedia(media_url, content_type, fk_post_id, function (err, result) {
                                    if (err) {
                                        throw "Error saving media_url to media table";
                                    }
                                    else if (result) {
                                        progress--;
                                        if (progress == 0) {
                                            res.status(201).send({ "Result": "Post created successfully." });
                                        }
                                    }

                                });
                            }
                            else {
                                await unlinkAsync(file[i].path);
                                throw err.message;
                            }
                        }
                        catch (err) {
                            console.log("Error: " + err);
                            if (err == "Invalid File Type") {
                                success = false;
                                await unlinkAsync(file[i].path);
                                res.status(400).send({ Error: err });
                            }
                            else {
                                success = false;
                                await unlinkAsync(file[i].path);
                                res.status(500).send({ Error: err });
                            }

                        }
                    });
                };
            }
            else {
                res.status(201).send({ "Result": "Post created successfully." });
            }


        } else {
            res.status(500).send({ Error: err });
        }
    })
})

router.get('/recent', function (req, res) {
    post.getRecentPosts(function (result, err) {
        if (!err) {
            res.status(200).send(result);
        }
        else {
            res.status(500).send(err);
        }
    })
}) 

//get posts from one subreaddit
router.get('/get/r/:subreaddit', function (req, res) {
    req_subreaddit = req.params.subreaddit;
    post.getPostsInSubreaddit(req_subreaddit, function (result, err) {
        if (!err) {
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
            res.status(200).send({ "Result": result });
        } else {
            res.status(500).send({ "Result:": "Internal Server Error" });
        }
    });

});

//get specific post from one subreaddit
router.get('/get/r/:subreaddit/:post_id', function (req, res) {
    req_subreaddit = req.params.subreaddit;
    post_id = req.params.post_id

    post.getOnePostInSubreaddit(req_subreaddit, post_id, function (result, err) {
        if (!err) {
            if (result == null) {
                res.status(404).send({ "Error": "Unable to find requested post." })
            }
            res.status(200).send(result);
        } else {
            res.status(500).send(err);
        }
    })
})

router.get('/:post_id', function (req,res) {
    req_post_id = req.params.post_id;
    post.getPost(req_post_id, function (result, err) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send(err);
        }
    })
})

router.put('/pin', verify.extractUserId, checkModerator, function (req, res) {
    var { post_id, fk_subreaddit_id } = req.body;
    post.pinPost(post_id, fk_subreaddit_id, function (err, result) {
        if (!err) {
            res.status(204).send();
        } else {
            res.status(500).send(err);
        }
    })
})

router.delete('/', verify.extractUserId, checkModerator, function (req,res) {
    var {post_id, fk_subreaddit_id} = req.body;
    post.deletePost(post_id, fk_subreaddit_id, function (err,result) {
        if(!err) {
            res.status(204).send();
        } else {
            res.status(500).send(err);
        }
    })
})

router.get('/user/:user_id', function (req,res) {
    var user_id = req.params.user_id;
    post.getPostsByUser(user_id, function (result,err) {
        if(!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send(err);
        }
    })
})

//get posts from one subreaddit
router.get('/post/search/:word', function (req, res) {
    var word = req.params.word;
    
    post.getAllPosts(function (result, err) {
        if (!err) {
            var newarr = [];
            for (var i = 0; i < result.length; i++) {
                if (similarity(word,result[i].title) > 0.5) {
                    result[i].dataValues.similar = parseFloat(similarity(word,result[i].title));
                    newarr.push(result[i]);
                }
            }
            res.status(200).send(newarr);
        } else {
            res.status(500).send(err);
        }
    })
})

module.exports = router