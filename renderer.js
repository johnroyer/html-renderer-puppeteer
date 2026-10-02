import puppeteer from 'puppeteer-core'
import puppeteerProxy from 'puppeteer-proxy'

const { proxyRequest } = puppeteerProxy

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

        console.log('lauching browser ...')
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium',
            headless: true,
            args: [
                '--no-sandbox',

                // do disk cache
                '--disk-cache-dir=/dev/null',
                '--disk-cache-size=1',
                '--media-cache-size=1',

                // stop background service
                '--no-first-run',
                '--no-default-browser-check',
                '--disable-sync',
                '--disable-extensions',
                '--disable-background-networking',
                '--disable-component-update',
            ],
        })

        const context = await browser.createBrowserContext()

        console.log('new page ...')
        const page = await context.newPage()
        await page.setCacheEnabled(false)

        console.log('interception ...')
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


        console.log('setting call back .....')
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

        console.log('go to ' + this.#url + ' ...')
        try {
            let result = await page.goto(this.#url)
            pageHtml = await page.content()
        } catch (error) {
            let msg = error.toString()
            let errMsg = msg.slice(0, msg.indexOf("\n"))

            return {
                "status": errMsg,
                "httpStatusCode": "400",
                "html": ""
            }
        } finally {
            // 一定要關閉，puppeteer 才會刪除暫存的 profile 目錄
            console.log('close and clean ...')
            await browser.close()
        }

        return {
            "status": "ok",
            "httpStatusCode": httpStatusCode,
            "html": pageHtml
        }
    }
}
