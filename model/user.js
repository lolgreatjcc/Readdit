//ADES CA1 Play2Win
console.log("---------------------------------");
console.log(" ADES > CA1 > Readdit > model > user.js");
console.log("---------------------------------");

//-----------------------------------
// imports
//-----------------------------------
var db = require('./databaseConfig.js');
var config = require('../config.js');
var jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

var sequelize = require('./sequelize/databaseModel.js');
const e = require('express');
const { User, User_Type } = sequelize.models;

//-----------------------------------
// objects / functions
//-----------------------------------
var user = {

    login: function (email, password, callback) {
        User.findAll({
            attributes: ['user_id', 'username', 'fk_user_type_id'],
            where: {
              
                [Op.and]: [
                    { email: email },
                    { password: password }
                ]
            }
        })
            .then(function (result) {
                if (result.length == 0) {
                    return callback(null, null, null);
                }
                // it must be that we have ONE result here,
                // since the email is Unique
                else {
                    //confirm if we have the key
                    console.log("Secret Key: " + config.key);
                    console.log("Result[0] userid: " + result[0].user_id);
                    console.log("Result: " + result)
                    //generate the token

                    var token = jwt.sign(
                        // (1) Payload
                        {
                            userid: result[0].user_id,
                            type: result[0].fk_user_type_id
                        },
                        // (2) Secret Key
                        config.key,
                        // (3) Lifretime of token
                        {
                            //expires in 24 hrs
                            expiresIn: 86400
                        }
                    );
                    return callback(null, token, result);
                }
            })
    },

    getUser: function (userid, callback) {
        User.findByPk(userid, { raw: true, attributes: ['user_id', 'username', 'email', 'profile_pic', 'two_fa', 'fk_user_type_id'] }).then(function (result) {
            return callback(null, result);
        })
    },

    getAll: function (callback) {
        // find multiple entries
        User.findAll({ raw: true, attributes: ['user_id', 'username', 'email', 'profile_pic', 'two_fa', 'fk_user_type_id'] }).then(function (result) {
            return callback(null, result);
        })
    },

    addUser: function (username, password, email, profile_pic, two_fa, fk_user_type_id, callback) {
        User.findOne({ where: { email:email } })
        .then(function (result) {
            if (result == null) {
                User.create({
                    username: username,
                    password: password,
                    email: email,
                    profile_pic: profile_pic,
                    two_fa: two_fa,
                    fk_user_type_id: fk_user_type_id
                }).then(function (result) {
                    return callback(null, result);
                })
            }
            else {
                var result = "duplicate";
                return callback(null, result);
            }
        })
    },

    edit: function (userid, user, callback) {
        var username = user.username;
        var password = user.password;
        var email = user.email;
        var profile_pic = user.profile_pic;
        var two_fa = user.two_fa;
        var fk_user_type_id = user.fk_user_type_id;

        User.update(
            {
                username: username,
                password: password,
                email: email,
                profile_pic: profile_pic,
                two_fa: two_fa,
                fk_user_type_id: fk_user_type_id
            },
            { where: { user_id: userid } }
        )
            .then(function (result) {
                return callback(null, result);
            })
    },

    delete: function (userid, callback) {
        User.destroy({
            where: { user_id: userid }
        }).then(function (result) {
            return callback(null, result);
        })
    }
}

//-----------------------------------
// exports
//-----------------------------------
module.exports = user;