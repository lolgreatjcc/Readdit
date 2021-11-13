const express = require('express');
const router = express.Router();
const moderator = require('../model/moderator')
const subreaddit = require('../model/subreaddit');
const printDebugInfo = require('./printDebugInfo');
const verify = require('./verify');

function checkOwner(req, res, next){
     var subreaddit_id = req.params.subreaddit_id 
    
    console.log("Subreaddit_id: " + subreaddit_id);
    subreaddit.getSubreadditByID(subreaddit_id, function (err, result) {
        if(!err) {
            var {fk_creator_user_id} = result;
            if (fk_creator_user_id == req.body.token_user_id){
                next();
            }
            else{
                res.status(403).send({"Error":"Not Owner"});
            }
        }else {
            console.log(err);
            // tbd
            res.status(500).send(err);
        }
        
    })
}

// Get all moderators
router.get('/:subreaddit_id', printDebugInfo, (req,res) => {

    var subreaddit_id = req.params.subreaddit_id;
    
    moderator.getModerators(subreaddit_id, function (err, result) {
        if(!err) {
            res.status(200).send({"Result": result});
        }else {
            console.log(err);
            // tbd
            res.status(500).send(err);
        }
        
    })
})


//Add a moderator
router.post('/:subreaddit_id/:user_id', printDebugInfo, verify.extractUserId, checkOwner, (req,res) => {

    var {subreaddit_id,user_id} = req.params;
    
    moderator.addModerator(subreaddit_id, user_id, function (err, result) {
        if(!err) {
            res.status(200).send({"Result": result});
        }else {
            console.log(err);
            // tbd
            res.status(500).send(err);
        }
        
    })
})

// Delete one moderator
router.delete('/:moderator_id/:subreaddit_id', printDebugInfo, verify.extractUserId, checkOwner, (req,res) => {

    var moderator_id = req.params.moderator_id;

    moderator.deleteModerator(moderator_id, function (err, result) {
        if(!err) {
            res.status(200).send({"Result": result});
        }else {
            console.log(err);
            // tbd
            res.status(500).send(err);
        }
        
    })
})





module.exports = router;