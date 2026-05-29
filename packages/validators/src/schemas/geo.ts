import { z } from "zod";

/**
 * Geographical latitude in decimal degrees (WGS84).
 * @see {@link https://www.geonames.org GeoNames}
 * @see {@link https://open-meteo.com/en/docs/geocoding-api#geocoding_search Geocoding API}
 * @example 52.54
 */
export const LatitudeSchema = z
  .number()
  .min(-90, { error: "Latitude must be >= -90" })
  .max(90, { error: "Latitude must be <= 90" })
  .describe("Geographical latitude in decimal degrees (WGS84)");

/**
 * Geographical longitude in decimal degrees (WGS84).
 * @see {@link https://www.geonames.org GeoNames}
 * @see {@link https://open-meteo.com/en/docs/geocoding-api#geocoding_search Geocoding API}
 * @example 13.41
 */
export const LongitudeSchema = z
  .number()
  .min(-180, { error: "Longitude must be >= -180" })
  .max(180, { error: "Longitude must be <= 180" })
  .describe("Geographical longitude in decimal degrees (WGS84)");
