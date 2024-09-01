import puppeteer from 'puppeteer'

class Renderer {
    constructor(browserConfig) {
        this.url = browserConfig.url
        this.proxy = browserConfig.proxy
    }
}

const browser = await puppeteer.launch({
    headless: true,
    args: [
        '--proxy-server=http://lab.zeroplex.tw:3128',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list',
    ]
})

const page = await browser.newPage()

await page.goto('https://zeroplex.tw/ip')

await page.content()
    .then(function(content) {
        console.log("----------")
        console.log(content)
        console.log("----------")
    })
    .then(function (failure) {
        console.log(failure)
})

browser.close()