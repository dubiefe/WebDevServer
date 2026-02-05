import fs from "node:fs";

// I
// Write the exact order of the console output --> AJEDBC    AJEDB | FIGH | C   !!! answer: AJEDBFICHG
// console.log("A"); // synchronous

// setTimeout(() => { // timer
//     console.log("B");
// }, 0);

// setImmediate(() => { // check phase
//     console.log("C");
// });

// Promise.resolve().then(() => { // microtask
//     console.log("D");
// });

// process.nextTick(() => {
//     console.log("E");
// });

// fs.readFile("data1.txt", "utf-8", () => { // I/O callback
//     console.log("F"); // synchronous
//     setTimeout(() => console.log("G"), 0); // timer
//     setImmediate(() => console.log("H")); // check phase
//     Promise.resolve().then(() => console.log("I")); // microtask
// });

// console.log("J"); // synchronous

// II
console.log("A"); // synchronous

fs.readFile("data1.txt", "utf-8", () => { // I/O callback

    console.log("F"); // synchronous
    setTimeout(() => console.log("G"), 0); // timer
    setImmediate(() => console.log("H")); // check phase
    Promise.resolve().then(() => console.log("I")); // microtask

    setTimeout(() => { // timer
        console.log("B");
    }, 0);

    setImmediate(() => { // check phase
        console.log("C");
    });

    Promise.resolve().then(() => { // microtask
        console.log("D");
    });

    process.nextTick(() => {
        console.log("E");
    });
});

console.log("J"); // synchronous