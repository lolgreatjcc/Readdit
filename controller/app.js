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

var user = require('../model/user.js');
var verifyModule = require('./verify');
var verify = verifyModule.verify;
//-----------------------------------
// Middleware functions
//-----------------------------------
function printDebugInfo(req, res, next) {
    console.log();
    console.log("----------------[ Debug Info ]-----------------");
    //console.log(`Servicing ${urlPattern}..`);
    console.log("Servicing " + req.url + " ..");

    console.log("> req params:" + JSON.stringify(req.params));
    console.log("> req.body:" + JSON.stringify(req.body));
    // console.log("> req.myOwnDebugInfo:" + JSON.stringify(req.myOwnDebugInfo));

    console.log("----------------[ Debug Info ]-----------------");
    console.log();


    next();
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

//getallusers
app.get('/users',printDebugInfo, function (req, res) {

    user.getAll(function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({"Result:":"Internal Server Error"});
        }
    });

});

//getoneuser
app.get('/users/:user_id',printDebugInfo, verify, function (req, res) {
    var userid = req.params.user_id;
    
    user.getUser(userid, function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({"Result:":"Internal Server Error"});
        }
    });

});

//adduser
app.post('/users',printDebugInfo, function (req, res) { 
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var profile_pic = req.body.profile_pic;
    var two_fa = req.body.two_fa;
    var fk_user_type_id = req.body.fk_user_type_id;

    user.addUser(username, password, email, profile_pic, two_fa, fk_user_type_id, function (err, result) {
        if (!err) {
            if (result == "duplicate") {
                res.status(422).send({ "Result:": "Unprocessable Entity" });
            }
            else {
                res.status(201).send({"Result" : result})
            }
        } 
        else {
            res.status(500).send({"Result:":"Internal Server Error"});
        }
    });

});

//edit user
app.put('/users/:userid', printDebugInfo, function (req, res) {
    var userid = req.params.userid;

    if (isNaN(userid)) {
        res.status(400).send("Blank ID");
        return;
    }

    var data = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        profile_pic: req.body.profile_pic,
        two_fa: req.body.two_fa,
        fk_user_type_id: req.body.fk_user_type_id
    };

    user.edit(userid, data, function (err, result) {
        if (!err) {
            var output = {
                "success": true,
                "affected rows": result.affectedRows,
                "changed rows": result.changedRows
            };
            res.status(200).send(output);
        }
        else {
            res.status(500).send({"Result:":"Internal Server Error"});
        }
    });
});

//delete user
app.delete('/users/:userid', printDebugInfo, function (req, res) {
    var userid = req.params.userid;

    user.delete(userid, function (err, result) {
        if (!err) {
            res.status(204).send({"Result" : result});
        } else {
            res.status(500).send({ "Result:": "Internal Server Error" });
        }
    });

});

//login
app.post('/api/login', function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    user.login(email, password, function (err, token, result) {
        if (!err) {
            if (!result) {
                // this is matched to callback(null, null, null)
                var message = { "Error": "Invalid Login" };

                res.status(404).send(message);
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
            res.status(500);
            res.send(err.statusCode);
        }

    });


});
//-----------------------------------
// exports
//-----------------------------------
module.exports = app;