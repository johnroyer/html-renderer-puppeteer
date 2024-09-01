import puppeteer from 'puppeteer'

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
        let launchArgs = []
        let pageHtml = ''
        let httpStatusCode = 200

        if (undefined !== this.#proxy) {
            launchArgs = [
                '--proxy-server=' + this.#proxy,
                '--ignore-certificate-errors',
                '--ignore-certificate-errors-spki-list',
            ]
        }

        const browser = await puppeteer.launch({
            headless: true,
            args: launchArgs
        })

        const page = await browser.newPage()

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