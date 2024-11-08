addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

const allowedApiKeys = JSON.parse(env.USER_API || '')

const apiConfigs = JSON.parse(env.CONFIG_API || '')

async function handleRequest(request) {

    const url = new URL(request.url)
    const selectedConfig = apiConfigs[Math.floor(Math.random() * apiConfigs.length)]
    const newUrl = selectedConfig.endpoint + url.pathname + url.search

    const newHeaders = new Headers(request.headers)
    newHeaders.set('Authorization', `Bearer ${selectedConfig.apiKey}`)

    const newRequest = new Request(newUrl, {
        method: request.method,
        headers: newHeaders,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.clone().arrayBuffer() : null,
        redirect: 'follow'
    })

    const response = await fetch(newRequest)
    return response
}