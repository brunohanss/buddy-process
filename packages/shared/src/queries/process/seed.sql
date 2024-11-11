-- Drop the process table if it already exists
DROP TABLE IF EXISTS process;

-- Create the process table
CREATE TABLE process (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    node_data JSON NOT NULL, -- Stores JSON data for nodes
    edge_data JSON NOT NULL, -- Stores JSON data for edges
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for optimized access
CREATE INDEX idx_process_created_at ON process (created_at);
