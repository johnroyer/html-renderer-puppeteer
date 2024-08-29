import http from "http"
import queryString from "querystring";

const address = '127.0.0.1'
const port = 38080

const httpServer = http.createServer((req, res) => {
    if (req.url=='/') {
        let body = ''
        let postData

        req.on('data', (data) => {
            body += data
        })

        req.on('end', () => {
            postData = queryString.parse(body)

            console.log(postData)
        })

        res.write('hello world')
        res.end()
    }
})
httpServer.listen(port, address)

console.log(`Listening on ${address}`)