import puppeteer from 'puppeteer'
import proxyRequest from 'puppeteer-proxy';

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
            process.env.HTTP_PROXY = this.#proxy
            process.env.HTTPS_PROXY = this.#proxy

            console.log(process.env.HTTPS_PROXY)
        }
        console.log(launchArgs)

        const browser = await puppeteer.launch({
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