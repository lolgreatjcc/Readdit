//ADES CA1 Play2Win
console.log("---------------------------------");
console.log(" ADES > CA1 > Readdit > model > databaseConfig.js");
console.log("---------------------------------");


//-----------------------------------
// imports
//-----------------------------------

var mysql = require('mysql');

//-----------------------------------
// object /functions
//-----------------------------------

var dbconnect = {
    getConnection: function () {
        //local db
        // var conn = mysql.createConnection({
        //     host: "localhost",
        //     user: "root",
        //     password: "password",
        //     database: "readdit"
        // });   
        
        //heroku clear db
        var conn = mysql.createConnection({
            host: "us-cdbr-east-04.cleardb.com",
            user: " b7a6c1ee0950ab",
            password: "3ee893d6",
            database: "heroku_1c89f72eef4896a"
        });     


        return conn;
    }
};
module.exports = dbconnect

//-----------------------------------
// exports
//-----------------------------------