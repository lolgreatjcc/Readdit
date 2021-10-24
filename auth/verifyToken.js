/*
Class: DIT/FT/1B/03
Name: Tan Yong Rui
Admission Number: P2004147
*/

console.log("---------------------------------");
console.log("P2004147_CA2 > Back End > auth > verifyToken.js");
console.log("---------------------------------");



//------------------------------------
// Imports
//------------------------------------
var jwt = require('jsonwebtoken');
var config = require('../config');

//------------------------------------
// objects / functions
//------------------------------------
function verifyToken(req, res, next) {
    console.log(req.headers);

    //retrieve authorization header’s content
    // Authorization: Bearer <token>
    var token = req.headers['authorization'];

    // Bearer <token>
    console.log(token);

    //process the token
    if (!token || !token.includes('Bearer')) {

        return res.status(403).send({ 
            auth: false,
            message: 'Not authorized!' 
        });
    } else {
        //obtain the token’s value
        token = token.split('Bearer ')[1];
        console.log(token);
        //verify token
        jwt.verify(token, config.key, function (err, decoded) {
            if (err) {
                return res.status(403).send(
                    // put this in a variable before you stringify
                    { 
                    auth: false, 
                    message: 'Not authorized!!!!!!!!!!!!!!!!!!!!' 
                }
                );

                // code to stringify:
                // 
                // only typing for now
                //
                // when auth's false is not a string, it creates an error:
                // The "chunk" argument must be one of type string or Buffer.
                // Received type object
                // Thus, we need to stingify it, before sending it out.
            } else {
                //decode the userid and store in req for use
                req.userid = decoded.userid;
                //decode the role and store in req for use
                req.type = decoded.type;
                next();
            }

        });
    }

}

//------------------------------------
// Exports
//------------------------------------
module.exports = verifyToken;
