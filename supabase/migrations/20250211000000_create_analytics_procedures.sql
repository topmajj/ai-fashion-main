-- Create procedure to increment daily stats
CREATE OR REPLACE FUNCTION increment_daily_stats(
  p_date DATE,
  p_active_users INT,
  p_revenue DECIMAL,
  p_new_subscriptions INT,
  p_session_duration INT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO daily_stats (date, active_users, revenue, new_subscriptions, avg_session_duration)
  VALUES (p_date, p_active_users, p_revenue, p_new_subscriptions, p_session_duration)
  ON CONFLICT (date)
  DO UPDATE SET
    active_users = daily_stats.active_users + p_active_users,
    revenue = daily_stats.revenue + p_revenue,
    new_subscriptions = daily_stats.new_subscriptions + p_new_subscriptions,
    avg_session_duration = (daily_stats.avg_session_duration * daily_stats.active_users + p_session_duration) / (daily_stats.active_users + 1);
END;
$$ LANGUAGE plpgsql;

-- Create procedure to increment tool usage
CREATE OR REPLACE FUNCTION increment_tool_usage(
  p_date DATE,
  p_tool_name TEXT,
  p_usage_count INT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO tool_usage (date, tool_name, usage_count)
  VALUES (p_date, p_tool_name, p_usage_count)
  ON CONFLICT (date, tool_name)
  DO UPDATE SET
    usage_count = tool_usage.usage_count + p_usage_count;
END;
$$ LANGUAGE plpgsql;
