-- MotorCore Parts Database Schema

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
    image_url TEXT,
    condition TEXT DEFAULT 'New',
    availability TEXT DEFAULT 'In Stock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_requests (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    location TEXT,
    delivery_preference TEXT,
    part_description TEXT NOT NULL,
    vehicle_details TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Sample Initial Inventory for Ford, Chevrolet, and Toyota
INSERT INTO parts (id, sku, name, category, vehicle_make, vehicle_model, vehicle_year_start, vehicle_year_end, price, stock_quantity, image_url, condition, availability) VALUES
('part_1', 'BR-FORD-150', 'Front Ceramic Brake Pads', 'Brakes', 'Ford', 'F-150', 2015, 2020, 45.99, 10, 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80', 'New', 'In Stock'),
('part_2', 'ALT-CHEV-SIL', 'High-Output Alternator', 'Electrical', 'Chevrolet', 'Silverado', 2014, 2018, 189.50, 4, 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80', 'New', 'In Stock'),
('part_3', 'SUS-TOY-CAM', 'Front Suspension Strut Assembly', 'Suspension', 'Toyota', 'Camry', 2012, 2017, 95.00, 7, 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80', 'New', 'In Stock');
