-- Drop the customer_integration table if it exists
DROP TABLE IF EXISTS customer_integration;

-- Create the customer_integration table
CREATE TABLE customer_integration (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id VARCHAR(255) NOT NULL,
    base_integration_id INTEGER NOT NULL REFERENCES base_integration(id) ON DELETE CASCADE,
    credentials JSON NOT NULL, -- Stores customer-specific credentials as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for optimized access
CREATE INDEX idx_customer_integration_base_integration_id ON customer_integration (base_integration_id);
CREATE INDEX idx_customer_integration_created_at ON customer_integration (created_at);
