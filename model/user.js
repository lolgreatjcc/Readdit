//How Zu Kang Adam DIT/FT/1B/03 p2026677
console.log("---------------------------------");
console.log(" ADES > CA1 > Readdit > model > user.js");
console.log("---------------------------------");

//-----------------------------------
// imports
//-----------------------------------
var db = require('./databaseConfig.js');
var config=require('../config.js'); 
var jwt=require('jsonwebtoken');

//-----------------------------------
// objects / functions
//-----------------------------------
var user = {

    login: function (email, password, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null, null);
            }
            else {
                console.log("Connected!");

                var sql = `SELECT 
                                userid, username, role
                            FROM 
                                users
                            WHERE
                                email = ? AND password = ?`;

                conn.query(sql, [email, password], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null, null);

                    } else {
                        // no results at all
                        if (result.length == 0) {
                            return callback(null,null,null);
                        }
                        // it must be that we have ONE result here,
                        // since the email is Unique
                        else {
                            // it must be that we have ONE result here,
                            // since the email is unique
                            
                            //confirm if we have the key
                            console.log("Secret Key: " + config.key);
                            console.log(result[0]);
                            //generate the token

                            var token = jwt.sign(
                                // (1) Payload
                            {
                                userid : result[0].userid,
                                type : result[0].type
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
                    }

                });

            }

        });
    },

    getUser: function (userid, callback) {
        // get a connection to the database
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `SELECT 
                                username,email,role
                            FROM 
                                users
                            WHERE
                                userid = ?`;

                conn.query(sql, [userid], function (err, result) {
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

    getAll: function (callback) {
        // get a connection to the database
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = 'SELECT username,email,role FROM users';

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

    addUser: function (username, password, email, role, callback) {
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
                    INSERT IGNORE INTO
                        users(username, password, email, role)
                    VALUES
                        (?,?,?,?);
                    `;

                conn.query(sql, [username, password, email, role], function (err, result) {
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

    edit: function (userid, user, callback) {
        var username = user.username;
        var password = user.password;
        var email = user.email;
        var role = user.role;

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
                            users
                        SET
                            username = ?,
                            password = ?,
                            email = ?,
                            role = ?
                        WHERE
                            userid = ?;
                    `;

                conn.query(sql, [username, password, email, role, userid], function (err, result) {
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

    delete: function (userid, callback) {
        // get a connection to the database
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `DELETE FROM 
                                users
                            WHERE
                                userid = ?`;

                conn.query(sql, [userid], function (err, result) {
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
}

//-----------------------------------
// exports
//-----------------------------------
module.exports = user;