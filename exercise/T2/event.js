// Create a system that emits numbers every 500ms and use events.on() to process them as an async iterator, stopping after 10 numbers

import { EventEmitter, on } from 'node:events';

const emitter = new EventEmitter()
emitter.on('number', (num, max) => {
    if(i < max) { // print until maximum
        console.log(`${num}`)
    } else { // stop the interval when max is reached
        clearInterval(interval)
    }
})

let i = 0
const max = 10

const interval = setInterval(() => {
    emitter.emit('number', i, max)
    i++
}, 500)

