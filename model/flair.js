var sequelize = require('./sequelize/databaseModel.js');
const { Flair } = sequelize.models;
const { Op } = require("sequelize");

var flair = {
    getFlairs: function (fk_subreaddit_id, callback) {
        Flair.findAll({
            where: {fk_subreaddit_id: fk_subreaddit_id},            
        }).then( function (result) {
            return callback(null,result);
        }).catch( function (err) {
            return callback(err,null);
        })
    },
    addFlair: function (flair_name, flair_colour, fk_subreaddit_id, callback) {
        Flair.findOne({ where: {[Op.and]: [
            { flair_name: flair_name },
            { fk_subreaddit_id: fk_subreaddit_id }
        ] } })
        .then(function (result) {
            if (result == null) {
                Flair.create({
                    flair_name: flair_name,
                    flair_colour: flair_colour,
                    fk_subreaddit_id: fk_subreaddit_id
                }).then(function (result) {
                    console.log(result)
                    return callback(null,result);
                }).catch(function (err) {
                    console.log(err)
                    return callback(err,null);
                })
            }
            else{
                return callback({"message":"Flair already exists!"},null)
            }

        })
    },
    deleteFlair: function (flair_id, callback) {
        Flair.destroy({
            where: { flair_id: flair_id },
            
        }).then( function (result) {
            return callback(null,result);
        }).catch( function (err) {
            return callback(err,null);
        })
    },
}

module.exports = flair;