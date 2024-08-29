import BrowserConfig from '../browserConfig.js'
import assert from 'assert'

describe('getProxyProtocol', function () {
    it('should be HTTP', function () {
        assert.equal(
            BrowserConfig.getProxyProtocol('http://127.0.0.1'),
            'http:',
        )
    })

    it('should be HTTPS', function () {
        assert.equal(
            BrowserConfig.getProxyProtocol('https://127.0.0.1'),
            'https:',
        )
    })

    it('should be SOCKET', function () {
        assert.equal(
            BrowserConfig.getProxyProtocol('socket5://127.0.0.1'),
            'socket5:'
        )
    })

    it('should throws error', function () {
        assert.equal(
            BrowserConfig.getProxyProtocol('invalid://127.0.0.1'),
            'invalid:'
        )
    })
})

describe('create BrowserConfig', function () {
    it('should initialize with out error', function () {
        let url = 'https://test.com'
        let proxy = 'http://127.0.0.1:3128'
        let config = new BrowserConfig({
            'url': url,
            'proxy': proxy
        })

        assert.equal(
            config.url,
            url
        )
    })
})