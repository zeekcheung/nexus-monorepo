import dayjs from "dayjs";
import { Hono } from "hono";
import { isToday as isTodayFn } from "shared/date";
import { ProblemError, ProblemSchema, validateQuery, type Problem } from "validators";

import { FetchWeatherCompositeSchema, FetchWeatherHistorySchema, FetchWeatherNowSchema } from "../types";
import { buildYearRange, completeDateRange, WeatherPaths } from "./utils";
import { OpenMeteo } from "./utils/meteo";

const app = new Hono<{ Bindings: CloudflareBindings }>();
const meteo = new OpenMeteo();

/**
 * Get current weather data.
 */
app.get(WeatherPaths.Now, async (c) => {
  const dto = validateQuery(c, FetchWeatherNowSchema);
  const weather = await meteo.fetchNow(dto);
  return c.json(weather);
});

/**
 * Get historical weather data.
 */
app.get(WeatherPaths.History, async (c) => {
  const dto = validateQuery(c, FetchWeatherHistorySchema);
  const weather = await meteo.fetchHistory(dto);
  return c.json(weather);
});

/**
 * Get current or historical weather data.
 */
app.get(WeatherPaths.Composite, async (c) => {
  const dto = validateQuery(c, FetchWeatherCompositeSchema);

  /**
   * Date range queries always map to historical weather.
   */
  if (dto.start_date || dto.end_date) {
    const { start_date, end_date } = completeDateRange(dto.start_date, dto.end_date);
    const weather = await meteo.fetchHistory({ ...dto, start_date, end_date });
    return c.json(weather);
  }

  /**
   * Year-based queries may resolve to either current or historical weather.
   */
  if (dto.year !== undefined) {
    /**
     * Explicitly reject ambiguous combinations.
     */
    if (dto.day !== undefined && dto.month === undefined) {
      throw new ProblemError({
        type: "https://example.com/errors/validation",
        status: 400,
        title: "Invalid date parameters",
        detail: "day cannot be used without month",
        instance: c.req.path,
      });
    }

    /**
     * If the requested date matches today, delegate to current weather.
     */
    const now = dayjs();
    const isThisMonth = dto.year === now.year() && dto.month === now.month() + 1;
    const isFirstDayOfThisMonth = isThisMonth && now.date() === 1;
    const isToday = isTodayFn(dto.year, dto.month, dto.day, dto.timezone) || isFirstDayOfThisMonth;
    if (isToday) {
      const weather = await meteo.fetchNow(dto);
      return c.json(weather);
    }

    /**
     * Otherwise, compute an explicit date range and fetch history.
     */
    const { start_date, end_date } = buildYearRange(dto.year, dto.month, dto.day);
    const weather = await meteo.fetchHistory({ ...dto, start_date, end_date });
    const isPastDay = dto.year && dto.month && dto.day;
    return c.json(isPastDay ? weather.at(0) : weather);
  }

  /**
   * No valid date strategy was provided.
   */
  throw new ProblemError({
    type: "https://example.com/errors/validation",
    status: 400,
    title: "Invalid date parameters",
    detail: "Either start_date/end_date or year must be provided",
    instance: c.req.path,
  });
});

/**
 * Global error handler.
 */
app.onError((err, c) => {
  if (err instanceof ProblemError) {
    return c.json(ProblemSchema.parse(err.problem), err.problem.status);
  }

  return c.json(
    ProblemSchema.parse({
      type: "about:blank",
      title: "Internal Server Error",
      status: 500,
      detail: err.message,
      instance: c.req.path,
    } satisfies Problem),
    500,
  );
});

export default app;
export * from "./utils/meteo";
export * from "../types";
export * from "../types/meteo";
