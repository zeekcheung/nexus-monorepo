/**
 * Formats a Date as an ISO string, optionally including time component.
 * @param date - Input date to format
 * @param includeTime - Include full timestamp (default: false)
 * @returns ISO date string (full or date-only)
 */
export function dateToISOString(date: Date, includeTime: boolean = false): string {
  const isoString = date.toISOString();
  return includeTime ? isoString : isoString.substring(0, 10);
}
