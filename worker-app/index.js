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

class LinksTransformer {
    constructor(links) {
        this.links = links
    }

    async element(element) {
        this.links.map(link => {
            element.append(`<a href=${link.url}>${link.name}</a>`, {
                html: true,
            })
        })
    }
}

function linksHandler(request) {
    const init = {
        headers: { 'content-type': 'application/json' },
    }
    const body = JSON.stringify(links)
    return new Response(body, init)
}

async function nonLinkshandler(request) {
    const init = {
        headers: { 'content-type': 'text/html' },
    }
    const body = await fetch(
        'https://static-links-page.signalnerve.workers.dev'
    )
    return new HTMLRewriter()
        .on('div#links', new LinksTransformer(links))
        .transform(body)
}

async function handleRequest(request) {
    const r = new Router()

    r.get('/links', () => linksHandler(request))
    r.get('/*', () => nonLinkshandler(request))

    const resp = await r.route(request)
    return resp
}
