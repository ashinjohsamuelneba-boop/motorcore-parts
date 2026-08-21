-- Makes Table
CREATE TABLE IF NOT EXISTS makes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

-- Parts / Inventory Table
CREATE TABLE IF NOT EXISTS parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    part_number TEXT,
    stock_number TEXT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    make_id INTEGER,
    model TEXT NOT NULL,
    year_start INTEGER NOT NULL,
    year_end INTEGER NOT NULL,
    engine TEXT,
    trim TEXT,
    category_id INTEGER,
    condition TEXT CHECK(condition IN ('New', 'Used', 'Refurbished', 'Rebuilt')),
    mileage_hours TEXT,
    price REAL,
    display_price_as_request INTEGER DEFAULT 0, -- 1 = Show "Request Price", 0 = Show Price
    availability TEXT DEFAULT 'In Stock',
    location TEXT,
    description TEXT,
    compatibility_notes TEXT,
    images TEXT, -- JSON array of image URLs
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (make_id) REFERENCES makes(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    part_id INTEGER, -- NULL for general "Request a Part" requests
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    vehicle_year INTEGER,
    vehicle_make TEXT,
    vehicle_model TEXT,
    part_requested TEXT,
    zip_code TEXT,
    preferred_contact TEXT,
    message TEXT,
    status TEXT DEFAULT 'New', -- New, Contacted, Payment Pending, Sold/Completed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (part_id) REFERENCES parts(id)
);

-- Seed Initial Makes
INSERT OR IGNORE INTO makes (name, slug) VALUES 
('Ford', 'ford'), ('Chevrolet', 'chevrolet'), ('Toyota', 'toyota'), 
('Honda', 'honda'), ('Nissan', 'nissan'), ('Dodge', 'dodge'), 
('Jeep', 'jeep'), ('GMC', 'gmc'), ('RAM', 'ram'), 
('Hyundai', 'hyundai'), ('Kia', 'kia'), ('Lexus', 'lexus'), 
('BMW', 'bmw'), ('Mercedes-Benz', 'mercedes-benz'), ('Other Makes', 'other-makes');

-- Seed Initial Categories
INSERT OR IGNORE INTO categories (name, slug) VALUES 
('Engines', 'engines'), ('Transmissions', 'transmissions'), 
('Transfer Cases', 'transfer-cases'), ('Differentials', 'differentials'), 
('Drivetrain', 'drivetrain'), ('Suspension', 'suspension'), 
('Steering', 'steering'), ('Brakes', 'brakes'), 
('Wheels & Tires', 'wheels-tires'), ('Body Parts', 'body-parts'), 
('Bumpers', 'bumpers'), ('Fenders', 'fenders'), ('Hoods', 'hoods'), 
('Doors', 'doors'), ('Tailgates', 'tailgates'), ('Grilles', 'grilles'), 
('Headlights', 'headlights'), ('Taillights', 'taillights'), 
('Mirrors', 'mirrors'), ('Electrical Parts', 'electrical-parts'), 
('Alternators', 'alternators'), ('Starters', 'starters'), 
('AC/Heating', 'ac-heating'), ('Interior Parts', 'interior-parts'), 
('Seats', 'seats'), ('Dashboards', 'dashboards'), 
('Consoles', 'consoles'), ('Accessories', 'accessories'), ('Other Parts', 'other-parts');
