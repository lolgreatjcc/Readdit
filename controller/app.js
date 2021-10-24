/*
Class: DIT/FT/1B/03
Name: Tan Yong Rui
Admission Number: P2004147
*/

console.log("---------------------------------");
console.log("P2004147_CA2 > Back End > controller > app.js");
console.log("---------------------------------");

var express = require('express');


var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var verifyToken = require('../auth/verifyToken')
var cors = require('cors');

var User = require('../model/user');
var Category = require('../model/category');
var Game = require('../model/game');
var Review = require('../model/review');
//-----------------------------------
// Middleware functions
//-----------------------------------
/**
 *  prints useful debugging information about an endpoint
 *  we are going to service
 * 
 * @param {object} req 
 *  request object
 * 
 * @param {object} res 
 *  response object
 * 
 * @param {function} next 
 *  reference to the next function to call
 */
function printDebugInfo(req, res, next) {
    console.log();
    console.log("-------------------[ Debug Info ]--------------------");
    //console.log(`Servicing ${urlPattern} ..`);
    console.log("Servicing " + req.url + " ..");

    console.log("> req.params:" + JSON.stringify(req.params));
    console.log("> req.body:" + JSON.stringify(req.body));
    //console.log("> req.myOwnDebugInfo:" + JSON.stringify(req.myOwnDebugInfo));

    console.log("-----------------[ Debug Info Ends ]-----------------");
    console.log();

    next();
}

//-----------------------------------
// Functions
//-----------------------------------

function cleanDupe(result) {
    console.log("------ cleanDupe Log ------");
    console.log("To be cleaned:");
    console.log(result);
    var sortedResult = []
    if (!result) {
        return result;
    }
    if (result.length > 1) {
        for (i = 0; i < result.length; i++) {
            for (j = 0; j < i; j++) {
                if (result[j] != null && result[i] != null && result[j].gameid == result[i].gameid) {
                    result[i].catname += ", " + result[j].catname;
                    result[j] = null;
                }
            }
        }
        for (i = 0; i < result.length; i++) {
            if (result[i] != null) {
                sortedResult.push(result[i])
            }
        }

    }
    else if (result.length == 1) {
        sortedResult.push(result[0]);
    }
    console.log("sorted result: ")
    console.log(sortedResult)
    return sortedResult;
}

//-----------------------------------
// Middleware configurations
//-----------------------------------

app.use(bodyParser.json()); //parse appilcation/json data
app.use(urlencodedParser);
app.options('*', cors());
app.use(cors());

//-----------------------------------
// endpoints - User
//-----------------------------------


// CA2
app.post('/users/login', printDebugInfo, function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    User.loginUser(email, password, function (err, token, result) {
        if (err) {
            // this is matched to callback(not null, null, null)
            res.status(500);
            res.send(err.statusCode);

        }

        else {
            if (!result) {
                // this is matched to callback(null,null,null)
                res.status(404).send({ "Error": "Invalid login" });

            }
            else {
                // this is matched to callback(null, not null, not null)
                console.log("Token: " + token);
                res.status(200).send({
                    "Success": "C̶̜͠a̷̱͘n̴͎̒ ̸͈̅y̷̤͋ơ̶̼u̸̥͑ ̸̢͝ḧ̴́͜e̶̢͐ȁ̷̪r̶̘̓ ̷̘̈́m̸̲͘e̴͎̽?̷̜͘",
                    "token": token,
                    "UserData": JSON.stringify(result)
                });
            }
        }

    });


});

// return payload
app.get('/payload', printDebugInfo, verifyToken, function (req, res) {
    res.status(200).send({
        "type": req.type,
        "userid": req.userid
    });
});

