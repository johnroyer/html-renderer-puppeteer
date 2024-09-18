import http from "http"
import Renderer from "./renderer.js";

const address = '127.0.0.1'
const port = 38080

const debugLog = function (request, response) {
    let message = request.method + ' ' + request.url
    console.log(message)
}

const httpServer = http.createServer((request, response) => {
    debugLog(request, response)

    if (request.url == '/') {
        let body = ''
        let data

        request.on('data', (data) => {
            body += data.toString()
        })

        request.on('end', () => {
            data = JSON.parse(body)

            if (!data.hasOwnProperty('url')) {
                // not given url
                response.writeHead(400)
                response.end('missing URL')
            }

            let renderer = new Renderer(data)
            let result = renderer.run()

            result.then(function (back) {
                response.end(JSON.stringify(back))
            })

        })
    } else {
        response.writeHead(404)
        response.end()
    }
})

httpServer.listen(port, address)

console.log(`Listening on ${address}` + ' port ' + port.toString())