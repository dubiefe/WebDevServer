// Your code here: use Promise.allSettled to handle failures

import fs from 'node:fs/promises';

const files = ['config.json', 'datos.txt', 'noexiste.log', 'readme.md']

// const results = await Promise.allSettled(
//     files.map((file) => {
//         fs.readFile(file, 'utf-8')
//     })
// )

const results = await Promise.allSettled([
    fs.readFile(files[0], 'utf-8'),
    fs.readFile(files[1], 'utf-8'),
    fs.readFile(files[2], 'utf-8'),
    fs.readFile(files[3], 'utf-8')
])

let i = 0;
for(const result of results) {
    if(result.status === "rejected") {
        console.log(`${files[i]} doesn't exists`)
    } else {
        console.log(`${files[i]} exists`)
    }
    i++
}
