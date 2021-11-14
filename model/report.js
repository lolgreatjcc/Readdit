var sequelize = require('./sequelize/databaseModel.js');
const { Report, User, Post, Subreaddit } = sequelize.models;

const { Op } = require("sequelize");

var report = {
    createReport: function (report_description, fk_post_id, fk_user_id, callback) {
        Report.create({
            report_description: report_description,
            fk_post_id: fk_post_id,
            fk_user_id: fk_user_id
        }).then(function (result) {
            console.log("Result: " + JSON.stringify(result));
            return callback(null, result);
        })
    },

    getReport: function (report_id, callback) {
        Report.findByPk(report_id, {
            attributes: ['report_id','report_description','fk_post_id','fk_user_id','created_at'],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
            ],
        }).then(function (result) {
            console.log(result)

            callback(null,result)
        }).catch(function (err) {
            console.log(err)
            callback(err, null)
        })
    },

    getAll: function (callback) {
        // find multiple entries
        Report.findAll({
            attributes: ['report_id','report_description','fk_post_id','fk_user_id','created_at'],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
            ],
        }).then(function (result) {
            console.log(result)

            callback(null, result)
        }).catch(function (err) {
            console.log(err)
            callback(err, null)
        })
    },

    getAllBySubreaddit: function (subreaddit_id, callback) {
        // find multiple entries
        Report.findAll({
            attributes: ['report_id','report_description','fk_post_id','fk_user_id','created_at'],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Post,
                    where: {
                        fk_subreaddit_id: subreaddit_id
                      },
                    attributes: {exclude: ['password']}
                }
            ],
        }).then(function (result) {
            console.log(result)

            callback(null, result)
        }).catch(function (err) {
            console.log(err)
            callback(err, null)
        })
    },

    delete: function (report_id, callback) {
        Report.destroy({
            where: { report_id: report_id }
        }).then(function (result) {
            return callback(null, result);
        })
    },
}

module.exports = report;
