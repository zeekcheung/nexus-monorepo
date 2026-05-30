import { exports } from "cloudflare:workers";
import dayjs from "dayjs";
import { ISO_DATE_TEMPLATE } from "shared/date";
import type { Problem } from "validators";
import { describe, it, expect } from "vitest";

import { WeatherPaths } from "../src/utils";
import type { WeatherData } from "../types";

const BASE_URL = `http://example.com`;
const NOW_PATH = WeatherPaths.Now;
const HISTORY_PATH = WeatherPaths.History;
const COMPOSITE_PATH = WeatherPaths.Composite;

const LATITUDE = 23.1167;
const LONGITUDE = 113.25;
const TIMEZONE = "Asia/Shanghai";
const today = dayjs();
const START_DATE = today.subtract(1, "month").format(ISO_DATE_TEMPLATE);
const END_DATE = today.format(ISO_DATE_TEMPLATE);
const FUTURE_DATE = today.add(10, "year").format(ISO_DATE_TEMPLATE);

const fetch = exports.default.fetch.bind(exports.default);

const weatherDataProperties = ["latitude", "longitude", "date", "timezone", "temperature", "humidity"] as const;

async function request(path: string, params: Record<string, string | number>, expectedStatus: number | number[] = 200) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => query.set(k, String(v)));
  const url = `${BASE_URL}${path}?${query}`;
  const res = await fetch(url);

  if (Array.isArray(expectedStatus)) {
    expect(expectedStatus).toContain(res.status);
  } else {
    expect(res.status).toBe(expectedStatus);
  }

  return res;
}

function assertWeatherData(data: unknown): asserts data is WeatherData {
  if (typeof data !== "object" || data === null) {
    throw new Error("Expected WeatherData object");
  }
  for (const prop of weatherDataProperties) {
    expect(data).toHaveProperty(prop);
  }
}

function assertWeatherDataArray(data: unknown): asserts data is WeatherData[] {
  expect(Array.isArray(data)).toBe(true);
  (data as WeatherData[]).forEach(assertWeatherData);
}

describe("Weather API", () => {
  describe(`Get current weather data with ${NOW_PATH}`, () => {
    it(`GET ${NOW_PATH} with valid params returns current weather`, async () => {
      const res = await request(NOW_PATH, {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        timezone: TIMEZONE,
      });
      const data = await res.json();
      assertWeatherData(data);
    });

    it(`GET ${NOW_PATH} with invalid coordinates throws error`, async () => {
      await request(
        NOW_PATH,
        {
          latitude: 999,
          longitude: 999,
          timezone: TIMEZONE,
        },
        [400, 401, 404, 500],
      );
    });

    it(`GET ${NOW_PATH} with invalid timezone throws 400 error`, async () => {
      await request(
        NOW_PATH,
        {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          timezone: "Invalid/Timezone",
        },
        400,
      );
    });
  });

  describe(`Get historical weather data with ${HISTORY_PATH}`, () => {
    it(`GET ${HISTORY_PATH} with valid date range returns historical data`, async () => {
      const res = await request(HISTORY_PATH, {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        start_date: START_DATE,
        end_date: END_DATE,
        timezone: TIMEZONE,
      });
      const data = await res.json();
      assertWeatherDataArray(data);
    });

    it(`GET ${HISTORY_PATH} with only start_date throws 400 error`, async () => {
      await request(
        HISTORY_PATH,
        {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          start_date: START_DATE,
          timezone: TIMEZONE,
        },
        400,
      );
    });

    it(`GET ${HISTORY_PATH} with only end_date throws 400 error`, async () => {
      await request(
        HISTORY_PATH,
        {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          end_date: END_DATE,
          timezone: TIMEZONE,
        },
        400,
      );
    });

    it(`GET ${HISTORY_PATH} with future end_date throws error`, async () => {
      await request(
        HISTORY_PATH,
        {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          start_date: START_DATE,
          end_date: FUTURE_DATE,
          timezone: TIMEZONE,
        },
        [400, 401, 404, 500],
      );
    });
  });

  describe(`Get current or historical weather data with ${COMPOSITE_PATH}`, () => {
    it(`GET ${COMPOSITE_PATH} with start_date + end_date delegates to history`, async () => {
      const res = await request(COMPOSITE_PATH, {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        start_date: START_DATE,
        end_date: END_DATE,
        timezone: TIMEZONE,
      });
      const data = await res.json();
      assertWeatherDataArray(data);
    });

    it(`GET ${COMPOSITE_PATH} with today's date delegates to current weather`, async () => {
      const res = await request(COMPOSITE_PATH, {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        year: today.year(),
        month: today.month() + 1,
        day: today.date(),
        timezone: TIMEZONE,
      });
      const data = await res.json();
      assertWeatherData(data);
    });

    it(`GET ${COMPOSITE_PATH} with past year + month + day delegates to history (single day)`, async () => {
      const res = await request(COMPOSITE_PATH, {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        year: today.year(),
        month: 6,
        day: 15,
        timezone: TIMEZONE,
      });
      const data = await res.json();
      assertWeatherData(data);
    });

    it(`GET ${COMPOSITE_PATH} with year + month (no day) delegates to history (full month)`, async () => {
      const res = await request(COMPOSITE_PATH, {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        year: today.year(),
        month: 6,
        timezone: TIMEZONE,
      });
      const data = await res.json();
      assertWeatherDataArray(data);
    });

    it(`GET ${COMPOSITE_PATH} with year only delegates to history (full year)`, async () => {
      const res = await request(COMPOSITE_PATH, {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        year: today.year(),
        timezone: TIMEZONE,
      });
      const data = await res.json();
      assertWeatherDataArray(data);
    });

    it(`GET ${COMPOSITE_PATH} with day but no month throws 400 error`, async () => {
      const res = await request(
        COMPOSITE_PATH,
        {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          year: today.year(),
          day: 15,
          timezone: TIMEZONE,
        },
        400,
      );
      const data = await res.json<Problem>();
      expect(data.detail).toMatchInlineSnapshot(`"day cannot be used without month"`);
    });

    it(`GET ${COMPOSITE_PATH} with no date parameters throws 400 error`, async () => {
      const res = await request(
        COMPOSITE_PATH,
        {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          timezone: TIMEZONE,
        },
        400,
      );
      const data = await res.json<Problem>();
      expect(data.detail).toMatchInlineSnapshot(`"Either start_date/end_date or year must be provided"`);
    });

    it(`GET ${COMPOSITE_PATH} with year+day but no month throws 400 error`, async () => {
      const res = await request(
        COMPOSITE_PATH,
        {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          year: today.year(),
          day: 15,
          timezone: TIMEZONE,
        },
        400,
      );
      const data = await res.json<Problem>();
      expect(data.detail).toMatchInlineSnapshot(`"day cannot be used without month"`);
    });

    it(`GET ${COMPOSITE_PATH} with month but no year throws 400 error`, async () => {
      const res = await request(
        COMPOSITE_PATH,
        {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          month: 6,
          timezone: TIMEZONE,
        },
        400,
      );
      const data = await res.json<Problem>();
      expect(data.detail).toMatchInlineSnapshot(`"Either start_date/end_date or year must be provided"`);
    });
  });
});
