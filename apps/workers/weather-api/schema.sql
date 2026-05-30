DROP TABLE IF EXISTS weather;
CREATE TABLE IF NOT EXISTS weather (
    latitude REAL,
    longitude REAL,
    timezone TEXT,
    date TEXT,
    temperature REAL,
    humidity REAL,
    year text generated always as (strftime('%Y', date)) virtual,
    month text generated always as (strftime('%m', date)) virtual,
    day text generated always as (strftime('%d', date)) virtual,
    PRIMARY KEY (latitude, longitude, timezone, date)
);
CREATE INDEX idx_latitude ON weather(latitude);
CREATE INDEX idx_longitude ON weather(longitude);
CREATE INDEX idx_latitud_longitude_year_month ON weather(latitude, longitude, year, month);
CREATE INDEX idx_latitud_longitude_year_month_day ON weather(latitude, longitude, year, month, day);
