-- Function to populate daily_stats from existing data
CREATE OR REPLACE FUNCTION populate_daily_stats() RETURNS void AS $$
BEGIN
  INSERT INTO daily_stats (date, active_users, revenue, new_subscriptions, avg_session_duration)
  SELECT 
    date_trunc('day', created_at)::date as date,
    COUNT(DISTINCT user_id) as active_users,
    COALESCE(SUM(amount), 0) as revenue,
    COUNT(CASE WHEN type = 'subscription' THEN 1 END) as new_subscriptions,
    COALESCE(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))), 0) as avg_session_duration
  FROM transactions
  GROUP BY date_trunc('day', created_at)::date
  ON CONFLICT (date) 
  DO UPDATE SET
    active_users = EXCLUDED.active_users,
    revenue = EXCLUDED.revenue,
    new_subscriptions = EXCLUDED.new_subscriptions,
    avg_session_duration = EXCLUDED.avg_session_duration;
END;
$$ LANGUAGE plpgsql;

-- Function to populate tool_usage from existing data
CREATE OR REPLACE FUNCTION populate_tool_usage() RETURNS void AS $$
BEGIN
  INSERT INTO tool_usage (date, tool_name, usage_count)
  SELECT 
    date_trunc('day', created_at)::date as date,
    type as tool_name,
    COUNT(*) as usage_count
  FROM generated_images
  GROUP BY date_trunc('day', created_at)::date, type
  ON CONFLICT (date, tool_name) 
  DO UPDATE SET
    usage_count = EXCLUDED.usage_count;
END;
$$ LANGUAGE plpgsql;
