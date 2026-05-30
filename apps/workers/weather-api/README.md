# Weather API

This is a Cloudflare Worker that provides weather data.

## Usage

```sh
# Get all weather data from database
curl https://weather.zeekcheung.workers.dev/api
curl https://weather.zeekcheung.ip-ddns.com/api
curl https://weather.zeekcheung.asia/api

# Get weather data for a specific city and date
# Example: Get weather data for Zhongshan (59485) on May 9, 2025 in Asia/Shanghai time zone
curl https://weather.zeekcheung.workers.dev/api?areaId=59485&year=2025&month=5&day=9&timeZone=Asia%2FShanghai
curl https://weather.zeekcheung.ip-ddns.com/api?areaId=59485&year=2025&month=5&day=9&timeZone=Asia%2FShanghai
curl https://weather.zeekcheung.asia/api?areaId=59485&year=2025&month=5&day=9&timeZone=Asia%2FShanghai
```

> [!TIP]
> You can find the `areaId` for a city via [OpenWeatherMap](https://data.cma.cn/article/showPDFFile.html?file=/pic/static/doc/A/A.0012.0001/SURF_CHN_MUL_HOR_STATION.pdf).