// authentication and authorisation done
app.put('/user/:userid', printDebugInfo, verifyToken, function (req, res) {
    var userid = req.params.userid;
    if (parseInt(userid) !== req.userid) {
        console.log("----------- <app.js :: put('/users/:userID')>-----------");
        console.log("[Who are you]");
        console.log("User ID: " + req.userid);
        console.log("[Update who]");
        console.log("User ID: " + userid)
        console.log("----------- <app.js :: put('/users/:userID')>-----------");
        res.status(403).send("Forbidden");
        return;
    }

    var username = req.body.username;
    var email = req.body.email;
    var type = req.body.type;

    if (username.trim() == "" || email.trim() == "" || (type != "Customer" && type != "Admin")) {
        res.status(422).send("Invalid entries")
        return;
    }

    User.updateUser(userid, username, email, type, function (err, result) {
        if (!err) {
            res.send({
                "success": true,
                "affected rows": result.affectedRows,
                "changed rows": result.changedRows
            });
        } else {
            res.status(500).send("Some error");
        }
    });

});

//-----------------------------------
// endpoints - Category
//-----------------------------------
// Endpoint 4
app.post('/category', printDebugInfo, verifyToken, function (req, res) {
    console.log("----------- <app.js :: put('/users/:userID')>-----------");
    console.log("[Your Type/Role]");
    console.log("User ID: " + req.type);
    console.log("[Required Type]");
    console.log("Admin")
    console.log("----------- <app.js :: put('/users/:userID')>-----------");
    if (req.type !== "Admin") {
        res.status(403).send("Forbidden");
        return;
    }

    var catname = req.body.catname;
    var description = req.body.description;
    if (catname.trim() == "") {
        console.log("Empty catname.")
        res.status(422).send({
            'result': "failure",
            "error": "Empty category name received."
        })
        return;
    }
  

    Category.addCategory(catname, description, function (err, result) {
        if (!err) {
            res.status(200).send({ "result": "success" })
        }
        else if (result == null) {
            res.status(422).send({ "Result": "The category name provided already exists." })
        }

        else {
            res.status(500).send({ "Result": "Internal Error" });
        }
    });

});

app.get('/category', printDebugInfo, verifyToken, function (req, res) {
    Category.getAll(function (err, result) {
        if (!err) {
            res.status(200).send({
                "result": "success",
                "data": result
            })
        }
        else {
            res.status(500).send({ "Result": "Internal Error" });
        }
    });

});

//-----------------------------------
// endpoints - Game
//-----------------------------------
// Endpoint 6
app.post('/game', printDebugInfo, verifyToken, function (req, res) {
    if (req.type !== "Admin") {
        console.log("----------- <app.js :: put('/users/:userID')>-----------");
        console.log("[Your Type/Role]");
        console.log("User ID: " + req.type);
        console.log("[Required Type]");
        console.log("Admin")
        console.log("----------- <app.js :: put('/users/:userID')>-----------");
        res.status(403).send("Forbidden");
        return;
    }

    var title = req.body.title;
    var description = req.body.description;
    var price = req.body.price;
    var platform = req.body.platform;
    var categoryid = req.body.categoryid;
    var year = req.body.year;
    var imagePath = req.body.imagePath

    if (title.trim() == "" || description.trim() == "" || !(platform.toUpperCase() == "XBOX" || platform.toUpperCase() == "PC" || platform.toUpperCase() == "PS" || platform.toLowerCase() == "mobile") || categoryid.trim() == "" || (year + "").length != 4 || !imagePath.includes("./assets/")) {
        res.status(422).send({
            "result": "failure",
            "error": "Invalid value(s) detected"
        })
        return;
    }

    Game.addGame(title, description, price, platform, categoryid, year, imagePath, function (err, result) {
        if (!err) {
            res.status(201).send({ "result": "success" });
        } else {
            res.status(500).send({ "Result": "Internal Error" });
        }
    });

});


// Endpoint 7 but improved from CA1
app.get('/games/:platform/:title/:price/:page', printDebugInfo, function (req, res) {
    var platform = req.params.platform;
    var title = req.params.title;
    var price = req.params.price;
    var page = req.params.page
    if (platform == "All") {
        platform = "";
    };
    if (title == "{*,.}") {
        title = "";
    };
    if (price == "{*,.}") {
        price = "";
    };
    Game.findByMulti(title, platform, price, page, function (err, result) {
        if (!err) {
            res.status(200).send(cleanDupe(result));
        }
        else {
            res.status(500).send({ "Result": "Internal Error" });
        }
    });

});

