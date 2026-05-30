import { describe, expect, test } from "vitest";

import app from ".";

// Creates a suite of tests, allowing for grouping and hierarchical organization of tests
describe("weather-api worker", () => {
  test("should return json on GET /api/now", async () => {
    const res = await app.request("/api/now");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      areaId: "59485",
      date: "2026-06-01",
      timeZone: "Asia/Shanghai",
      temperature: 30.7,
      humidity: 72,
      source: "weather.cma.cn",
    });
  });

  test("should return json array on GET /api/history", async () => {
    const res = await app.request("/api/history");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([
      {
        areaId: "59485",
        date: "2026-06-01",
        timeZone: "Asia/Shanghai",
        temperature: 30.7,
        humidity: 72,
        source: "weather.cma.cn",
      },
    ]);
  });
});
