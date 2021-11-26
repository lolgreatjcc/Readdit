//ADES CA1 Play2Win
console.log("---------------------------------");
console.log(" ADES > CA1 > Readdit > Week 1 > server.js");
console.log("---------------------------------");

//-----------------------------------
// imports
//-----------------------------------

const app = require('./controller/app');

//-----------------------------------
// main
//-----------------------------------
if (process.env.PORT != null){
    const port = process.env.PORT;
    app.listen(port,function(){
        console.log(`Server hosted on heroku!`);
    });
}
else{
    const hostname="localhost";
    const port=3000;
    app.listen(port,hostname,function(){
    console.log(`Server hosted at http://${hostname}:${port}`);
});
}
