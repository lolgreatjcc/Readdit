// Class: DIT/FT/1B/03
// Name: Tan Yong Rui
// Admission Number: P2004147

console.log("---------------------------------");
console.log("testingFront > server.js");
console.log("---------------------------------");


const express = require('express');
const serveStatic = require('serve-static');



var app = express();

app.use(function (req, res, next) {
    console.log(req.url);
    console.log(req.method);
    console.log(req.path);
    console.log(req.query.id);

    if (req.method != "GET") {
        res.type('.html');
        var msg = "<html><body>This server only serves web pages with GET!</body></html>";
        res.end(msg);
    } else {
        next();
    }
});


app.use(serveStatic(__dirname + "/public"));


app.listen(process.env.PORT, function () {

    console.log(`Front End server started successfully.`);
});