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





//-----------------------------------
// main
//-----------------------------------
// const port = process.env.PORT;
// app.listen(port, () => {
//     console.log(`Server started and accessible via ${port}`);
// });


const hostname = "localhost";
const port = 3000;
app.listen(port, hostname, () => {
    console.log(`Server started and accessible via http://${hostname}:${port}/`);
});
