# Weather API

This is a Cloudflare Worker that provides weather data.

## Usage

The API can be accessed via below URL:

- `https://weather.zeekcheung.workers.dev`
- `https://weather.zeekcheung.ip-ddns.com`

```sh
# Current weather
curl "https://weather.zeekcheung.workers.dev/api/now?latitude=23.1167&longitude=113.25&timezone=Asia%2FShanghai"

# Historical weather (date range)
curl "https://weather.zeekcheung.workers.dev/api/history?latitude=23.1167&longitude=113.25&timezone=Asia%2FShanghai&start_date=2026-06-01&end_date=2026-06-06"

# Historical weather (specific day)
curl "https://weather.zeekcheung.workers.dev/api?latitude=23.1167&longitude=113.25&timezone=Asia%2FShanghai&year=2026&month=6&day=15"

# Historical weather (full month)
curl "https://weather.zeekcheung.workers.dev/api?latitude=23.1167&longitude=113.25&timezone=Asia%2FShanghai&year=2026&month=6"

# Historical weather (full year)
curl "https://weather.zeekcheung.workers.dev/api?latitude=23.1167&longitude=113.25&timezone=Asia%2FShanghai&year=2026"

# Invalid requests (400 Bad Request)

# Either start_date/end_date or year must be provided
curl "https://weather.zeekcheung.workers.dev/api?latitude=23.1167&longitude=113.25&timezone=Asia%2FShanghai&day=15"
curl "https://weather.zeekcheung.workers.dev/api?latitude=23.1167&longitude=113.25&timezone=Asia%2FShanghai&month=6"

# day cannot be used without month
curl "https://weather.zeekcheung.workers.dev/api?latitude=23.1167&longitude=113.25&timezone=Asia%2FShanghai&year=2026&day=15"
```
