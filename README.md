## 說明

讓 puppeteer 可透過 proxy 擷取資料

## 使用方法

透過 JSON 指定 `url` 或 `proxy` (選用)，其中 `proxy` 必須包含通訊協定 (`http` 或 `https`)。

curl 範例：

```shell
curl -X POST -d '{"url":"https://zeroplex.tw/ip","proxy":"http://your.proxy:3128"}' http://puppeteer.host:38080
{"httpStatusCode":200,"html":"<html><head></head><body>10.1.1.1</body></html>"}
```

