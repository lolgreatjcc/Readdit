//ADES CA1 Play2Win
console.log("---------------------------------");
console.log(" ADES > CA1 > Readdit > controller > app.js");
console.log("---------------------------------");

//-----------------------------------
// imports
//-----------------------------------

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//imports for media upload
var path = require('path');
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


const user = require('../model/user.js');
const verify = require('./verify');
const subreadditModel = require('../model/subreaddit')
const mediaUpload = require("./mediaUpload");


const subreaddit = require('./subreaddit.js');
const post = require('./post.js');
const comment = require('./comment.js');
const moderator = require('./moderator.js')
const save = require('./save.js')
const vote = require('./vote.js');
const flair = require('./flair.js');

const media = require('./media.js');
const report = require('./report.js');

//-----------------------------------
// Middleware functions
//-----------------------------------
function printDebugInfo(req, res, next) {
    try{
    console.log();
    console.log("----------------[ Debug Info ]-----------------");
    //console.log(`Servicing ${urlPattern}..`);
    console.log("Servicing " + req.url + " ..");

    console.log("> req params:" + JSON.stringify(req.params));
    console.log("> req.body:" + JSON.stringify(req.body));
    console.log("> req.headers:" + JSON.stringify(req.headers));
    console.log(" req body (without JSON Parse): " + req.body)
    // console.log("> req.myOwnDebugInfo:" + JSON.stringify(req.myOwnDebugInfo));

    console.log("----------------[ Debug Info ]-----------------");
    console.log();


    next();
    }
    catch(error){
        console.log("Error in printDebugInfo. Error: " + error);
        next();
    }
}

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
var cors = require('cors');



//-----------------------------------
// MF configurations
//-----------------------------------
app.use(urlencodedParser);
app.use(jsonParser);

app.options('*', cors());
app.use(cors());

//-----------------------------------
// endpoints
//-----------------------------------

//default endpoint
app.get('/', (req, res) => {
    console.log("GET > '/' > Readdit Active");

    res.status(200).send({
        "Result": "GET > '/' > Readdit Active"
        });
    res.end();
});

//-----------------------------------
// user endpoints
//-----------------------------------

//getallusers
app.get('/users',printDebugInfo, function (req, res) {

    user.getAll(function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({"message":"Error getting all users."});
        }
    });

});

//getoneuser
app.get('/users/:user_id',printDebugInfo, verify.verifySameUserId, function (req, res) {
    var userid = req.params.user_id;
    
    user.getUser(userid, function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({"message":"Error getting user details"});
        }
    });

});

//adduser
app.post('/users', upload.single("image"), printDebugInfo, function (req, res) { 
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var pfp = req.body.profile_pic;
    var two_fa = req.body.two_fa;
    var fk_user_type_id = req.body.fk_user_type_id;

    function submitEdit(profile_pic){
        user.addUser(username, password, email, profile_pic, two_fa, fk_user_type_id, function (err, result) {
            if (!err) {
                if (result == "duplicate") {
                    res.status(422).send({ "message": "User already exists!" });
                }
                else {
                    res.status(201).send({"Result" : result})
                }
            } 
            else {
                res.status(500).send({"message":"Internal Server Error"});
            }
        }); 
    }

    var file = req.file;
    if (file != null){
        console.log("Image Uploading...")

        mediaUpload(file, function (err,result){
            if (result){
                var profile_pic = result.media_url;
                submitEdit(profile_pic)
            }
            else{
                if (err.message == "File too big!" || err.message == "Invalid File Type"){
                    res.status(400).send({"message": err.message})
                }
                else{
                    res.status(500).json({"message": err.message});
                }
            }
        })
    }
    else{
        console.log("No Image");
        submitEdit(pfp);
    }  

});

