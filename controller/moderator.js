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
            res.status(500).send("Error checking if user is owner.");
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
            res.status(500).send({message:"Error while getting moderators."});
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
            res.status(500).send({message:"Error while adding a moderator."});
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
            res.status(500).send({message:"Error while deleting a moderator."});
        }
        
    })
})

//check if logged in user is subreaddit moderator
router.get('/checkModerator/:subreaddit_name', verify.extractUserId, (req,res) => {
    var {subreaddit_name} = req.params;
    var fk_user_id = req.body.token_user_id;
    var fk_subreaddit_id;
    subreaddit.getSubreaddit(subreaddit_name, function(err,result){
        if(!err) {
            fk_subreaddit_id = result.subreaddit_id;

            moderator.checkModerator(fk_user_id, fk_subreaddit_id, function (err, result) {
                if(!err) {
                    res.status(200).send({"Result":"Is Moderator"})
                }
                else if (err.message == "Not a moderator"){
                    res.status(403).send({message:"Logged In user is not moderator"});
                }
                else{
                    res.status(500).send({message:"Error checking if user is moderator."});
                }
                
            })
        }else {
            console.log(err);
            res.status(500).send({message:"Error getting subreaddit info."});
        }
    })
    
    
})





module.exports = router;