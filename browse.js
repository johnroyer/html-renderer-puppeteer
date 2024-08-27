import puppeteer from 'puppeteer'

const browser = await puppeteer.launch()

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