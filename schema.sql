-- Inventory management for automotive parts
CREATE TABLE IF NOT EXISTS parts (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    vehicle_make TEXT,
    vehicle_model TEXT,
    vehicle_year_start INTEGER,
    vehicle_year_end INTEGER,
    price REAL NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer requests for hard-to-find or specific parts
CREATE TABLE IF NOT EXISTS customer_requests (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    part_description TEXT NOT NULL,
    vehicle_details TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generated quotes linked to requests
CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    request_id TEXT REFERENCES customer_requests(id),
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'Draft',
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
