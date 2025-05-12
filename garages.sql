-- DW Garages - SQL Installation Script

ALTER TABLE player_vehicles ADD COLUMN IF NOT EXISTS state INT DEFAULT 1;
ALTER TABLE player_vehicles ADD COLUMN IF NOT EXISTS stored INT DEFAULT 1;
ALTER TABLE player_vehicles ADD COLUMN IF NOT EXISTS last_update INT DEFAULT 0;
ALTER TABLE player_vehicles ADD COLUMN IF NOT EXISTS custom_name VARCHAR(50) DEFAULT NULL;
ALTER TABLE player_vehicles ADD COLUMN IF NOT EXISTS is_favorite INT DEFAULT 0;
ALTER TABLE player_vehicles ADD COLUMN IF NOT EXISTS stored_in_gang VARCHAR(50) DEFAULT NULL;
ALTER TABLE player_vehicles ADD COLUMN IF NOT EXISTS shared_garage_id INT DEFAULT NULL;

-- Impound system columns
ALTER TABLE player_vehicles ADD COLUMN IF NOT EXISTS impoundedtime INT NULL;
ALTER TABLE player_vehicles ADD COLUMN IF NOT EXISTS impoundreason VARCHAR(255) NULL;
ALTER TABLE player_vehicles ADD COLUMN IF NOT EXISTS impoundedby VARCHAR(255) NULL;
ALTER TABLE player_vehicles ADD COLUMN IF NOT EXISTS impoundtype VARCHAR(50) NULL;
ALTER TABLE player_vehicles ADD COLUMN IF NOT EXISTS impoundfee INT NULL;
ALTER TABLE player_vehicles ADD COLUMN IF NOT EXISTS impoundtime INT NULL;

-- Create shared garages tables
CREATE TABLE IF NOT EXISTS shared_garages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    owner_citizenid VARCHAR(50) NOT NULL,
    access_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shared_garage_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    garage_id INT NOT NULL,
    member_citizenid VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (garage_id) REFERENCES shared_garages(id) ON DELETE CASCADE
);

-- Create gang vehicles table to track shared gang vehicles
CREATE TABLE IF NOT EXISTS gang_vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate VARCHAR(8) NOT NULL,
    gang VARCHAR(50) NOT NULL,
    owner VARCHAR(50) NOT NULL,
    vehicle VARCHAR(50) NOT NULL,
    stored TINYINT(1) DEFAULT 1,
    UNIQUE KEY plate_gang (plate, gang)
);

-- Create job vehicles tracking table
CREATE TABLE IF NOT EXISTS job_vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate VARCHAR(8) NOT NULL,
    job VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    properties LONGTEXT NULL,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY plate (plate)
);

-- Add index for improved query performance
CREATE INDEX IF NOT EXISTS idx_player_vehicles_plate ON player_vehicles(plate);
CREATE INDEX IF NOT EXISTS idx_player_vehicles_citizenid ON player_vehicles(citizenid);
CREATE INDEX IF NOT EXISTS idx_player_vehicles_state ON player_vehicles(state);
CREATE INDEX IF NOT EXISTS idx_shared_garage_members_garage ON shared_garage_members(garage_id);
CREATE INDEX IF NOT EXISTS idx_gang_vehicles_gang ON gang_vehicles(gang);