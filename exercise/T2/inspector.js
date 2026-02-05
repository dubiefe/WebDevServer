import fs from "node:fs";

// Print "START" synchronously.
// Read data1.txt and data2.txt in parallel using Promise.all .
// Inside each file-read callback:
// schedule a process.nextTick
// schedule a resolved Promise
// schedule a setImmediate
// Print "END" synchronously at the end of the file

console.log("START");

// Promise.all([
//     fs.readFile('data1.txt','utf-8', () => { // I/O callback
//         process.nextTick(() => console.log("data1 nextTick"));
//         Promise.resolve().then(() => console.log("data1 resolved Promise"));
//         setImmediate(() => console.log("data1 setImediate"));
//         console.log("data1 callback ends");
//     }),
//     fs.readFile('data2.txt','utf-8', () => { // I/O callback
//         process.nextTick(() => console.log("data2 nextTick"));
//         Promise.resolve().then(() => console.log("data2 resolved Promise"));
//         setImmediate(() => console.log("data2 setImediate"));
//         console.log("data2 callback ends");
//     })
// ]);

Promise.all([
    fs.readFile('data1.txt','utf-8',() => {}),
    fs.readFile('data2.txt','utf-8',() => {})
]).then(() => {
    process.nextTick(() => console.log("nextTick"));
    Promise.resolve().then(() => console.log("resolved Promise"));
    setImmediate(() => console.log("setImediate"));
});

console.log("END");

// Predicted output
// START -> END -> data1 nextTick -> data2 nextTick -> data1 resolved Promise -> data2 resolved Promise -> data1 setImediate -> data2 setImediate

// Real output
// START -> END -> data1 nextTick -> data1 resolved Promise -> data2 nextTick -> data2 resolved Promise -> data1 setImediate -> data2 setImediate
// --> The phase starts again in the I/O callbacks --> in the pool it needs to finish the promise all --> then when go to the check phase