/**
 * Client-side script for updating monitor data via polling.
 * Runs entirely in the browser.
 */

/**
 * @typedef {import("../../src/types/index.ts").MonitorPageProps} InitialState
 */

(function () {
  /** @type {HTMLElement} */
  const root = document.getElementById("root");
  if (!root) return;

  /** @type {InitialState}  */
  const state = JSON.parse(document.getElementById("__INITIAL_STATE__").textContent);

  const totalSeconds =
    parseInt(state.totalHourValue ?? 12) * 3600 +
    parseInt(state.totalMinuteValue ?? 0) * 60 +
    parseInt(state.totalSecondValue ?? 0);

  let elapsedSeconds =
    parseInt(state.elapsedHourValue ?? 0) * 3600 +
    parseInt(state.elapsedMinuteValue ?? 0) * 60 +
    parseInt(state.elapsedSecondValue ?? 0);

  const updateInterval = parseInt(state.updateInterval ?? 60);
  const updateIntervalMs = updateInterval * 1000;
  const secondsHidden = state.elapsedSecondHidden === "1";

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
   * Determines if the process is currently active.
   */
  const isActive = () => {
    if (totalSeconds <= 0) return false;
    return (elapsedSeconds / totalSeconds) * 100 < 100;
  };

  /**
   * Polling logic: fetch weather and update UI.
   */
  const poll = async () => {
    try {
      const response = await fetch("/api/weather");
      if (response.ok) {
        /** @type {{temperature: number; humidity: number} | null} */
        const data = await response.json();
        if (dom.temperature && data.temperature != null) {
          dom.temperature.textContent = Math.round(data.temperature);
        }
      }
    } catch (error) {
      // Silently fail on network errors; retry next cycle
      console.log(error);
    }

    // Update process time locally
    if (isActive()) {
      elapsedSeconds += updateInterval;

      const hours = Math.floor(elapsedSeconds / 3600);
      const minutes = Math.floor((elapsedSeconds % 3600) / 60);
      const seconds = elapsedSeconds % 60;

      if (dom.hour) dom.hour.textContent = hours;
      if (dom.minute) dom.minute.textContent = minutes;
      if (dom.second && !secondsHidden) dom.second.textContent = seconds;

      // Update progress bar
      const percentage = Math.min(100, totalSeconds <= 0 ? 0 : (elapsedSeconds / totalSeconds) * 100);
      if (dom.progressFill) {
        dom.progressFill.style.width = `${percentage.toFixed(2)}${state.progressUnit || "%"}`;
      }
      if (dom.progressValue) {
        dom.progressValue.textContent = Math.floor(percentage);
      }
    }

    setTimeout(poll, updateIntervalMs);
  };

  // Start polling
  setTimeout(poll, updateIntervalMs);
})();
