import { z } from "zod";

/**
 * ISO 8601 calendar date (YYYY-MM-DD).
 *
 * @example "2026-01-01"
 */
export const ISODateSchema = z.iso.date().describe("ISO 8601 calendar date (YYYY-MM-DD)");

/**
 * The time zone set.
 * @see {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones Time Zone Database}
 */
const timezone = [
  "GMT",
  "UTC",
  "auto",
  "Africa/Abidjan",
  "Africa/Accra",
  "Africa/Addis_Ababa",
  "Africa/Algiers",
  "Africa/Cairo",
  "Africa/Casablanca",
  "Africa/Johannesburg",
  "America/Anchorage",
  "America/Argentina/Buenos_Aires",
  "America/Bogota",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/New_York",
  "America/Sao_Paulo",
  "America/Toronto",
  "Asia/Bangkok",
  "Asia/Dubai",
  "Asia/Hong_Kong",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Europe/Amsterdam",
  "Europe/Berlin",
  "Europe/London",
  "Europe/Moscow",
  "Europe/Paris",
  "Pacific/Auckland",
  "Pacific/Honolulu",
] as const;

export const TimezoneSchema = z.enum(timezone).describe("IANA timezone");

/**
 * IANA timezone from the time zone database.
 * @see TIMEZONE_SET
 * @see {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones Time Zone Database}
 * @example "Asia/Shanghai"
 */
export type Timezone = z.infer<typeof TimezoneSchema>;
/**
 * Year (1900-2100)
 * @example 2026
 */
export const YearSchema = z
  .int()
  .min(1900, { error: "Year must be >= 1900" })
  .max(2100, { error: "Year must be <= 2100" })
  .describe("Year (1900-2100)");

/**
 * Month (1–12)
 * @example 1
 */
export const MonthSchema = z
  .int()
  .min(1, { error: "Month must be >= 1" })
  .max(12, { error: "Month must be <= 12" })
  .describe("Month (1–12)");

/**
 * Day (1–31)
 * @example 1
 */
export const DaySchema = z
  .int()
  .min(1, { error: "Day must be >= 1" })
  .max(31, { error: "Day must be <= 31" })
  .describe("Day (1–31)");
