import BrowserConfig from '../browserConfig.js'
import assert from 'assert'

describe('getProxyProtocol', function () {
    it ('should be HTTP', function () {
        assert.equal(
            BrowserConfig.getProxyProtocol('http://127.0.0.1'),
            'http:',
        )
    })

    it ('should be HTTPS', function () {
        assert.equal(
            BrowserConfig.getProxyProtocol('https://127.0.0.1'),
            'https:',
        )
    })
})