//edit user
app.put('/users/:user_id', upload.single("image"), printDebugInfo, verify.verifySameUserId,  function (req, res) {
    var user_id = req.params.user_id;
    var old_password = req.body.oldpwd;
    var pfp = req.body.profile_pic;
    var two_fa = parseInt(req.body.two_fa);

    if (isNaN(user_id)) {
        res.status(400).send({"message":"Blank ID"});
        return;
    }
    else{
        user.checkPassword(user_id, old_password, function (err, result) {
            if (!err) {
                var file = req.file;
                if (file != null){
                    console.log("Image Uploading...")
    
                    mediaUpload(file, function (err,result){
                        if (result){
                            var profile_pic = result.media_url;
                            submitEdit(profile_pic)
                        }
                        else{
                            res.status(500).json({"message":err.message});
                        }
                    })
                }
                else{
                    console.log("No Image");
                    submitEdit(pfp);
                }   
            }
            else {
                if (err.message == "Wrong Password!"){
                    res.status(401).send({"message":err.message});
                }
                res.status(500).send({"message":"Error checking password."});
            }
        });
    }

    function submitEdit(profile_pic){
        var data = {
            username: req.body.username,
            old_password: old_password,
            new_password: req.body.newpwd,
            email: req.body.email,
            profile_pic: profile_pic,
            two_fa: two_fa,
            fk_user_type_id: req.body.fk_user_type_id
        };
    
        user.edit(user_id, data, function (err, result) {
            if (!err) {
                var output = {
                    "success": true,
                    "affected rows": result.affectedRows,
                    "changed rows": result.changedRows
                };
                res.status(200).send(output);
            }
            else {
                if (err.message == "Wrong Password!"){
                    res.status(401).send({"message": err.message});
                }
                res.status(500).send({"message":"Error editing user details."});
            }
        });
    }    
});

//update user
app.put('/user/:user_id',  printDebugInfo, function (req, res) {
    var user_id = req.params.user_id;
    var profile_pic = req.body.profile_pic;

    if (isNaN(user_id)) {
        res.status(400).send({"message":"Blank ID"});
        return;
    }
    else{
        var data = {
            profile_pic: profile_pic,
            fk_user_type_id: req.body.fk_user_type_id
        };
    
        user.update(user_id, data, function (err, result) {
            if (!err) {
                var output = {
                    "success": true,
                    "affected rows": result.affectedRows,
                    "changed rows": result.changedRows
                };
                res.status(200).send(output);
            }
            else {
                res.status(500).send({"message":"Error updating user info."});
            }
        });
    }
});

//delete user
app.delete('/users/:userid', printDebugInfo, function (req, res) {
    var userid = req.params.userid;

    user.delete(userid, function (err, result) {
        if (!err) {
            res.status(204).send({"Result" : result});
        } else {
            res.status(500).send({"message":"Error deleting user." });
        }
    });

});

app.get('/usernameSearch/:username', printDebugInfo, function (req, res) {
    var username = req.params.username;

    user.getUserByUsername(username, function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({"message":"Error getting user info."});
        }
    });

});

//login
app.post('/api/login', printDebugInfo, function (req, res) {

    var email = req.body.email;
    var password = req.body.password;
    
    user.login(email, password, function (err, token, result) {
        if (!err) {
            if (!result) {
                // this is matched to callback(null, null, null)
                var message = {"message":"Invalid Credentials"};

                res.status(401).send(message);
            }
            else {
                // this is matched to callback(null, not null)
                console.log("token: " + token);
                
                var message = {
                    "UserData": JSON.stringify(result),
                    "token": token
                }
                res.status(200).send(message);
            }

        } else {
            // this is matched to callaback(not null, null)
            res.status(500).send({"message":"Error authenticating user."});
        }

    });


});

//get user_id from token
app.get('/getUserId',printDebugInfo, verify.extractUserId ,function (req, res) {
    res.status(200).send({"user_id":req.body.token_user_id})
});


app.use('/comment', comment);

app.use('/r', subreaddit);

app.use('/post', post);

app.use('/save', save);

app.use('/moderator/', moderator);

app.use('/vote', vote);

app.use('/flair', flair)

app.use('/media/', media);

app.use('/report/', report);

//-----------------------------------
// exports
//-----------------------------------
module.exports = app;