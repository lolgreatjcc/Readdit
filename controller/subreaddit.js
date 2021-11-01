const express = require('express');
const router = express.Router();
const subreaddit = require('../model/subreaddit')

// Creates a New Community/Subreaddit
router.post('/create', (req,res) => {

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



module.exports = router