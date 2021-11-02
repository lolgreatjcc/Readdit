console.log("---------------------------------");
console.log(" ADES > CA1 > Readdit > model > user.js");
console.log("---------------------------------");
// Imports
var sequelize = require('./sequelize/databaseModel.js');
const { Subreaddit, User } = sequelize.models;

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
    getSubreaddit: function (subreaddit_name, callback) {
        Subreaddit.findOne({
            where: {subreaddit_name: subreaddit_name}
        }).then( function (result) {
            return callback(null,result);
        }).catch( function (err) {
            return callback(err,null);
        })
    }
}


module.exports = subreaddit;