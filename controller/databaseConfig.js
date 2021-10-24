/*
Class: DIT/FT/1B/03
Name: Tan Yong Rui
Admission Number: P2004147
*/

console.log("---------------------------------");
console.log("Testing > controller > databaseConfig.js");
console.log("---------------------------------");

var mysql=require('mysql');

var dbConnect={

    getConnection:function(){
        var conn=mysql.createConnection({
            host:"readditdb.czt6vcipskbf.us-east-1.rds.amazonaws.com",
            user:"readditMaster",
            password:"MySQL123",
            database:"spgames2"

        }

        );

        return conn;

    }
}
module.exports=dbConnect;