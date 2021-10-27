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
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "password",
            database: "readdit"
        });     


        return conn;
    }
};
module.exports = dbconnect

//-----------------------------------
// exports
//-----------------------------------