app.get('/games/:platform/:title/:price/:page/length', printDebugInfo, function (req, res) {
    var platform = req.params.platform;
    var title = req.params.title;
    var price = req.params.price;
    var page = req.params.page
    if (platform == "All") {
        platform = "";
    };
    if (title == "{*,.}") {
        title = "";
    };
    if (price == "{*,.}") {
        price = "";
    };
    Game.findByMultiLength(title, platform, price, page, function (err, result) {
        if (!err) {
            if (result.length != 0) {
                console.log(result)
                res.status(200).send({ "Length": cleanDupe(result).length });
            }
            else {
                res.status(200).send({ "Length": 0 })
            }
        }
        else {
            res.status(500).send({ "Result": "Internal Error" });
        }
    });

});

app.get('/games/:page/all', printDebugInfo, function (req, res) {
    var page = req.params.page;
    Game.showAll(page, function (err, result) {
        if (!err) {
            res.status(200).send(cleanDupe(result));
        }
        else {
            res.status(500).send({ "Result": "Internal Error" });
        }
    });

});

app.get('/game/length/all', printDebugInfo, function (req, res) {
    Game.getLength(function (err, result) {
        if (!err) {
            res.status(200).send({ "length": cleanDupe(result).length });
        }
        else {
            res.status(500).send({ "Result": "Internal Error" });
        }
    });

});

// Endpoint 8
app.delete('/game/:id', printDebugInfo, verifyToken, function (req, res) {
    if (req.type !== "Admin") {
        console.log("----------- <app.js :: put('/users/:userID')>-----------");
        console.log("[Your Type/Role]");
        console.log("User ID: " + req.type);
        console.log("[Required Type]");
        console.log("Admin")
        console.log("----------- <app.js :: put('/users/:userID')>-----------");
        res.status(403).send("Forbidden");
        return;
    }

    var id = req.params.id;

    Game.deleteGame(id, function (err, result) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(500).send({ "Result": "Internal Error" });
        }
    });

});

// CA2
app.get('/games/:id', printDebugInfo, function (req, res) {
    var gameid = req.params.id;

    Game.findGameByID(gameid, function (err, result) {
        if (!err) {
            console.log(result.length)
            if (result.length == 0) {
                res.status(404).send("Not okay bro")
            }
            else {
                res.status(200).send(cleanDupe(result));
            }
        } else {
            res.status(500).send({ "Result": "Internal Error" });
        }
    });

});


//-----------------------------------
// endpoints - Review
//-----------------------------------
// Endpoint 10
app.post('/user/:uid/game/:gid/review/', printDebugInfo, verifyToken, function (req, res) {
    var uid = req.params.uid;

    if (parseInt(uid) !== req.userid) {
        console.log("----------- <app.js :: post('/user/:uid/game/:gid/review/')>-----------");
        console.log("[Who are you]");
        console.log("User ID: " + req.userid);
        console.log("[Post for who]");
        console.log("User ID: " + uid)
        console.log("----------- <app.js :: post('/user/:uid/game/:gid/review/')>-----------");
        res.status(403).send("Forbidden");
        return;
    }
    if (req.type !== "Customer") {
        console.log("----------- <app.js :: put('/users/:userID')>-----------");
        console.log("[Your Type/Role]");
        console.log("User ID: " + req.type);
        console.log("[Required Type]");
        console.log("Admin")
        console.log("----------- <app.js :: put('/users/:userID')>-----------");
        res.status(403).send("Forbidden");
        return;
    }

    var gid = req.params.gid;
    var content = req.body.content;
    var rating = req.body.rating;
    Review.addReview(gid, content, rating, uid, function (err, result) {
        if (!err) {
            res.status(201).send(result);
        } else {
            res.status(500).send({ "Result": "Internal Error" });
        }
    });

});

// Endpoint 11
app.get('/game/:id/review', printDebugInfo, function (req, res) {
    var id = req.params.id;

    Review.findByID(id, function (err, result) {
        if (!err) {
            if (result == null) {
                res.status(200).send([]);
            }
            else {
                res.status(200).send(result);
            }
        }
        else {
            res.status(500).send({ "Result": "Internal Error" });
        }
    });

});


module.exports = app;