const express = require('express');
const router = express.Router();
const subreaddit = require('../model/subreaddit')
const verify = require('./verify');
const printDebugInfo = require('./printDebugInfo');

//functions
function similarity(string, string2) {
    var arr = string.split(" ");
    var arr2 = string2.split(" ");
    var checklst = [];
    //loop for number of words in input string2
    for (var count = 0; count < arr.length; count++) {
        //loop for number of words in database string
        for (var i = 0; i < arr2.length; i++) {
            var longer = arr[count];
            var shorter = arr2[i];
            if (arr[count].length < arr2[i].length) {
                longer = arr2[i];
                shorter = arr[count];
            }
            var longerLength = longer.length;
            var num = (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
            if (num > 0.4) {
                checklst.push(num);
            }
        }
        //run one check with the whole string intact
        longer = arr[count];
        shorter = string2;
        if (arr[count].length < string2.length) {
            longer = string2;
            shorter = string;
        }
        var longerLength = longer.length;

        var num = (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
        if (num > 0.4) {
            checklst.push(num);
        }
    }
    //run one check with the whole string2 intact
    for (var i = 0; i < arr2.length; i++) {
        var longer = string;
        var shorter = arr2[i];
        if (string.length < arr2[i].length) {
            longer = arr2[i];
            shorter = string;
        }
        var longerLength = longer.length;
        var num = (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
        if (num > 0.4) {
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
    if (num > 0.4) {
        checklst.push(num);
    }

    var result = 0;
    for (var i = 0; i < checklst.length; i++) {
        result += checklst[i];
    }

    return (result / checklst.length);
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

// Creates a New Community/Subreaddit
router.post('/create', printDebugInfo, verify.extractUserId, (req, res) => {

    // # rmb to add check for user id
    var community_name = req.body.subreaddit_name;
    var description = req.body.description;
    var creator_user_id = req.body.token_user_id;


    if (community_name.length > 45) {
        res.status(400).send({ 'message': "Subreaddit name too long. Max 45 characters." })
    }
    else if (description.length > 100) {
        res.status(400).send({ 'message': "Description is too long. Max 100 characters." })
    }
    else {
        subreaddit.createSubreaddit(community_name, description, creator_user_id, function (err, result) {
            if (!err) {
                res.status(201).send({ "Result": "Subreaddit created successfully." })
            } else {
                if (err.name == "SequelizeUniqueConstraintError") {
                    res.status(409).send({ 'message': "Duplicate Entry. Subreaddit already exists." })
                }
                else if (err.name == "SequelizeValidationError") {
                    res.status(403).send({ 'message': "Please ensure that all inputs are filled and correct." })
                }
                else {
                    res.status(500).send({ 'message': "Error while creating subreaddit." })
                }
            }
        })
    }

})

// Get all Subreaddits
router.get('/subreaddits', printDebugInfo, (req, res) => {

    subreaddit.getAll(function (err, result) {
        if (!err) {
            res.status(200).send({ "Result": result });
        } else {
            console.log("Error: " + err);
            res.status(500).send({ "message:": "Error getting all subreaddits." });
        }
    });

});

// Get One Subreaddit by Name
router.get('/:subreaddit', (req, res) => {
    var requested_subreaddit = req.params.subreaddit;

    subreaddit.getSubreaddit(requested_subreaddit, function (err, result) {
        if (!err) {

            if (result.length == 0) {
                res.status(400).send({ 'message': "Subreaddit doesn't exist. Consider creating it." });
            }
            else {
                var output = {
                    subreaddit_id: result.subreaddit_id,
                    subreaddit_name: result.subreaddit_name,
                    subreaddit_description: result.subreaddit_description,
                    fk_creator_user_id: result.fk_creator_user_id,
                    created_at: result.created_at
                }
                output = JSON.stringify(output)
                res.status(200).send(output);
            }

        } else {
            console.log(err);
            res.status(500).send({ 'message': "Error getting subreaddit." });
        }

    })
})


//check if logged in user is subreaddit owner
router.get('/checkOwner/:subreaddit', verify.extractUserId, (req, res) => {
    var requested_subreaddit = req.params.subreaddit;

    subreaddit.getSubreaddit(requested_subreaddit, function (err, result) {
        if (!err) {
            var { fk_creator_user_id } = result;
            if (fk_creator_user_id == req.body.token_user_id) {
                res.status(200).send({ "Result": "Is Owner" })
            }
            else {
                res.status(403).send({ "message": "Logged In user is not owner" });
            }
        } else {
            res.status(500).send(err);
        }

    })
})

// Get One Subreaddit by ID
router.get('/subreaddit/:subreaddit_id', (req, res) => {
    var subreaddit_id = req.params.subreaddit_id;

    subreaddit.getSubreadditByID(subreaddit_id, function (err, result) {
        if (!err) {
            if (result.length == 0) {
                res.status(400).send({ 'message': "Subreaddit doesn't exist. Consider creating it." });
            } else {
                var result = result.dataValues;
                var output = {
                    subreaddit_name: result.subreaddit_name,
                    subreaddit_description: result.subreaddit_description,
                    created_at: result.created_at
                }
                output = JSON.stringify(output)
                res.status(200).send(output);
            }

        } else {
            res.status(500).send({ 'message': "Error in retrieving subreaddit." });
        }

    })
})

//delete subreaddit
router.delete('/subreaddit/:subreadditid', printDebugInfo, function (req, res) {
    var subreaddit_id = req.params.subreadditid;

    subreaddit.delete(subreaddit_id, function (err, result) {
        if (!err) {
            res.status(204).send({ "Result": result });
        } else {
            res.status(500).send({ "Result:": "Internal Server Error" });
        }
    });

});


//search for subreaddit
router.get('/search/query', printDebugInfo, function (req, res) {
    var query = req.query.query;

    subreaddit.searchSubreaddit(query, function (err, result) {
        if (!err) {
            res.status(200).send({ "Result": result });
        } else {
            res.status(500).send({ "message": "Internal Server Error" });
        }
    });
});

//edit subreaddit
router.put('/subreaddit/:subreadditid', printDebugInfo, function (req, res) {
    var subreaddit_id = req.params.subreadditid;

    var subreaddit_name = req.body.subreaddit_name
    var subreaddit_description = req.body.subreaddit_description;

    if (isNaN(subreaddit_id)) {
        res.status(400).send({ "message": "Blank ID" });
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
            res.status(500).send({ "Result:": "Internal Server Error" });
        }
    });
});

//smart search subreaddits
router.get('/SimilarSearch/:word', function (req, res) {
    var word = req.params.word;

    subreaddit.getAll(function (err, result) {
        if (!err) {
            var newarr = [];
            for (var i = 0; i < result.length; i++) {
                if (similarity(word, result[i].subreaddit_name) > 0.4) {
                    result[i].similar = parseFloat(similarity(word, result[i].subreaddit_name));
                    newarr.push(result[i]);
                }
            }
            res.status(200).send(newarr);
        } else {
            res.status(500).send({ "message": "Internal Server Error" });
        }
    })
});

module.exports = router