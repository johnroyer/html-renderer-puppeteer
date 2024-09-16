import puppeteer from 'puppeteer-core'
import {
    proxyRequest,
} from 'puppeteer-proxy'

export default class Renderer {
    #url
    #proxy

    constructor(browserConfig) {
        if (!("url" in browserConfig)) {
            throw new Error("invalid URL")
        } else {
            this.#url = browserConfig.url
        }

        if (!("proxy" in browserConfig)) {
            this.#proxy = undefined
        } else {
            this.#proxy = browserConfig.proxy
        }
    }

    async run() {
        let pageHtml = ''
        let httpStatusCode = 200

        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium',
            headless: true,
        })

        const page = await browser.newPage()

        await page.setRequestInterception(true);

        page.on('request', async (request) => {
            await proxyRequest({
                page,
                proxyUrl: this.#proxy,
                request,
            });
        });


        await page.on('response', function (response) {
            httpStatusCode = response.status()
        })

        await page.goto(this.#url)

        await page.content()
            .then(function(content) {
                pageHtml = content
            })

        await browser.close()

        return {
            "httpStatusCode": httpStatusCode,
            "html": pageHtml
        }
    }
}