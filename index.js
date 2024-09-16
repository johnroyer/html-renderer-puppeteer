import http from "http"
import Renderer from "./renderer.js";

const address = '127.0.0.1'
const port = 38080

const httpServer = http.createServer((req, res) => {
    if (req.url=='/') {
        let body = ''
        let data

        req.on('data', (data) => {
            body += data.toString()
        })

        req.on('end', () => {
            data = JSON.parse(body)

            let renderer = new Renderer(data)
            let result = renderer.run()

            result.then(function (back) {
                res.end(JSON.stringify(back))
            })

        })
    } else {
        res.writeHead(404)
        res.end()
    }
})
httpServer.listen(port, address)

console.log(`Listening on ${address}` + ' port ' + port.toString())