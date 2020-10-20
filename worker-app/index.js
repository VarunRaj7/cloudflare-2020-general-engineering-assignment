const Router = require('./router')

const links = [
    { name: 'Youtube', url: 'https://www.youtube.com/' },
    {
        name: 'Facebook',
        url: 'https://www.facebook.com/',
    },
    { name: 'Twitter', url: 'https://twitter.com/' },
]

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

function linksHandler(request) {
    const init = {
        headers: { 'content-type': 'application/json' },
    }
    const body = JSON.stringify(links)
    return new Response(body, init)
}

async function handleRequest(request) {
    const r = new Router()

    r.get('/links', () => linksHandler(request))

    const resp = await r.route(request)
    return resp
}
