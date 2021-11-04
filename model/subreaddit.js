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
        }).then( function (result) {
            return callback(null,result);
        }).catch( function (err) {
            return callback(err,null);
        })
    },

    // getAll: function (callback) {
    //     // find multiple entries
    //     Subreaddit.findAll({ raw: true, attributes: ['subreaddit_id', 'subreaddit_name', 'subreaddit_description', 'fk_creator_user_id', 'created_at']}).then(function (result) {
    //         return callback(null, result);
    //     })
    // },
    
    // Get all subreaddits
    getAll: function (callback) {
        // find multiple entries
        Subreaddit.belongsTo(User, { foreignKey: 'fk_creator_user_id' });

        Subreaddit.findAll({ raw: true, include: [{
            model: User,
            required: true,
            attributes: [['username','creator']],
           }]}).then(function (result) {
            return callback(null, result);
        })
    },
      
    getSubreaddit: function (subreaddit_name, callback) {
        Subreaddit.findOne({
            where: {subreaddit_name: subreaddit_name}
        }).then( function (result) {
            return callback(null,result);
        }).catch( function (err) {
            return callback(err,null);
        })
    },

    searchSubreaddit: function (subreaddit_name, callback){
        Subreaddit.findAll({
            where: {subreaddit_name: {[Op.like]: subreaddit_name + "%"}}
        }).then( function (result) {
            return callback(null,result);
        }).catch( function (err) {
            return callback(err,null);
        })
    }
//     getAllSubreaddits: function (callback) {
//         Subreaddit.findAll().then(function (result) { 
//             return callback(null,result);
//         }).catch(function (err) {
//             return callback(err,null)
//         })
//     }
}


module.exports = subreaddit;