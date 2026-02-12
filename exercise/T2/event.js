// Create a system that emits numbers every 500ms and use events.on() to process them as an async iterator, stopping after 10 numbers

import { EventEmitter, on } from 'node:events';

const emitter = new EventEmitter()

emitter.on('number', (num) => {
    if(i < 10) {
        console.log(`${num}`)
    } else {
        clearInterval(interval)
    }
})

let i = 0
const interval = setInterval(() => {
    emitter.emit('number', i)
    i++
}, 500)

