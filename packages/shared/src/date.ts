import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(tz);

export const ISO_DATE_TEMPLATE = "YYYY-MM-DD";

/**
 * Determines whether the provided date components represent today in the given timezone.
 */
export function isToday(year?: number, month?: number, day?: number, timezone?: string): boolean {
  if (!year || !month || !day) return false;

  const target = timezone ? dayjs(`${year}-${month}-${day}`).tz(timezone) : dayjs(`${year}-${month}-${day}`);

  return target.format(ISO_DATE_TEMPLATE) === dayjs().format(ISO_DATE_TEMPLATE);
}

/**
 * Options for formatting a date using Intl.DateTimeFormat.
 */
export interface DateFormatterOptions extends Intl.DateTimeFormatOptions {
  /** Locale identifier (e.g. "en-US", "zh-CN") */
  locales?: Intl.LocalesArgument;
}

/**
 * Structured result returned by `formatDateParts`.
 * Each field represents a parsed part of the formatted date.
 */
export type FormattedDateParts = Record<keyof Intl.DateTimeFormatPartTypesRegistry, string>;

/**
 * Default formatting options used by `formatDateParts`.
 * Configured for Asia/Shanghai timezone and en-US locale.
 */
export const defaultDateFormatterOptions: DateFormatterOptions = {
  locales: "en-US",
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
};

/**
 * Formats a Date object into an ISO date string.
 *
 * @param date - The date to format
 * @param withTime - Whether to include the full timestamp (default: false)
 * @returns An ISO date string (YYYY-MM-DD or full ISO 8601)
 *
 * @example
 * formatDateISO(new Date()); // "2026-01-15"
 * formatDateISO(new Date(), true); // "2026-01-15T08:30:00.000Z"
 */
export function formatDateISO(date: Date, withTime = false): string {
  const iso = date.toISOString();
  return withTime ? iso : iso.slice(0, 10);
}

/**
 * Formats a Date object into structured date parts using Intl.DateTimeFormat.
 *
 * @param date - The date to format
 * @param options - Formatting options (locale, timezone, etc.)
 * @returns An object containing date parts keyed by their type
 *
 * @example
 * formatDateParts(new Date());
 * // {
 * //   year: "2026",
 * //   month: "1",
 * //   day: "15",
 * //   hour: "16",
 * //   minute: "30",
 * //   second: "45"
 * // }
 */
export function formatDateParts(
  date: Date,
  options: DateFormatterOptions = defaultDateFormatterOptions,
): FormattedDateParts {
  const { locales: locals, ...formatOptions } = options;

  const parts = new Intl.DateTimeFormat(locals, formatOptions).formatToParts(date);

  return parts.reduce<FormattedDateParts>((result, part) => {
    if (part.type !== "literal") {
      result[part.type] = part.value;
    }
    return result;
  }, {} as FormattedDateParts);
}
