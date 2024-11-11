-- Drop the process_run table if it exists
DROP TABLE IF EXISTS process_run;

-- Create the process_run table
CREATE TABLE process_run (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    process_id INTEGER NOT NULL REFERENCES process(id) ON DELETE CASCADE, -- Foreign key to process
    customer_id VARCHAR(255) NOT NULL, -- Retrieved from the X-User-Buddy-Process header
    status VARCHAR(50) NOT NULL, -- Status of the process run, e.g., 'started', 'completed', 'failed'
    result JSON, -- Optional JSON data for the result of the run
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP -- Nullable, records when the run is completed
);

-- Add indexes for optimized access
CREATE INDEX idx_process_run_process_id ON process_run (process_id);
CREATE INDEX idx_process_run_customer_id ON process_run (customer_id);
CREATE INDEX idx_process_run_started_at ON process_run (started_at);
