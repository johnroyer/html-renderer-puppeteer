import url from "url"

export default class BrowserConfig {
    #url = ''
    #proxy = false;

    constructor(options) {
        if (!("url" in options)) {
            throw new Error("invalid URL")
        } else {
            this.#url = options.url
        }

        if (!("proxy" in options)) {
            let proxy = new String(options.proxy)

            switch (this.getProxyProtocol(proxy)) {
                case "http:":
                case "https:":
                case "socket4:":
                case "socket5:":
                    this.#proxy = proxy
                default:
                    throw new Error("invalid proxy")
            }
        } else {
            this.#proxy = false
        }
    }

    static getProxyProtocol(proxy) {
        let url = new URL(proxy)
        return url.protocol
    }
}