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

        process.on('unhandledRejection', function(reason, promise) {
            // possible domain not found
            // console.log('Unhandled promise rejection:', promise, 'reason:', reason.stack || reason);
            // don't konw why, but it works .....
        })

        try {
            let result = await page.goto(this.#url)
        } catch (error) {
            let msg = error.toString()
            let errMsg = msg.slice(0, msg.indexOf("\n"))

            return {
                "status": errMsg,
                "httpStatusCode": "400",
                "html": ""
            }
        }


        await page.content()
            .then(function(content) {
                pageHtml = content
            })

        await browser.close()

        return {
            "status": "ok",
            "httpStatusCode": httpStatusCode,
            "html": pageHtml
        }
    }
}