const express = require('express');
const router = express.Router();
const subreaddit = require('../model/subreaddit')
const verify = require('./verify');

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

// Creates a New Community/Subreaddit
router.post('/create', printDebugInfo, (req,res) => {

    // # rmb to add check for user id
    var community_name = req.body.subreaddit_name;
    var description = req.body.description;
    var creator_user_id = req.body.user_id;

    
    subreaddit.createSubreaddit(community_name, description, creator_user_id, function (err, result) {
        if(!err) {
            console.log(result);
            res.status(201).send({ "Result": "Subreaddit created successfully."})
        }else {
            console.log(err.name);
            if(err.name == "SequelizeUniqueConstraintError") {
                res.status(409).send({ "ErrorMsg": "Duplicate Entry. Subreaddit already exists."})
            }
            else if(err.name == "SequelizeValidationError") {
                res.status(403).send({ "ErrorMsg": "Please ensure that all inputs are filled and correct."})
            }
            else {
                res.status(400).send({ "ErrorMsg": "Something wrong happened."})
            }
        }
    })
})

// Get all Subreaddits
router.get('/subreaddits', printDebugInfo, (req,res) => {

    subreaddit.getAll(function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            console.log("Error: " + err);
            res.status(500).send({"Result:":"Internal Server Error"});
        }
    });

});

// router.get('/allSubreaddits', (req,res) => {
//     subreaddit.getAllSubreaddits(function (err,result) {
//         console.log(err);
//         if(!err){
//             res.status(200).send(result);
//         }
//         else {
//             res.status(500).send(err);
//         }
//     })
// })

// Get One Subreaddit by Name
router.get('/:subreaddit', (req,res) => {
    var requested_subreaddit = req.params.subreaddit;
    
    subreaddit.getSubreaddit(requested_subreaddit, function (err, result) {
        if(!err) {
            // var result = result[0];
            var output = {
                subreaddit_id : result.subreaddit_id,
                subreaddit_name: result.subreaddit_name,
                subreaddit_description: result.subreaddit_description,
                fk_creator_user_id: result.fk_creator_user_id,
                created_at: result.created_at
            }
            output = JSON.stringify(output)
            res.status(200).send(output);
        }else {
            console.log(err);
            // tbd
            res.status(500).send(err);
        }
        
    })
})


//check if logged in user is subreaddit owner
router.get('/checkOwner/:subreaddit', verify.extractUserId, (req,res) => {
    var requested_subreaddit = req.params.subreaddit;
    
    subreaddit.getSubreaddit(requested_subreaddit, function (err, result) {
        if(!err) {
            var {fk_creator_user_id} = result;
            if (fk_creator_user_id == req.body.token_user_id){
                res.status(200).send({"Result":"Is Owner"})
            }
            else{
                res.status(403).send({"Error":"Logged In user is not owner"});
            }
        }else {
            console.log(err);
            // tbd
            res.status(500).send(err);
        }
        
    })
})

// Get One Subreaddit by ID
router.get('/subreaddit/:subreaddit_id', (req,res) => {
    var subreaddit_id= req.params.subreaddit_id;
    
    subreaddit.getSubreadditByID(subreaddit_id, function (err, result) {
        if(!err) {
            var result = result.dataValues;
            var output = {
                subreaddit_name: result.subreaddit_name,
                subreaddit_description: result.subreaddit_description,
                created_at: result.created_at
            }
            output = JSON.stringify(output)
            res.status(200).send(output);
        }else {
            // tbd
            res.status(500).send(err);
        }
        
    })
})

//delete subreaddit
router.delete('/subreaddit/:subreadditid', printDebugInfo, function (req, res) {
    var subreaddit_id= req.params.subreadditid;

    subreaddit.delete(subreaddit_id, function (err, result) {
        if (!err) {
            res.status(204).send({"Result" : result});
        } else {
            res.status(500).send({ "Result:": "Internal Server Error" });
        }
    });

});

//edit subreaddit
router.put('/subreaddit/:subreadditid', printDebugInfo, function (req, res) {
    var subreaddit_id = req.params.subreadditid;

    var subreaddit_name = req.body.subreaddit_name
    var subreaddit_description = req.body.subreaddit_description;

    if (isNaN(subreaddit_id)) {
        res.status(400).send("Blank ID");
        return;
    }

    var data = {
        subreaddit_name: subreaddit_name,
        subreaddit_description: subreaddit_description,
    };

    subreaddit.edit(subreaddit_id, data, function (err, result) {
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

module.exports = router