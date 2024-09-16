import http from "http"
import Renderer from "./renderer.js";

const address = '127.0.0.1'
const port = 38080

const httpServer = http.createServer((request, response) => {
    if (request.url == '/') {
        let body = ''
        let data

        request.on('data', (data) => {
            body += data.toString()
        })

        request.on('end', () => {
            data = JSON.parse(body)

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