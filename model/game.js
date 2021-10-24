/*
Class: DIT/FT/1B/03
Name: Tan Yong Rui
Admission Number: P2004147
*/

console.log("---------------------------------");
console.log("P2004147_CA2 > Back End > model > game.js");
console.log("---------------------------------");

var db = require('../controller/databaseConfig');

var Game = {
    addGame: function (title, description, price, platform, categoryid, year, imagePath, callback) {
        // get a connection to the database
        var conn = db.getConnection();
        var gameid;
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `
                    INSERT INTO
                        game(
                            title, 
                            description, 
                            price, 
                            platform, 
                            year,
                            imagePath)
                    VALUES
                        (
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            ?
                        );
                    `;

                conn.query(sql, [title, description, price, platform, year, imagePath], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        var sql = `
                            SELECT
                                game.gameid
                            FROM
                                game
                            WHERE
                                title = ?
                        
                         `;
                        conn.query(sql, [title], function (err, result) {
                            if (err) {
                                console.log(err);
                                return callback(err, null);
                            }
                            else {
                                gameid = result[0].gameid;
                                categoryid = categoryid.split(",")
                                for (var i = 0; i < categoryid.length; i++) {
                                    var sql = `
                                INSERT INTO 
                                    game_category_junction(
                                        gameid,
                                        catid
                                    )
                                VALUES(
                                    ?,
                                    ?
                                )                        
                                `;
                                    conn.query(sql, [gameid, categoryid[i]], function (err, result) {
                                        if (err) {
                                            console.log(err);
                                            return callback(err, null);
                                        }
                                    });
                                }
                                conn.end()
                                return callback(null, result);
                            }
                        });

                    }
                });
            }
        });
    },

    findByPlatform: function (platform, callback) {
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
                    g.gameid,g.title,g.description,FORMAT(g.price, 2) AS price,g.platform,gcj.catid,c.catname,g.year,g.created_at
                FROM 
                    game AS g, category AS c, game_category_junction AS gcj
                WHERE 
                    g.platform LIKE concat("%",?,"%") AND
                    g.gameid = gcj.gameid AND
                    c.catid = gcj.catid
                `;

                conn.query(sql, [platform], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        if (result.length == 0) {
                            return callback(null, null)
                        }
                        else {
                            return callback(null, result);
                        }
                    }
                });
            }
        });
    },

    findByMulti: function (title, platform, price, page, callback) {
        var offset = 6*(page-1);
        // get a connection to the database
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");
                if (price == ""){
                var sql = `
                SELECT distinct
		            g.gameid ,g.title,g.description,FORMAT(g.price, 2) AS price,g.platform,g.imagePath
                FROM 
		            game AS g
                WHERE 
		            g.title LIKE concat("%",?,"%") AND
		            g.platform LIKE concat("%",?,"%") AND
		            g.price <= g.price
                LIMIT 
                    ?,6
                `;
                
                

                conn.query(sql, [title, platform,offset], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        if (result.length == 0) {
                            return callback(null, null)
                        }
                        else {
                            return callback(null, result);
                        }
                    }
                });
            }
            else{
                var sql = `
                SELECT distinct
		            g.gameid ,g.title,g.description,FORMAT(g.price, 2) AS price,g.platform,g.imagePath
            FROM 
		            game AS g
            WHERE 
		            g.title LIKE concat("%",?,"%") AND
		            g.platform LIKE concat("%",?,"%") AND
		            g.price <= ? 
            LIMIT 
                ?,6
                 
                `;
                conn.query(sql, [title, platform,price,offset], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        if (result.length == 0) {
                            return callback(null, null)
                        }
                        else {
                            return callback(null, result);
                        }
                    }
                });
                }
            }
        });
    },

    findByMultiLength: function (title, platform, price, page, callback) {
        var offset = 6*(page-1);
        // get a connection to the database
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");
                if (price == ""){
                var sql = `
                SELECT distinct
		            g.gameid ,g.title,g.description,FORMAT(g.price, 2) AS price,g.platform,g.imagePath
                FROM 
		            game AS g
                WHERE 
		            g.title LIKE concat("%",?,"%") AND
		            g.platform LIKE concat("%",?,"%") AND
		            g.price <= g.price
                `;
                
                

                conn.query(sql, [title, platform,offset], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null,result)
                    }
                });
            }
            else{
                var sql = `
                SELECT distinct
		            g.gameid ,g.title,g.description,FORMAT(g.price, 2) AS price,g.platform,g.imagePath
            FROM 
		            game AS g
            WHERE 
		            g.title LIKE concat("%",?,"%") AND
		            g.platform LIKE concat("%",?,"%") AND
		            g.price <= ?  
                `;
                conn.query(sql, [title, platform,price,offset], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                            return callback(null, result);
                    }
                });
                }
            }
        });
    },

    findGame: function (title, callback) {
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
                    g.gameid,g.title,g.description,FORMAT(g.price, 2) AS price,g.platform,gcj.catid,c.catname,g.year,g.created_at
                FROM 
                    game AS g, category AS c, game_category_junction AS gcj
                WHERE 
                    g.gameid = gcj.gameid AND
                    c.catid = gcj.catid AND
                    g.title LIKE concat("%",?,"%") `;

                conn.query(sql, [title], function (err, result) {
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

    findGameByID: function (gameid, callback) {
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
                    g.gameid,g.title,g.description,FORMAT(g.price, 2) AS price,g.platform,gcj.catid,c.catname,g.year,g.created_at,g.imagePath
                FROM 
                    game AS g, category AS c, game_category_junction AS gcj
                WHERE 
                    g.gameid = ? AND
                    g.gameid = gcj.gameid AND
                    c.catid = gcj.catid`
                    
                conn.query(sql, [gameid], function (err, result) {
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

    findAll: function (callback) {
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
                    g.gameid,g.title,g.description,FORMAT(g.price, 2) AS price,g.platform,gcj.catid,c.catname,g.year,g.created_at
                FROM 
                    game AS g, category AS c, game_category_junction AS gcj
                WHERE 
                    g.gameid = gcj.gameid AND
                    c.catid = gcj.catid `;

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

    showAll: function (page, callback) {
        var offset = 6*(page-1);
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
                    g.gameid,g.title,FORMAT(g.price, 2) AS price,g.imagePath
                FROM 
                    game AS g
                LIMIT ?,6
               `;

                conn.query(sql, [offset], function (err, result) {
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

    getLength: function (callback) {
        
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
                    g.gameid,g.title,FORMAT(g.price, 2) AS price,g.imagePath
                FROM 
                    game AS g
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

    editGame: function (title, description, price, platform, year, gameid, callback) {

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
                    game
                SET 
                
                title = ?,
                description = ?,
                price = ?,
                platform = ?,
                year = ?
                WHERE
                    gameid = ?;
                    `;

                conn.query(sql, [title, description, price, platform, year, gameid], function (err, result) {
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

    deleteGame: function (id, callback) {
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
                DELETE FROM
	                game
                WHERE
	            gameid = ?;
                `;

                conn.query(sql, [id], function (err, result) {
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
module.exports = Game;