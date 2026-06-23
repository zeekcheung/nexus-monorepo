import type { MonitorPageProps } from "../types";

/**
 * Renders the initial static HTML structure for the monitor page.
 * This component runs only once on the server during SSR.
 */
export const MonitorPage = (props: MonitorPageProps) => {
  const totalSeconds =
    Number(props.totalHourValue) * 3600 + Number(props.totalMinuteValue) * 60 + Number(props.totalSecondValue);

  const elapsedSeconds =
    Number(props.elapsedHourValue) * 3600 + Number(props.elapsedMinuteValue) * 60 + Number(props.elapsedSecondValue);

  const progressPercentage = totalSeconds <= 0 ? 0 : Math.min(100, (elapsedSeconds / totalSeconds) * 100);

  const secondsVisibility = props.elapsedSecondHidden === "1" ? "visible" : "hidden";

  return (
    <html lang={props.lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <link rel="stylesheet" href="/static/monitor.css" />
      </head>
      <body>
        <main id="root">
          {/* Info Section */}
          <section class="data-container">
            <div class="data-item">
              <span class="data-label">{props.curingType}</span>
              <span class="data-value">{props.boxNumber}</span>
            </div>
            <div class="data-item">
              <span class="data-label">{props.statusLabel}</span>
              <span class="data-value">{props.statusValue}</span>
            </div>
          </section>

          {/* Weather Section */}
          <section class="data-container">
            <div class="data-item">
              <span class="data-label">{props.temperatureLabel}</span>
              <span class="data-value" data-bind="temperature">
                {props.temperatureValue}
              </span>
              <span class="data-unit">{props.temperatureUnit}</span>
            </div>
            <div class="data-item">
              <span class="data-label">{props.humidityLabel}</span>
              <span class="data-value" data-bind="humidity">
                {props.humidityValue}
              </span>
              <span class="data-unit">{props.humidityUnit}</span>
            </div>
          </section>

          {/* Process Section */}
          <section class="data-container">
            <div class="data-item">
              <span class="data-label">{props.elapsedLabel}</span>
              <span class="data-value" data-bind="hour">
                {props.elapsedHourValue}
              </span>
              <span class="data-unit">{props.elapsedHourUnit}</span>
              <span class="data-value" data-bind="minute">
                {props.elapsedMinuteValue}
              </span>
              <span class="data-unit">{props.elapsedMinuteUnit}</span>
              <span class="data-value" data-bind="second" style={{ visibility: secondsVisibility }}>
                {props.elapsedSecondValue}
              </span>
              <span class="data-unit" style={{ visibility: secondsVisibility }}>
                {props.elapsedSecondUnit}
              </span>
            </div>
          </section>

          {/* Progress Section */}
          <section class="data-container">
            <div class="data-item">
              <span class="data-label">{props.progressLabel}</span>
              <div class="progress-container">
                <div
                  id="progress-fill"
                  class="progress-fill"
                  style={{ width: `${progressPercentage.toFixed(2)}${props.progressUnit}` }}
                >
                  <span class="progress-text" data-bind="progress-value">
                    {Math.floor(progressPercentage)}
                  </span>
                  <span class="progress-text">{props.progressUnit}</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Load the initial state */}
        <script
          id="__INITIAL_STATE__"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(props) }}
          defer
        />

        {/* Load the client-side script */}
        <script src="/static/monitor.js" defer />
      </body>
    </html>
  );
};
