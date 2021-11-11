var express = require('express');
var router = express.Router();

router.get("/saved", function(req, res) {
    res.status(200).sendFile('saved.html', {root: "./public/profile/"});
});

module.exports = router;