const media = require("../model/media");

const express = require('express');
const router = express.Router();
const printDebugInfo = require('./printDebugInfo');

//getoneuser
router.get('/media/:id',printDebugInfo, function (req, res) {
    var fk_post_id = req.params.id;
    
    media.getMedia(fk_post_id, function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({"Result:":"Internal Server Error"});
        }
    });

});

//getoneuser
router.get('/subreaddit/:id',printDebugInfo, function (req, res) {
    var subreaddit_id = req.params.id;
    
    media.getAllMediaBySubreaddit(subreaddit_id, function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({"Result:":"Internal Server Error"});
        }
    });

});

module.exports = router