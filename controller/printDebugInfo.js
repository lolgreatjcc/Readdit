function printDebugInfo(req, res, next) {
    try{
    console.log();
    console.log("----------------[ Debug Info ]-----------------");
    //console.log(`Servicing ${urlPattern}..`);
    console.log("Servicing " + req.url + " ..");

    console.log("> req params:" + JSON.stringify(req.params));
    console.log("> req.body:" + JSON.stringify(req.body));
    console.log("> req.headers:" + JSON.stringify(req.headers));
    console.log(" req body (without JSON Parse): " + req.body)
    // console.log("> req.myOwnDebugInfo:" + JSON.stringify(req.myOwnDebugInfo));

    console.log("----------------[ Debug Info ]-----------------");
    console.log();


    next();
    }
    catch(error){
        console.log("Error in printDebugInfo. Error: " + error);
        next();
    }
};
module.exports = printDebugInfo;