console.log("---------------------------------");
console.log(" ADES > CA1 > Readdit > model > moderator.js");
console.log("---------------------------------");
// Imports
var sequelize = require('./sequelize/databaseModel.js');
const {Moderator, User} = sequelize.models;
const { Op } = require("sequelize");

var moderator = {
    getModerators: function (fk_subreaddit_id, callback) {
        Moderator.belongsTo(User, { foreignKey: 'fk_user_id' });
        Moderator.findAll({
            where: {fk_subreaddit_id: fk_subreaddit_id},
            raw: true,
            include: [{
                model: User,
                required: true,
                attributes : ["username"]
            }]
            
        }).then( function (result) {
            return callback(null,result);
        }).catch( function (err) {
            return callback(err,null);
        })
    },
    addModerator: function (subreaddit_id, user_id, callback) {
        Moderator.findOne({ where: {[Op.and]: [
            { fk_subreaddit_id: subreaddit_id },
            { fk_user_id: user_id }
        ] } })
        .then(function (result) {
            if (result == null) {
                Moderator.create({
                    fk_subreaddit_id: subreaddit_id,
                    fk_user_id: user_id,
                }).then(function (result) {
                    console.log("Result: " + JSON.stringify(result));
                    return callback(null, result);
                })
            }
            else {
                var result = "duplicate";
                return callback(null, result);
            }
        })
    },
    deleteModerator: function (moderator_id, callback) {
        Moderator.destroy({
            where: { moderator_id: moderator_id },
            
        }).then( function (result) {
            return callback(null,result);
        }).catch( function (err) {
            return callback(err,null);
        })
    },
    checkModerator: function (fk_user_id, subreaddit_id, callback) {
        Moderator.findOne({ where: {[Op.and]: [
            { fk_subreaddit_id: subreaddit_id },
            { fk_user_id: fk_user_id }
        ] } })
        .then(function (result) {
            if (result != null) {
                return callback(null, result)
            }
            else {
                var err = "Not a moderator";
                return callback(err, null);
            }
        })
    },
}


module.exports = moderator;