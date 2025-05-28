-- Create daily_stats table
CREATE TABLE IF NOT EXISTS daily_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    active_users INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    new_subscriptions INTEGER DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one record per date
    CONSTRAINT unique_daily_stats_date UNIQUE (date)
);

-- Create tool_usage table
CREATE TABLE IF NOT EXISTS tool_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    tool_name TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one record per tool per date
    CONSTRAINT unique_tool_usage_date UNIQUE (date, tool_name)
);

-- Add RLS policies
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users
CREATE POLICY "Allow read access for authenticated users on daily_stats"
    ON daily_stats FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow read access for authenticated users on tool_usage"
    ON tool_usage FOR SELECT
    TO authenticated
    USING (true);

-- Allow insert/update access for service role only
CREATE POLICY "Allow insert/update for service role on daily_stats"
    ON daily_stats FOR ALL
    TO service_role
    USING (true);

CREATE POLICY "Allow insert/update for service role on tool_usage"
    ON tool_usage FOR ALL
    TO service_role
    USING (true);
