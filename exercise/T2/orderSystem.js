// Event 'order-received' that receives { id, product, quantity }
// Event 'order-processed' when processing is complete
// Use events.once() to wait for confirmation with a 5-second timeout

import { EventEmitter, once } from 'node:events';

const emitter = new EventEmitter()

emitter.on('order-received', (id, product, quantity) => {
    console.log(`order ${id} received: ${product} (${quantity})`)
    setTimeout(() => emitter.emit('order-processed'), 5000);
})

emitter.once('order-processed', () => {
    console.log(`processing complete`)
})

emitter.emit('order-received', 1, 'laptop', 3)
emitter.emit('order-received', 1, 'laptop', 3)

// async function orderSystem() {
//     setTimeout(() => emitter.emit('order-received', 1, 'laptop', 3), 5000);
//     const [data] = await once(emitter, 'order-processed');
//     console.log('Connected from', data.ip);
// }
// orderSystem();