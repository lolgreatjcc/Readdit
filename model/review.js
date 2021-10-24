/*
Class: DIT/FT/1B/03
Name: Tan Yong Rui
Admission Number: P2004147
*/

console.log("---------------------------------");
console.log("P2004147_CA2 > Back End > model > review.js");
console.log("---------------------------------");

var db = require('../controller/databaseConfig');

var Review = {
    addReview: function (gameid, content, rating, userid, callback) {
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
                        review(
                            gameid, 
                            content, 
                            rating, 
                            userid)
                    VALUES
                        (
                            ?,
                            ?,
                            ?,
                            ?
                        );
                    `;

                conn.query(sql, [gameid, content, rating, userid], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        var sql = `
                    SELECT
                        review.reviewid
                    FROM
                        review
                    WHERE
                        gameid = ? AND
                        content = ? AND
                        rating = ? AND
                        userid = ?
                    `;
                    conn.query(sql, [gameid, content, rating, userid], function (err, result) {
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
                    g.gameid,r.content,r.rating,u.username,r.created_at
                FROM 
                    game AS g, review AS r, user as u
                WHERE 
                    g.gameid = ? AND
                    g.gameid = r.gameid AND
                    u.userid = r.userid
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
                            return callback(null, result);
                        }
                    }
                });
            }
        });
    },






}

//-----------------------------------
// exports
//-----------------------------------
module.exports = Review;