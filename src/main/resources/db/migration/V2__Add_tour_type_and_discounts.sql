-- Add tour_type, image_url, description to tours table
ALTER TABLE tours ADD COLUMN IF NOT EXISTS tour_type character varying(50) DEFAULT 'VACATION' NOT NULL;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS image_url character varying(500);
ALTER TABLE tours ADD COLUMN IF NOT EXISTS description text;

-- Add discount_percent and is_regular to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS discount_percent numeric(5, 2) DEFAULT 0.00 NOT NULL;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS is_regular boolean DEFAULT false NOT NULL;

-- Add discount_percent and total_price to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_percent numeric(5, 2) DEFAULT 0.00 NOT NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price numeric(12, 2) DEFAULT 0.00 NOT NULL;
