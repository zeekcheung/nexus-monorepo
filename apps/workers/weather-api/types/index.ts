import {
  DaySchema,
  ISODateSchema,
  LatitudeSchema,
  LongitudeSchema,
  MonthSchema,
  RelativeHumiditySchema,
  TemperatureCelsiusSchema,
  TimezoneSchema,
  YearSchema,
} from "validators";
import { z } from "zod";

/**
 * Standardized weather data.
 */
export const WeatherDataSchema = z.object({
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
  date: ISODateSchema,
  timezone: TimezoneSchema,
  temperature: TemperatureCelsiusSchema,
  humidity: RelativeHumiditySchema,
});

/**
 * Standardized weather data.
 */
export type WeatherData = z.infer<typeof WeatherDataSchema>;

/**
 * Data Transfer Object for fetching weather data from weather provider.
 */
export const FetchWeatherMetaSchema = z.object({
  latitude: z.preprocess(Number, LatitudeSchema),
  longitude: z.preprocess(Number, LongitudeSchema),
  timezone: TimezoneSchema.optional(),
});

/**
 * Data Transfer Object for fetching weather data from weather provider.
 */
export type FetchWeatherMetaDto = z.infer<typeof FetchWeatherMetaSchema>;

/**
 * Data Transfer Object for fetching current weather data from weather provider.
 */
export const FetchWeatherNowSchema = FetchWeatherMetaSchema;

/**
 * Data Transfer Object for fetching current weather data from weather provider.
 */
export type FetchWeatherNowDto = z.infer<typeof FetchWeatherNowSchema>;

/**
 * Data Transfer Object for fetching archived weather data from Open-Meteo.
 */
export const FetchWeatherHistorySchema = FetchWeatherMetaSchema.extend({
  start_date: ISODateSchema,
  end_date: ISODateSchema,
});

/**
 * Data Transfer Object for fetching archived weather data from Open-Meteo.
 */
export type FetchWeatherHistoryDto = z.infer<typeof FetchWeatherHistorySchema>;

/**
 * Converts an unknown input into an optional integer value.
 *
 * - `null` and `undefined` are treated as absent values and mapped to `undefined`
 * - Non-numeric strings are converted using `Number`
 * - `NaN` results are discarded and become `undefined`
 * - Only finite integers are accepted
 *
 * This helper is intended for cleaning external input (e.g. HTTP query parameters)
 * before applying domain validation schemas.
 */
const toOptionalInt = <T extends z.ZodTypeAny>(schema: T) =>
  z
    .preprocess((v) => {
      if (v === null) return undefined;

      const n = Number(v);
      if (Number.isNaN(n) || !Number.isFinite(n) || !Number.isInteger(n)) {
        return undefined;
      }

      return n;
    }, schema)
    .optional();

/**
 * Data Transfer Object for fetching current / archived weather data from Open-Meteo.
 *
 * Date filters are mutually exclusive:
 * - `start_date`
 * - `end_date`
 * - `start_date` + `end_date`
 * - `year`
 * - `year` + `month`
 * - `year` + `month` + `day`
 */
export const FetchWeatherCompositeSchema = z.union([
  FetchWeatherMetaSchema.extend({
    start_date: ISODateSchema.optional(),
    end_date: ISODateSchema.optional(),
    year: toOptionalInt(YearSchema),
    month: toOptionalInt(MonthSchema),
    day: toOptionalInt(DaySchema),
  }),
]);

export type FetchWeatherCompositeDto = z.infer<typeof FetchWeatherCompositeSchema>;
