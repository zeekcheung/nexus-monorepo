import { Hono } from "hono";
import { ProblemError, ProblemSchema, validateQuery } from "validators";
import { OpenMeteo, type OpenMeteoParams, type WeatherData } from "weather-api";

import { MonitorPage } from "./pages/monitor";
import { FetchMonitorPageDtoSchema, type MonitorPageProps } from "./types";
import { presetDataList } from "./utils";

const app = new Hono<{ Bindings: CloudflareBindings }>();
const meteo = new OpenMeteo();
const meteoParams: OpenMeteoParams = { latitude: 22.65, longitude: 113.57 };

/**
 * API endpoint for client-side polling.
 * Returns current weather data.
 */
app.get("/api/weather", async (c) => {
  const data = await meteo.fetchNow(meteoParams);
  return c.json({ temperature: data.temperature, humidity: data.humidity });
});

/**
 * Main route for rendering the monitor page.
 * Performs SSR with initial data.
 */
app.get("/monitor", async (c) => {
  const dto = validateQuery(c, FetchMonitorPageDtoSchema);
  const res = await app.request("/api/weather");
  const weatherData = await res.json<WeatherData>();

  const randomIndex = Math.floor(Math.random() * presetDataList.length);
  const presetIndex = Number(dto.preset ?? randomIndex);
  const presetData = presetDataList[presetIndex];

  const props: MonitorPageProps = {
    lang: "zh-CN",
    title: "养护数据维护",
    ...presetData,
    temperatureValue: presetData?.temperatureValue ?? Math.floor(weatherData.temperature),
    humidityValue: presetData?.humidityValue ?? Math.floor(weatherData.humidity),
    ...dto,
  };

  return c.html(<MonitorPage {...props} />);
});

/**
 * Global error handler.
 */
app.onError((err, c) => {
  if (err instanceof ProblemError) {
    return c.json(ProblemSchema.parse(err.problem), err.problem.status);
  }
  return c.json(
    {
      type: "about:blank",
      title: "Internal Server Error",
      status: 500,
      detail: err.message,
      instance: c.req.path,
    },
    500,
  );
});

export default app;
