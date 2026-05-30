import dayjs from "dayjs";
import { ISO_DATE_TEMPLATE } from "shared/date";

const BASE = "/api";
const NOW = `${BASE}/now`;
const HISTORY = `${BASE}/history`;

export const WeatherPaths = {
  Now: NOW,
  History: HISTORY,
  Composite: BASE,
} as const;

/**
 * Ensures both start_date and end_date exist.
 */
export function completeDateRange(start_date?: string, end_date?: string): { start_date: string; end_date: string } {
  if (!start_date && !end_date) {
    throw new Error("start_date or end_date must be provided");
  }

  return {
    // Only start_date provided → default end_date to +1 month
    start_date: start_date ?? dayjs(end_date!).subtract(1, "month").format(ISO_DATE_TEMPLATE),
    // Only end_date provided → default start_date to -1 month
    end_date: end_date ?? dayjs(start_date).add(1, "month").format(ISO_DATE_TEMPLATE),
  };
}

/**
 * Builds a concrete date range from year/month/day inputs.
 */
export function buildYearRange(year: number, month?: number, day?: number): { start_date: string; end_date: string } {
  // Specific calendar day → single-day range
  if (month && day) {
    const date = dayjs(`${year}-${month}-${day}`).format(ISO_DATE_TEMPLATE);
    return { start_date: date, end_date: date };
  }

  const now = dayjs();
  const isThisYear = year === now.year();
  const isThisMonth = isThisYear && month === now.month() + 1;
  const isFirstDayOfThisMonth = isThisMonth && now.date() === 1;

  // Specific month → full calendar month
  if (month) {
    if (isFirstDayOfThisMonth) {
      throw new Error(`Cannot get today's weather data from ${WeatherPaths.History}`);
    }

    const start_date = dayjs(`${year}-${month}-01`).format(ISO_DATE_TEMPLATE);
    const end_date = isThisMonth
      ? dayjs(`${year}-${month}-${now.date() - 1}`).format(ISO_DATE_TEMPLATE)
      : dayjs(`${year}-${month}-01`).endOf("month").format(ISO_DATE_TEMPLATE);

    return { start_date, end_date };
  }

  // Year only → full calendar year
  return {
    start_date: `${year}-01-01`,
    end_date: isThisYear ? now.format(ISO_DATE_TEMPLATE) : `${year}-12-31`,
  };
}
