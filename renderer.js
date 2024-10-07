import puppeteer from 'puppeteer-core'
import {
    proxyRequest,
} from 'puppeteer-proxy'
import {html} from "mocha/lib/reporters/index.js";

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

        process.on('unhandledRejection', function(reason, promise) {
            // console.error('Unhandled Rejection at:', promise, 'reason:', reason);
            console.warn('Unhandled promise rejection:', promise, 'reason:', reason.stack || reason);
        })
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
            if (request.failure()) {
                // 檢查錯誤訊息
                const errorMessage = request.failure().errorText;

                if (errorMessage.includes('net::ERR_FAILED')) {
                    // 域名不存在錯誤
                    console.log('domain not exists: ', request.url());
                }
                request.abort()
            }

            await proxyRequest({
                page,
                proxyUrl: this.#proxy,
                request,
            });
        });


        await page.on('response', function (response) {
            httpStatusCode = response.status()
        })

        await page.on('requestfailed', function (request) {
            // failed to send a reqest
            console.log(request.failure());
            throw 'Request failed: ' + request.failure().toString()
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