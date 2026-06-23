import { z } from "zod";

import { presetDataList } from "../utils";

export const MonitorPageMetaPropsSchema = z.object({
  /**
   * Type of curing.
   * @default "喷雾养护"
   */
  curingType: z.string().optional().default("喷雾养护").describe("Type of curing"),
  /**
   * Number of curing box.
   * @example "①"
   */
  boxNumber: z.string().optional().describe("Number of curing box"),
  /**
   * Label of curing status.
   * @default "状态："
   */
  statusLabel: z.string().optional().default("状态：").describe("Label of curing status"),
  /**
   * Value of curing status.
   * @example "空闲"
   */
  statusValue: z.string().optional().describe("Value of curing status"),

  /**
   * Label of temperature.
   * @default "温度："
   */
  temperatureLabel: z.string().optional().default("温度：").describe("Label of temperature"),
  /**
   * Value of temperature.
   * @example 25
   */
  temperatureValue: z.preprocess(Number, z.number().optional().describe("Value of temperature")),
  /**
   * Unit of temperature.
   * @default "℃"
   */
  temperatureUnit: z.string().optional().default("℃").describe("Unit of temperature"),
  /**
   * Label of humidity.
   * @default "湿度："
   */
  humidityLabel: z.string().optional().default("湿度：").describe("Label of humidity"),
  /**
   * Value of humidity.
   * @example 96
   */
  humidityValue: z.preprocess(Number, z.number().optional().describe("Value of humidity")),
  /**
   * Unit of humidity.
   * @default "%"
   */
  humidityUnit: z.string().optional().default("%").describe("Unit of humidity"),
  /**
   * Update interval in seconds.
   * @example 60
   */
  updateInterval: z.preprocess(
    Number,
    z.int().min(0, { error: "updateInterval must be > 0" }).optional().describe("Update interval in seconds"),
  ),

  /**
   * Label of elapsed time.
   * @default "时长："
   */
  elapsedLabel: z.string().optional().default("时长：").describe("Label of elapsed time"),
  /**
   * Value of elapsed time in hours.
   * @example 5
   */
  elapsedHourValue: z.preprocess(
    Number,
    z.number().min(0, { error: "elapsedHourValue must be >= 0" }).optional().describe("Value of elapsed time in hours"),
  ),
  /**
   * Unit of elapsed time in hours.
   * @default "小时"
   */
  elapsedHourUnit: z.string().default("小时").describe("Unit of elapsed time in hours"),
  /**
   * Value of elapsed time in minutes.
   * @example 30
   */
  elapsedMinuteValue: z.preprocess(
    Number,
    z
      .int()
      .min(0, { error: "elapsedMinuteValue must be >= 0" })
      .max(59, { error: "elapsedMinuteValue must be < 60" })
      .optional()
      .describe("Value of elapsed time in minutes"),
  ),
  /**
   * Unit of elapsed time in minutes.
   * @default "分钟"
   */
  elapsedMinuteUnit: z.string().optional().default("分钟").describe("Unit of elapsed time in minutes"),
  /**
   * Value of elapsed time in seconds.
   * @example 59
   */
  elapsedSecondValue: z.preprocess(
    Number,
    z
      .int()
      .min(0, { error: "elapsedSecondValue must be >= 0" })
      .max(59, { error: "elapsedSecondValue must be < 60" })
      .optional()
      .describe("Value of elapsed time in seconds"),
  ),
  /**
   * Unit of elapsed time in seconds.
   * @example "秒"
   */
  elapsedSecondUnit: z.string().optional().default("秒").describe("Unit of elapsed time in seconds"),
  /**
   * Whether to hide elapsed time in seconds.
   * @example "1"
   */
  elapsedSecondHidden: z
    .enum(["0", "1"], { error: `elapsedSecondHidden must be "0" or "1"` })
    .optional()
    .describe("Whether to hide elapsed time in seconds"),

  /**
   * Label of progress bar.
   * @default "进度："
   */
  progressLabel: z.string().optional().default("进度：").describe("Label of progress bar"),
  /**
   * Unit of progress value.
   * @default "%"
   */
  progressUnit: z.string().optional().default("%").describe("Unit of progress value"),
  /**
   * Value of total time in hours.
   * @example 12
   */
  totalHourValue: z.preprocess(Number, z.number().optional().describe("Value of total time in hours")),
  /**
   * Value of total time in minutes.
   * @example 0
   */
  totalMinuteValue: z.preprocess(
    Number,
    z
      .int()
      .min(0, { error: "totalMinuteValue must be >= 0" })
      .max(59, "totalMinuteValue must be < 59")
      .optional()
      .describe("Value of total time in minutes"),
  ),
  /**
   * Value of total time in seconds.
   * @example 0
   */
  totalSecondValue: z.preprocess(
    Number,
    z
      .int()
      .min(0, { error: "totalSecondValue must be >= 0" })
      .max(59, "totalSecondValue must be < 59")
      .optional()
      .describe("Value of total time in seconds"),
  ),
});

export type MonitorPageMetaProps = z.infer<typeof MonitorPageMetaPropsSchema>;

export const MonitorPagePropsSchema = MonitorPageMetaPropsSchema.extend({
  lang: z.string(),
  title: z.string(),
});

export type MonitorPageProps = z.infer<typeof MonitorPagePropsSchema>;

export const FetchMonitorPageDtoSchema = MonitorPageMetaPropsSchema.extend({
  /**
   * Index of preset data.
   * @example "0"
   */
  preset: z
    .enum(presetDataList.map((_, i) => i.toString()))
    .optional()
    .describe("Index of preset data"),
});
