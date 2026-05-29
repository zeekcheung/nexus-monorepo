import { z } from "zod";

/**
 * Air temperature in degrees Celsius °C.
 * @example 16
 */
export const TemperatureCelsiusSchema = z.number().describe("Air temperature in degrees Celsius");

/**
 * Relative humidity as a percentage (0–100) %
 * @example 77.5
 */
export const RelativeHumiditySchema = z
  .number()
  .min(0, { error: "Humidity must be >= 0%" })
  .max(100, { error: "Humidity must be <= 100%" })
  .describe("Relative humidity in percent");
