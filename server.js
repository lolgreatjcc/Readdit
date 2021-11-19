//ADES CA1 Play2Win
const express=require('express');
const serveStatic=require('serve-static');
var app=express();


const profile = require('./routes/profile');

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

app.get('/', function (req,res) {
    res.status(200).sendFile('home.html', {root: __dirname + '/public/'});
})
app.get('/createSub', function (req,res) {
    res.status(200).sendFile('create.html', {root: __dirname + '/public/r/'});
})

app.get('/moderator', function (req,res) {
    res.status(200).sendFile('moderator.html', {root: __dirname + '/public/r/'});
})

app.get('/moderator/flair', function (req,res) {
    res.status(200).sendFile('flair.html', {root: __dirname + '/public/r/'});
})

app.get('/r/:subreaddit', function (req,res) {
    res.status(200).sendFile('subreaddit.html', { root: __dirname + "/public/r/" } );
})

app.get('/r/:subreaddit/:post_id', function (req,res) {
    res.status(200).sendFile('post.html', { root: __dirname + "/public/r/" } );
})

app.use('/profile', profile)

app.use(serveStatic(__dirname + "/public"));

if (process.env.PORT != null){
    const port = process.env.PORT;
    app.listen(port,function(){
        console.log(`Server hosted on heroku!`);
    });
}
else{
    const hostname="localhost";
    const port=3001;
    app.listen(port,hostname,function(){
    console.log(`Server hosted at http://${hostname}:${port}`);
});
}
