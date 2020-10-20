const Router = require('./router')

const userName = 'Varun'

const userImage =
    'https://general-vr.s3.us-east-2.amazonaws.com/formal_pic2.jpg'

const links = [
    { name: 'Youtube', url: 'https://www.youtube.com/' },
    {
        name: 'Facebook',
        url: 'https://www.facebook.com/',
    },
    { name: 'Twitter', url: 'https://twitter.com/' },
]

const socialLinks = [
    {
        name: 'GitHub',
        url: 'https://github.com/VarunRaj7',
        img: 'https://simpleicons.org/icons/github.svg',
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/varun-raj-rayabarapu/',
        img: 'https://simpleicons.org/icons/linkedin.svg',
    },
    {
        name: 'Twitter',
        url: 'https://twitter.com/VarunRajR4',
        img: 'https://simpleicons.org/icons/twitter.svg',
    },
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

class RemoveAttrTransformer {
    constructor(attr) {
        this.attr = attr
    }
    async element(element) {
        element.removeAttribute(this.attr)
    }
}

class SetContentTransformer {
    constructor(content) {
        this.content = content
    }
    async element(element) {
        element.setInnerContent(this.content)
    }
}

class SetAttrTransformer {
    constructor(attr, value) {
        this.attr = attr
        this.value = value
    }
    async element(element) {
        element.setAttribute(this.attr, this.value)
    }
}

class SocialLinksTransformer {
    constructor(socialLinks) {
        this.socialLinks = socialLinks
    }
    async element(element) {
        this.socialLinks.map(link =>
            element.append(
                `<a href=${link.url}><img style="filter: brightness(0) invert(1);" src=${link.img} alt=${link.name}></a>`,
                {
                    html: true,
                }
            )
        )
    }
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
        .on('div#profile', new RemoveAttrTransformer('style'))
        .on('h1#name', new SetContentTransformer(userName))
        .on('img#avatar', new SetAttrTransformer('src', userImage))
        .on('div#social', new RemoveAttrTransformer('style'))
        .on('div#social', new SocialLinksTransformer(socialLinks))
        .transform(body)
}

async function handleRequest(request) {
    const r = new Router()

    r.get('/links', () => linksHandler(request))
    r.get('/*', () => nonLinkshandler(request))

    const resp = await r.route(request)
    return resp
}
