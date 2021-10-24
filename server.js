/*
Class: DIT/FT/1B/03
Name: Tan Yong Rui
Admission Number: P2004147
*/

console.log("---------------------------------");
console.log("testing > server.js");
console.log("---------------------------------");

const { json } = require('express');
var app=require('./controller/app.js');
var port=process.env.PORT;

app.listen(port, () => {
    console.log(`Server started and accessible at port ${port}!`);
});