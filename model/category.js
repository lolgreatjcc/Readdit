/*
Class: DIT/FT/1B/03
Name: Tan Yong Rui
Admission Number: P2004147
*/

console.log("---------------------------------");
console.log("P2004147_CA2 > Back End > model > category.js");
console.log("---------------------------------");

var db = require('../controller/databaseConfig');

var Category = {
    addCategory: function (catname, description, callback) {

        // get a connection to the database
        var conn = db.getConnection();


        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `SELECT * FROM category`;

                conn.query(sql, [], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].catname.toLowerCase() == catname.toLowerCase()) {
                                return callback(true, null);
                            }
                        }

                        var sql = `
                        INSERT INTO
                            category(
                                catname,
                                description)
                        VALUES
                            (
                                ?,
                                ?
                            );
                        `;
 
                        conn.query(sql, [catname, description], function (err, result) {
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
        });
    },

    updateCategory: function (catname, description, catid, callback) {

        // get a connection to the database
        var conn = db.getConnection();


        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `SELECT * FROM category`;

                conn.query(sql, [], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].catname.toLowerCase() == catname.toLowerCase() && (catid-1) != i) {
                                return callback(true, null);
                            }
                        }

                        var sql = `
                        UPDATE category
                        SET
                            catname = ?,
                            description = ?
                        WHERE
                            catid = ?
                        `;
 
                        conn.query(sql, [catname, description,catid], function (err, result) {
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

                var sql = `
                SELECT 
                   catid,catname
                FROM 
                    category
                `;

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





}

//-----------------------------------
// exports
//-----------------------------------
module.exports = Category;