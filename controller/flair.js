const express = require('express');
const router = express.Router();
const flair = require('../model/flair');
const printDebugInfo = require('./printDebugInfo');
const verify = require('./verify');
const hexRegex = new RegExp("^#[0-9a-fA-F]{6}$");




// Get all flairs
router.get('/:fk_subreaddit_id', printDebugInfo, (req,res) => {

    var fk_subreaddit_id = req.params.fk_subreaddit_id;
    
    flair.getFlairs(fk_subreaddit_id, function (err, result) {
        if(!err) {
            res.status(200).send({"Result": result});
        }else {
            console.log(err);
            // tbd
            res.status(500).send(err);
        }
        
    })
})


//Add a flair
router.post('/', printDebugInfo, verify.extractUserId, (req,res) => {

    var {flair_name,flair_colour,fk_subreaddit_id} = req.body;
    
    if (flair_name == null || typeof flair_name == "undefined" || flair_name.trim().length == 0){
        res.status(400).send({'Error':"No flair name given"});
    }
    else if (!hexRegex.test(flair_colour)){
        res.status(400).send({'Error':"Invalid Flair Colour"});
    }
    else if (fk_subreaddit_id == null || typeof fk_subreaddit_id == "undefined"){
        res.status(400).send({'Error':"subreaddit id not given"});
    }
    else{
        flair.addFlair(flair_name, flair_colour, fk_subreaddit_id, function (err, result) {
            if(!err) {
                res.status(200).send({"Result": result});
            }else {
                console.log(err);
                // tbd
                res.status(500).send(err);
            }
            
        })
    } 
})

// Delete one flair
router.delete('/:flair_id', printDebugInfo, verify.extractUserId, (req,res) => {

    var flair_id = req.params.flair_id;

    flair.deleteFlair(flair_id, function (err, result) {
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