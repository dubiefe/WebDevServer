
async function fetchWithTimeout(url, ms) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ms);

    try {
        const response = await fetch(url, {signal: controller.signal})
        clearTimeout(timeout)
        return await response.json()
    } catch(error) {
        throw error
    }
}

// Test
try {
    const data = await fetchWithTimeout('https://api.tvmaze.com/shows/11', 5);
} catch (err) {
    console.log("Timeout or error");
}