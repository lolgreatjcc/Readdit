const express = require('express');
const router = express.Router();
const report = require('../model/report.js');

const printDebugInfo = require('./printDebugInfo');

//addReport
router.post('/report', printDebugInfo, function (req, res) { 
    var report_description = req.body.report_description;
    var fk_post_id = req.body.fk_post_id;
    var fk_user_id = req.body.fk_user_id;

    report.createReport(report_description, fk_post_id, fk_user_id, function (err, result) {
        if (!err) {
            res.status(201).send({"Result" : result})
        } 
        else {
            res.status(500).send({"message":"Error creating report."});
        }
    });   

});

//getallreports
router.get('/report',printDebugInfo, function (req, res) {

    report.getAll(function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({"message":"Error getting reports"});
        }
    });

});

//getonereport
router.get('/report/:id',printDebugInfo, function (req, res) {
    var report_id = req.params.id;
    
    report.getReport(report_id, function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({"message":"Error fetching requested report."});
        }
    });

});

//getallreportsinsubreaddit
router.get('/reports/:subreaddit_id',printDebugInfo, function (req, res) {
    var subreaddit_id = req.params.subreaddit_id;

    report.getAllBySubreaddit(subreaddit_id, function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({"message":"Error fetching reports in subreaddit."});
        }
    });

});

//delete report
router.delete('/report/:id', printDebugInfo, function (req, res) {
    var report_id = req.params.id;

    report.delete(report_id, function (err, result) {
        if (!err) {
            res.status(204).send({"Result" : result});
        } else {
            res.status(500).send({"message":"Error deleting report."});
        }
    });

});

module.exports = router;