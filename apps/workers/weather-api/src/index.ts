import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// TODO: fetch weather data right now
app.get("/api/now", (c) => {
  return c.json({
    areaId: "59485",
    date: "2026-06-01",
    timeZone: "Asia/Shanghai",
    temperature: 30.7,
    humidity: 72,
    source: "weather.cma.cn",
  });
});

// TODO: fetch weather data in history
app.get("/api/history", (c) => {
  return c.json([
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

export default app;
