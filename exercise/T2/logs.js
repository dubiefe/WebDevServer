import { AsyncLocalStorage } from 'node:async_hooks';

const storage = new AsyncLocalStorage();

function log(message) {
    // Your code: obtain requestId from storage
    const store = storage.getStore()
    const requestId = store?.requestId
    console.log(`LOG: ${message} [ID: ${requestId}]`)
}

async function processRequest(requestId) {
    // Your code: use storage.run() to establish context
    storage.run({ requestId: requestId }, async () => {
        storage.getStore().requestId
        log("Request processed")
    })
}

await Promise.all([
    processRequest(123),
    processRequest(987),
    processRequest(564),
    processRequest(895),
    processRequest(342),
])