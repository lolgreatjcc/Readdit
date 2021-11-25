console.log("---------------------------------");
console.log(" ADES > CA1 > Readdit > model > user.js");
console.log("---------------------------------");
// Imports
var sequelize = require('./sequelize/databaseModel.js');
const { Subreaddit, User } = sequelize.models;
const { Op } = require("sequelize");

var subreaddit = {
    createSubreaddit: function (subreaddit_name, description, creator_user_id, callback) {
        Subreaddit.create({
            subreaddit_name: subreaddit_name,
            subreaddit_description: description,
            fk_creator_user_id: creator_user_id
            
        }).then(function (result) {
            return callback(null, result);
        }).catch(function (err) {
            console.log("Error: " + err)
            return callback(err, null);
        })
    },
    // Get all subreaddits
    getAll: function (callback) {
        // find multiple entries
        Subreaddit.belongsTo(User, { foreignKey: 'fk_creator_user_id' });

        Subreaddit.findAll({
            raw: true, include: [{
                model: User,
                required: true,
                attributes: [['username', 'creator']],
            }]
        }).then(function (result) {
            return callback(null, result);
        })
        
    },

    getSubreaddit: function (subreaddit_name, callback) {
        Subreaddit.findOne({
            where: { subreaddit_name: subreaddit_name }
        }).then(function (result) {
            return callback(null, result);
        }).catch(function (err) {
            return callback(err, null);
        })
    },

    getSubreadditByID: function (subreaddit_id, callback) {
        Subreaddit.findOne({
            where: {subreaddit_id: subreaddit_id}
        }).then( function (result) {
            return callback(null,result);
        }).catch( function (err) {
            return callback(err,null);
        })
    },

    searchSubreaddit: function (subreaddit_name, callback) {
        Subreaddit.findAll({
            where: { subreaddit_name: { [Op.like]: subreaddit_name + "%" } }
        }).then(function (result) {
            return callback(null, result);
        }).catch(function (err) {
            return callback(err, null);
        })
    },

    delete: function (subreaddit_id, callback) {
        Subreaddit.destroy({
            where: { subreaddit_id: subreaddit_id }
        }).then(function (result) {
            return callback(null, result);
        })
    },

    edit: function (subreaddit_id, subreaddit, callback) {
        var subreaddit_name = subreaddit.subreaddit_name;
        var subreaddit_description = subreaddit.subreaddit_description;
        Subreaddit.findOne({ where: {

            [Op.and]: [
                { subreaddit_id: subreaddit_id }
            ]
        } })
        .then(function (result) {
            console.log("Result: " + result)
            if (typeof result === "undefined" || result == null) {
                var result = "Wrong Password";
                return callback(true, null); 
            }
            else {
                Subreaddit.update(
                    {
                        subreaddit_name: subreaddit_name,
                        subreaddit_description: subreaddit_description,
                    },
                    { where: { subreaddit_id: subreaddit_id } }
                )
                    .then(function (result) {
                        return callback(null, result);
                    })
            }
        })

    },

    getModerators: function (subreaddit_name, callback) {
        Subreaddit.findAll({
            where: {subreaddit_name: subreaddit_name}
        }).then( function (result) {
            return callback(null,result);
        }).catch( function (err) {
            return callback(err,null);
        })
    },
}


module.exports = subreaddit;