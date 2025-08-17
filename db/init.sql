-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the drivers table
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    working_hours INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a trigger to update the updated_at column on drivers table update
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON drivers
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


-- Create the trips table
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    destination VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    commission_type VARCHAR(50) NOT NULL,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a trigger to update the updated_at column on trips table update
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON trips
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
