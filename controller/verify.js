console.log("---------------------------------");
console.log(" ADES > CA1 > Readdit > controller > app.js");
console.log("---------------------------------");
const jwt = require("jsonwebtoken");
const config = require('../config').key
module.exports.verify = (req, res, next) => {

    //If the token is valid, the logic extracts the user id and the role information.
    //If the role is not user, then response 403 UnAuthorized
    //The user id information is inserted into the request.body.user_id or req.params.user_id
    var userId = req.body.user_id || req.params.user_id;
    console.log("userId: " + userId);

    if (typeof req.headers.authorization !== "undefined") {
      // Retrieve the authorization header and parse out the
      // JWT using the split function

      let token = req.headers.authorization.split(" ")[1];
      //console.log('Check for received token from frontend : \n');
      //console.log(token);

      jwt.verify(token, config, (err, data) => {
        console.log("data extracted from token \n", data);
        if (err) {
          console.log(err);
          return res.status(403).send({ message: "Unauthorized access", errCode: 1 });
        } else {
          if (data.userid != userId){
              return res.status(403).send({ message: "Unauthorized access", errCode: 2 });
          }
          else{
              next();
          }
        }
      });
    } else {
      res.status(403).send({ message: "Unauthorized access" });
    }
  }; //End of checkForValidUserId