-- Create the drivers table for SQLite
CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    working_hours INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create the trips table for SQLite
CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_id INTEGER,
    destination TEXT NOT NULL,
    cargo TEXT NOT NULL,
    commission_type TEXT NOT NULL,
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers (id) ON DELETE SET NULL
);

-- Create triggers to update the updated_at column on table updates
CREATE TRIGGER update_drivers_updated_at
AFTER UPDATE ON drivers
FOR EACH ROW
BEGIN
    UPDATE drivers SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER update_trips_updated_at
AFTER UPDATE ON trips
FOR EACH ROW
BEGIN
    UPDATE trips SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;


-- Insert fake drivers
INSERT INTO drivers (name, email, password_hash, working_hours)
VALUES
('Ahmed Tijani', 'ahmed.tijani@example.com', 'hashedpassword1', 40),
('Fatima Zahra', 'fatima.zahra@example.com', 'hashedpassword2', 36),
('Mohamed Ali', 'mohamed.ali@example.com', 'hashedpassword3', 50),
('Sara Elhassan', 'sara.elhassan@example.com', 'hashedpassword4', 42),
('Youssef Ben', 'youssef.ben@example.com', 'hashedpassword5', 38);

-- Insert fake trips
INSERT INTO trips (driver_id, destination, cargo, commission_type, start_time, end_time)
VALUES
(1, 'Casablanca', 'Electronics', 'Percentage', '2025-08-10 08:00:00', '2025-08-10 14:00:00'),
(2, 'Rabat', 'Furniture', 'Fixed', '2025-08-11 09:30:00', '2025-08-11 15:45:00'),
(3, 'Marrakech', 'Clothing', 'Percentage', '2025-08-12 07:15:00', '2025-08-12 13:20:00'),
(1, 'Tangier', 'Machinery', 'Fixed', '2025-08-13 06:45:00', '2025-08-13 12:30:00'),
(4, 'Fes', 'Food Supplies', 'Percentage', '2025-08-14 10:00:00', '2025-08-14 16:15:00'),
(5, 'Agadir', 'Chemicals', 'Fixed', '2025-08-15 08:20:00', '2025-08-15 14:10:00'),
(2, 'Oujda', 'Textiles', 'Percentage', '2025-08-16 09:00:00', '2025-08-16 17:00:00');
