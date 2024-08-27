import http from "http"

const address = '127.0.0.1'
const port = 38080

const httpServer = http.createServer((req, res) => {
    if (req.url=='/') {
        res.write('hello world')
        res.end()
    }
})
httpServer.listen(port, address)

console.log(`Listening on ${address}`)