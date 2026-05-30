import { formatDateISO } from "shared/date";
import type { Timezone } from "validators";

import type { WeatherData } from "../../types";
import type { OpenMeteoParams, OpenMeteoResponse } from "../../types/meteo";

/**
 * Open-Meteo weather provider.
 */
export class OpenMeteo {
  /** API endpoint for forecast weather data */
  private readonly forecastURL = "https://api.open-meteo.com/v1/forecast";

  /** API endpoint for archive weather data */
  private readonly archiveURL = "https://archive-api.open-meteo.com/v1/archive";

  /** Default request parameters */
  private readonly defaultParams: Partial<OpenMeteoParams> = {
    daily: ["temperature_2m_mean", "relative_humidity_2m_mean"],
    current: ["temperature_2m", "relative_humidity_2m"],
    timezone: "auto",
  };

  /**
   * Convert Open-Meteo parameters into a URL query string.
   *
   * - Arrays are joined with commas
   * - Falsy values are ignored
   * - Output is safe for direct use in fetch()
   */
  private buildQuery(params: OpenMeteoParams): string {
    const resolved = {
      ...this.defaultParams,
      ...params,
    } as Required<Pick<OpenMeteoParams, "timezone" | "current" | "daily">> & OpenMeteoParams;

    const q = new URLSearchParams({
      latitude: String(resolved.latitude),
      longitude: String(resolved.longitude),
      timezone: resolved.timezone,
      ...(resolved.current.length && { current: resolved.current.join(",") }),
      ...(resolved.daily.length && { daily: resolved.daily.join(",") }),
      ...(resolved.start_date && { start_date: resolved.start_date }),
      ...(resolved.end_date && { end_date: resolved.end_date }),
      ...(resolved.forecast_days && { forecast_days: String(resolved.forecast_days) }),
    });

    return q.toString();
  }

  /**
   * Fetch weather data.
   *
   * @param endpoint - Endpoint for weather data
   * @param params - Open-Meteo request parameters
   * @returns Resolved current and/or daily weather data, or null when unavailable
   */
  async fetchWeather(
    endpoint: string,
    params: OpenMeteoParams,
  ): Promise<{ current: WeatherData | null; daily: WeatherData[] }> {
    // Request weather API
    const query = this.buildQuery(params);
    const url = `${endpoint}?${query}`;
    const res = await fetch(url);
    if (!res) throw new Error("Open-Meteo API returned no data.");
    const json = await res.json<OpenMeteoResponse>();

    // Extract latitude and longitude from params
    const { latitude, longitude } = params;

    // Resolve timezone and UTC offset
    const timezone = (json.timezone || params.timezone || this.defaultParams.timezone!) as Timezone;
    const utcOffsetSeconds = json.utc_offset_seconds;

    // Build current weather data
    const currentWeatherData: WeatherData | null = json.current
      ? {
          latitude,
          longitude,
          timezone,
          date: formatDateISO(new Date(new Date(json.current.time).getTime() + utcOffsetSeconds * 1000)),
          temperature: json.current.temperature_2m,
          humidity: json.current.relative_humidity_2m,
        }
      : null;

    // Build daily weather data
    const dailyWeatherData: WeatherData[] = json.daily
      ? json.daily.time.map((t, i) => ({
          latitude,
          longitude,
          timezone,
          date: formatDateISO(new Date(new Date(t).getTime() + utcOffsetSeconds * 1000)),
          temperature: json.daily!.temperature_2m_mean[i]!,
          humidity: json.daily!.relative_humidity_2m_mean[i]!,
        }))
      : [];

    // Return current weather data and daily weather data
    return { current: currentWeatherData, daily: dailyWeatherData };
  }

  /**
   * Fetch current weather data.
   *
   * @param params - Open-Meteo request parameters
   * @returns Current weather data
   */
  async fetchNow(params: OpenMeteoParams): Promise<WeatherData> {
    const { current } = await this.fetchWeather(this.forecastURL, params);
    if (!current) throw new Error("No current weather data available.");
    return current;
  }

  /**
   * Fetch historical daily weather data.
   *
   * @param params - Open-Meteo request parameters
   * @returns Array of daily weather records
   */
  async fetchHistory(params: OpenMeteoParams): Promise<WeatherData[]> {
    const { daily } = await this.fetchWeather(this.archiveURL, params);
    if (!daily.length) throw new Error("No historical weather data available.");
    return daily;
  }
}
