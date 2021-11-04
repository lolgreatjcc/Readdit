//ADES CA1 Play2Win
const express=require('express');
const serveStatic=require('serve-static');


//var port = process.env.PORT;
var hostname="localhost";
var port=3001;

var app=express();

app.use(function(req,res,next){
    console.log(req.url);
    console.log(req.method);
    console.log(req.path);
    console.log(req.query.id);

    if(req.method!="GET"){
        res.type('.html');
        var msg="<html><body>This server only serves web pages with GET!</body></html>";
        res.end(msg);
    }else{
        next();
    }
});

app.get('/createSub', function (req,res) {
    res.status(200).sendFile('create.html', {root: __dirname + '/public/r/'});
})

app.get('/r/:subreaddit', function (req,res) {
    res.status(200).sendFile('subreaddit.html', { root: __dirname + "/public/r/" } );
})

app.use(serveStatic(__dirname + "/public"));


// app.listen(port,function(){
//     console.log(`Server hosted!`);
//     console.log("Localhost link:")
//     console.log("http://localhost:3001/template.html")
// });

app.listen(port,hostname,function(){
    console.log(`Server hosted at http://${hostname}:${port}`);
});
