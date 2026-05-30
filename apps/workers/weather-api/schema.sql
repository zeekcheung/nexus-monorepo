-- https://dash.cloudflare.com/dc8dbaaedf6cdb4a65bfc6d07814eedf/workers/d1/databases/03037eb2-fb06-48bd-8cb5-d4beff829adc/console

-- Create Table
DROP TABLE IF EXISTS weather;
CREATE TABLE IF NOT EXISTS weather (
    areaId TEXT,
    date TEXT,
    timeZone TEXT,
    temperature REAL,
    humidity REAL,
    source TEXT,
    year text generated always as (strftime('%Y', date)) virtual,
    month text generated always as (strftime('%m', date)) virtual,
    day text generated always as (strftime('%d', date)) virtual,
    PRIMARY KEY (areaId, date, timeZone)
);

-- Create Indexes
CREATE INDEX idx_areaId ON weather(areaId);
CREATE INDEX idx_areaId_year_month ON weather(areaId, year, month);
CREATE INDEX idx_areaId_year_month_day ON weather(areaId, year, month, day);
