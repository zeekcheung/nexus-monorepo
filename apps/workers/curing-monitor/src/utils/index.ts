import type { MonitorPageMetaProps } from "../types";

type PresetData = MonitorPageMetaProps;

/**
 * Preset index data list
 */
export const presetDataList: PresetData[] = [
  /**
   * preset=0
   */
  {
    curingType: "喷雾养护",
    // boxNumber: "①",
    boxNumber: "",
    statusLabel: "状态：",
    statusValue: "养护中",
    temperatureLabel: "温度：",
    // temperatureValue: 25,
    temperatureUnit: "℃",
    humidityLabel: "湿度：",
    // humidityValue: 96,
    humidityUnit: "%",
    elapsedLabel: "时长：",
    elapsedHourValue: 0,
    elapsedHourUnit: "小时",
    elapsedMinuteValue: 0,
    elapsedMinuteUnit: "分钟",
    elapsedSecondValue: 0,
    elapsedSecondUnit: "秒",
    elapsedSecondHidden: "0",
    totalHourValue: 0,
    totalMinuteValue: 0,
    totalSecondValue: 60,
    progressLabel: "进度：",
    progressUnit: "%",
    updateInterval: 1,
  } satisfies PresetData,
  /**
   * preset=1
   */
  {
    curingType: "喷雾养护",
    // boxNumber: "②",
    boxNumber: "",
    statusLabel: "状态：",
    statusValue: "空闲",
    temperatureLabel: "温度：",
    // temperatureValue: 25,
    temperatureUnit: "℃",
    humidityLabel: "湿度：",
    // humidityValue: 96,
    humidityUnit: "%",
    elapsedLabel: "时长：",
    elapsedHourValue: 0,
    elapsedHourUnit: "小时",
    elapsedMinuteValue: 0,
    elapsedMinuteUnit: "分钟",
    elapsedSecondValue: 0,
    elapsedSecondUnit: "秒",
    elapsedSecondHidden: "1",
    totalHourValue: 0,
    totalMinuteValue: 0,
    totalSecondValue: 0,
    progressLabel: "进度：",
    progressUnit: "%",
    updateInterval: 5,
  } satisfies PresetData,
  /**
   * preset=2
   */
  {
    curingType: "喷雾养护",
    // boxNumber: "③",
    boxNumber: "",
    statusLabel: "状态：",
    statusValue: "养护中",
    temperatureLabel: "温度：",
    // temperatureValue: 25,
    temperatureUnit: "℃",
    humidityLabel: "湿度：",
    // humidityValue: 96,
    humidityUnit: "%",
    elapsedLabel: "时长：",
    elapsedHourValue: 0,
    elapsedHourUnit: "小时",
    elapsedMinuteValue: 0,
    elapsedMinuteUnit: "分钟",
    elapsedSecondValue: 0,
    elapsedSecondUnit: "秒",
    elapsedSecondHidden: "1",
    totalHourValue: 24,
    totalMinuteValue: 0,
    totalSecondValue: 0,
    progressLabel: "进度：",
    progressUnit: "%",
    updateInterval: 5,
  } satisfies PresetData,
] as const;
