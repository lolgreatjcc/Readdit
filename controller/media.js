const media = require("../model/media");

const express = require('express');
const router = express.Router();
const printDebugInfo = require('./printDebugInfo');

//Get media by post_id
router.get('/media/:id',printDebugInfo, function (req, res) {
    var fk_post_id = req.params.id;
    
    media.getMedia(fk_post_id, function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({message:"Failed to get post media."});
        }
    });

});

//Get media by subreaddit_id
router.get('/subreaddit/:id',printDebugInfo, function (req, res) {
    var subreaddit_id = req.params.id;
    
    media.getAllMediaBySubreaddit(subreaddit_id, function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({message:"Failed to get subreaddit post media."});
        }
    });

});

module.exports = router