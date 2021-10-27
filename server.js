//ADES CA1 Play2Win
console.log("---------------------------------");
console.log(" ADES > CA1 > Readdit > Week 1 > server.js");
console.log("---------------------------------");

//-----------------------------------
// imports
//-----------------------------------

const app = require('./controller/app');


//-----------------------------------
// configurations
//-----------------------------------
const port = process.env.PORT;

//-----------------------------------
// main
//-----------------------------------
app.listen(port, () => {
    console.log(`Server started and accessible via ${port}`);
});