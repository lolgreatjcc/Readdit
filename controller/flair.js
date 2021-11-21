const express = require('express');
const router = express.Router();
const flair = require('../model/flair');
const moderator = require('../model/moderator');
const subreaddit = require("../model/subreaddit")
const printDebugInfo = require('./printDebugInfo');
const verify = require('./verify');
const hexRegex = new RegExp("^#[0-9a-fA-F]{6}$");



// functions
function checkModerator(req, res, next) {
    try{
        var fk_subreaddit_id = req.body.fk_subreaddit_id;
        var fk_user_id = req.body.user_id;
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
                        res.status(403).send({"message":"Logged In user is not moderator"});
                    }
                }else {
                    res.status(500).send({"message":"Error while getting subreaddit info."});
                }
                
            })
        }

    })
    }
    catch(error){
        res.status(500).send({'message':"Error while checking authorisation."})
    }
    
}


// Get all flairs
router.get('/:fk_subreaddit_id', printDebugInfo, (req,res) => {

    var fk_subreaddit_id = req.params.fk_subreaddit_id;
    
    flair.getFlairs(fk_subreaddit_id, function (err, result) {
        if(!err) {
            res.status(200).send({"Result": result});
        }else {
            console.log(err);
            res.status(500).send({"message":"Error getting subreaddit flairs."});
        }
        
    })
})

//Add a flair
router.post('/', printDebugInfo, verify.verifySameUserId, checkModerator, (req,res) => {

    var {flair_name,flair_colour,fk_subreaddit_id} = req.body;
    
    if (flair_name == null || typeof flair_name == "undefined" || flair_name.trim().length == 0){
        res.status(400).send({"message":"No flair name given"});
    }
    else if (!hexRegex.test(flair_colour)){
        res.status(400).send({"message":"Invalid Flair Colour"});
    }
    else if (fk_subreaddit_id == null || typeof fk_subreaddit_id == "undefined"){
        res.status(400).send({"message":"Subreaddit id not given"});
    }
    else{
        flair.addFlair(flair_name, flair_colour, fk_subreaddit_id, function (err, result) {
            if(!err) {
                res.status(200).send({"Result": result});
            }else if (err.message == "Flair already exists!"){
                res.status(422).send(err);
            }else {
                console.log(err);
                res.status(500).send({"message":"Error while adding flair."});
            }
            
        })
    } 
})

// Delete one flair
router.delete('/:flair_id', printDebugInfo, verify.verifySameUserId, checkModerator, (req,res) => {

    var flair_id = req.params.flair_id;

    flair.deleteFlair(flair_id, function (err, result) {
        if(!err) {
            res.status(200).send({"Result": result});
        }else {
            console.log(err);
            res.status(500).send({"message":"Error deleting flairs."});
        }
        
    })
})





module.exports = router;