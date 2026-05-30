/*
 * TODO: Cache the weather data with Cloudflare D1.
 */

import { env } from "cloudflare:workers";

import type { FetchWeatherMetaDto, WeatherData } from "../../types";

/**
 * Data Transfer Object for querying weather records from the D1 database.
 */
export type WeatherQueryDto = Partial<Pick<FetchWeatherMetaDto, "latitude" | "longitude" | "timezone">> & {
  /**
   * Year filter
   * @example 2026
   * @example "2026"
   */
  year?: number | string;
  /**
   * Month filter (1–12)
   * @example 1
   * @example "12"
   */
  month?: number | string;
  /**
   * Day filter (1–31)
   * @example 1
   * @example "31"
   */
  day?: number | string;
};

/**
 * Repository class responsible for accessing weather data stored in Cloudflare D1.
 */
export class WeatherRepository {
  /**
   * Name of the D1 table storing weather records.
   */
  private readonly table = "weather";

  /**
   * Query weather records with optional filters.
   *
   * Filters are applied using parameterized SQL to prevent SQL injection.
   *
   * @param query - Filter conditions.
   * @returns Weather records ordered by date descending.
   */
  async findMany(query: WeatherQueryDto) {
    const conditions: string[] = ["1 = 1"];
    const params: unknown[] = [];

    if (query.latitude) {
      conditions.push("latitude = ?");
      params.push(query.latitude);
    }

    if (query.longitude) {
      conditions.push("longitude = ?");
      params.push(query.longitude);
    }

    if (query.timezone) {
      conditions.push("timeZone = ?");
      params.push(query.timezone);
    }

    if (query.year) {
      conditions.push("strftime('%Y', date) = ?");
      params.push(query.year);
    }

    if (query.month) {
      conditions.push("strftime('%m', date) = ?");
      params.push(query.month.toString().padStart(2, "0"));
    }

    if (query.day) {
      conditions.push("strftime('%d', date) = ?");
      params.push(query.day.toString().padStart(2, "0"));
    }

    const sql = `
      SELECT *
      FROM ${this.table}
      WHERE ${conditions.join(" AND ")}
      ORDER BY date DESC
    `;

    return await env.DB.prepare(sql)
      .bind(...params)
      .all<WeatherData>();
  }

  /**
   * Insert or replace weather records in the database.
   *
   * Uses parameterized SQL for safety and batch execution for efficiency.
   *
   * @param input - Single record or array of records.
   */
  async save(input: WeatherData | WeatherData[]) {
    const records = Array.isArray(input) ? input : [input];

    if (records.length === 0) {
      return;
    }

    const statements = records.map((record) =>
      env.DB.prepare(`
        INSERT OR REPLACE INTO ${this.table}
          (latitude, longitude, timezone, date, temperature, humidity)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(record.latitude, record.longitude, record.timezone, record.date, record.temperature, record.humidity),
    );

    return await env.DB.batch(statements);
  }
}
