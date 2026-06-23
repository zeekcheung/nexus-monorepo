/**
 * Client-side script for updating monitor data via polling.
 * Runs entirely in the browser.
 */

/**
 * @typedef {import("../../src/types/index.ts").MonitorPageProps} MonitorPageProps
 */

(function () {
  /** @type {HTMLElement} */
  const root = document.getElementById("root");
  if (!root) return;

  /** @type {MonitorPageProps}  */
  const initialState = JSON.parse(document.getElementById("__INITIAL_STATE__").textContent);

  /** @type {MonitorPageProps}  */
  const defaultState = {
    totalHourValue: 12,
    totalMinuteValue: 0,
    totalSecondValue: 0,
    elapsedHourValue: 0,
    elapsedMinuteValue: 0,
    elapsedSecondValue: 0,
    updateInterval: 60,
    temperatureValue: 25,
    humidityValue: 50,
  };

  const totalSeconds =
    parseInt(initialState.totalHourValue ?? defaultState.totalHourValue) * 3600 +
    parseInt(initialState.totalMinuteValue ?? defaultState.totalMinuteValue) * 60 +
    parseInt(initialState.totalSecondValue ?? defaultState.totalSecondValue);

  let elapsedSeconds =
    parseInt(initialState.elapsedHourValue ?? defaultState.elapsedHourValue) * 3600 +
    parseInt(initialState.elapsedMinuteValue ?? defaultState.elapsedMinuteValue) * 60 +
    parseInt(initialState.elapsedSecondValue ?? defaultState.elapsedSecondValue);

  const updateInterval = parseInt(initialState.updateInterval ?? defaultState.updateInterval);
  const updateIntervalMs = updateInterval * 1000;
  const secondsHidden = initialState.elapsedSecondHidden === "1";

  let baseTemperature = parseFloat(initialState.temperatureValue ?? defaultState.temperatureValue);
  const baseHumidity = parseFloat(initialState.humidityValue ?? defaultState.humidityValue);

  // Cache DOM references
  const dom = {
    temperature: root.querySelector('[data-bind="temperature"]'),
    humidity: root.querySelector('[data-bind="humidity"]'),
    hour: root.querySelector('[data-bind="hour"]'),
    minute: root.querySelector('[data-bind="minute"]'),
    second: root.querySelector('[data-bind="second"]'),
    progressFill: document.getElementById("progress-fill"),
    progressValue: root.querySelector('[data-bind="progress-value"]'),
  };

  /**
   * Get a random integer between min and max (inclusive)
   * @param {number} min the minimum value
   * @param {number} max the maximum value
   * @returns {number} a random integer between min and max (inclusive)
   */
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  /**
   * Check if the process has not started yet
   * @returns {boolean} true if the process is idle, false otherwise
   */
  const isIdle = () => elapsedSeconds === 0 && totalSeconds === 0;

  /**
   * Check if the process is currently running
   * @returns {boolean} true if the process is working, false otherwise
   */
  const isWorking = () => {
    const progress = getProgress();
    return !isIdle() && progress < 100;
  };

  /**
   * Calculate progress percentage
   * @returns {number} the progress percentage
   */
  const getProgress = () => {
    if (elapsedSeconds < 0 || totalSeconds < 0) {
      const msg = "Process time or total time cannot be negative";
      window.alert(msg);
      throw new RangeError(msg);
    }
    if (isIdle()) {
      return 0;
    }
    if (elapsedSeconds >= totalSeconds) {
      return 100;
    }
    return (elapsedSeconds / totalSeconds) * 100;
  };

  /**
   * Update the progress
   * @param {number} fractionDigits the number of decimal places to display in the progress value
   */
  function updateProgress(fractionDigits = 0) {
    const progress = getProgress();
    if (dom.progressFill) {
      dom.progressFill.style.width = `${progress.toFixed(2)}${initialState.progressUnit || "%"}`;
    }
    if (dom.progressValue) {
      dom.progressValue.textContent = Math.floor(progress).toFixed(fractionDigits);
    }
  }

  const FETCH_WEATHER_INTERVAL = 10 * 60 * 1000; // 10 min

  /**
   * Polling loop for weather updates
   */
  const fetchWeatherLoop = async () => {
    try {
      const res = await fetch("/api/weather");
      if (res.ok) {
        /** @type {{temperature: number; humidity: number} | null} */
        const data = await res.json();
        if (data.temperature != null) {
          baseTemperature = data.temperature;
        }
      }
    } catch (error) {
      // Silently fail on network errors; retry next cycle
      console.log(error);
    }

    setTimeout(fetchWeatherLoop, FETCH_WEATHER_INTERVAL);
  };

  /**
   * Polling loop for UI updates
   */
  const updateUILoop = async () => {
    const working = isWorking();

    // Update temperature
    if (dom.temperature) {
      const temperature = baseTemperature - (working ? getRandomInt(2, 3) : 0) + getRandomInt(-1, 1);
      dom.temperature.textContent = Math.floor(temperature);
    }

    // Update humidity
    if (dom.humidity) {
      const humidity = working ? getRandomInt(96, 98) + getRandomInt(-1, 1) : baseHumidity + getRandomInt(-1, 1);
      dom.humidity.textContent = Math.floor(humidity);
    }

    if (working) {
      elapsedSeconds += updateInterval;

      const hours = Math.floor(elapsedSeconds / 3600);
      const minutes = Math.floor((elapsedSeconds % 3600) / 60);
      const seconds = elapsedSeconds % 60;

      if (dom.hour) dom.hour.textContent = hours;
      if (dom.minute) dom.minute.textContent = minutes;
      if (dom.second && !secondsHidden) dom.second.textContent = seconds;

      // Update progress
      updateProgress();
    }

    setTimeout(updateUILoop, updateIntervalMs);
  };

  // Initialize progress
  updateProgress();

  // Start update UI
  setTimeout(updateUILoop, updateIntervalMs);

  // Start update weather
  setTimeout(fetchWeatherLoop, FETCH_WEATHER_INTERVAL);
})();
