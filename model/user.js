/*
Class: DIT/FT/1B/03
Name: Tan Yong Rui
Admission Number: P2004147
*/

console.log("---------------------------------");
console.log("P2004147_CA2 > Back End > model > user.js");
console.log("---------------------------------");

var db = require('../controller/databaseConfig');
var config = require('../config.js');
var jwt = require('jsonwebtoken');
var User = {
    loginUser: function (email, password, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null, null);
            }
            else {
                console.log("Connected!");

                var sql = 'select userid,username,email,type from user where email=? and password=?';

                conn.query(sql, [email, password], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err,null, null);

                    } else {
                        // if no results at all
                        if (result.length == 0) {
                            return callback(null,null,null);
                        }
                        else {
                            userData = result;
                            // it must be that we have ONE result here
                            // since the email is unique
                            console.log("Secret Key: " + config.key);
                            console.log(result[0]);

                            // generating the token
                            var token = jwt.sign(
                                // (1) Payload
                                { 
                                    userid: result[0].userid, 
                                    type: result[0].type 
                                }, 
                                // (2) Secret Key
                                config.key, 
                                {
                                // (3) Lifetime of token
                                //expires in 24 hrs
                                expiresIn: 86400
                                }
                            );

                            return callback(null, token, userData);


                        }
                    }
                });

            }

        });
    },
    findAll: function (callback) {
        // get a connection to the database
        var conn = db.getConnection();
        $("#Login").click(function () {
            
        });
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `SELECT * FROM user`;

                conn.query(sql, [], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },
    findByID: function (id, callback) {
        // get a connection to the database
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `
                SELECT 
                    * 
                FROM 
                    user 
                WHERE 
                    userid = ?
                `;

                conn.query(sql, [id], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        if (result.length == 0){
                            return callback(null,null)
                        }
                        else{
                            return callback(null, result[0]);
                        }
                    }
                });
            }
        });
    },
    addUser: function (username, email, type, profile, callback) {
        console.log("Type: "+ type);
        console.log("profile: "+ profile);

        // get a connection to the database
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `
                    INSERT INTO
                        user(
                            username,
                            email,
                            type,
                            profile_pic_url)
                    VALUES
                        (
                            ?,
                            ?,
                            ?,
                            ?
                        );
                    `;

                conn.query(sql, [username,email,type,profile], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        var sql = `
                    SELECT
                        user.userid
                    FROM
                        user
                    WHERE
                        username LIKE concat("",?)
                        
                    `;
                    conn.query(sql, [username], function (err, result) {
                        conn.end();
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        }
                        else{
                            return callback(null, result);  
                        }
                    });
                
                }
                });
            }
        });
    },
    updateUser: function (userid, username, email, type, callback) {
        // get a connection to the database
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `
                UPDATE
                    user
                SET 
                    username = ? ,
                    email = ? ,
                    type = ?
                WHERE
                    userid = ?;
                    `;

                conn.query(sql, [username, email, type, userid], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    }
}

//-----------------------------------
// exports
//-----------------------------------
module.exports = User;