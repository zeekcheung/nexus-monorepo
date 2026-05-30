import { ISODateSchema } from "validators";
import { z } from "zod";

import { FetchWeatherMetaSchema } from ".";

/**
 * Raw query parameters for Open-Meteo API.
 */
export const OpenMeteoParamsSchema = FetchWeatherMetaSchema.extend({
  /**
   * A list of weather variables to get current conditions.
   * @see {@link https://open-meteo.com/en/docs#current_weather Current Weather}
   * @example ["temperature_2m", "relative_humidity_2m"]
   */
  current: z.array(z.string()).optional(),

  /**
   * A list of daily weather variable aggregations which should be returned.
   *
   * Values can be comma separated, or multiple &daily= parameter in the URL can be used.
   *
   * If daily weather variables are specified, parameter timezone is required.
   * @see {@link https://open-meteo.com/en/docs#daily_weather_variables Daily Weather Variables}
   * @example ["temperature_2m_mean", "relative_humidity_2m_mean"]
   */
  daily: z.array(z.string()).optional(),

  start_date: ISODateSchema.optional(),
  end_date: ISODateSchema.optional(),

  /**
   * Per default, only 7 days are returned.
   *
   * Up to 16 days of forecast are possible.
   *
   * Only applies when requesting forecast data.
   * @default 7
   */
  forecast_days: z
    .int()
    .min(1, { error: "forecast_days must be >= 1" })
    .max(16, { error: "forecast_days must be <= 16" })
    .optional(),
});

/**
 * Raw query parameters for Open-Meteo API.
 */
export type OpenMeteoParams = z.infer<typeof OpenMeteoParamsSchema>;

/**
 * Response from Open-Meteo API.
 */
export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset_seconds: number;

  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
  };

  daily?: {
    time: string[];
    temperature_2m_mean: number[];
    relative_humidity_2m_mean: number[];
  };
}
