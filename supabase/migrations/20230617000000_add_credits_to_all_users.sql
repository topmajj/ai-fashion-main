-- Create a function to add credits to all users
CREATE OR REPLACE FUNCTION add_credits_to_all_users(credit_amount INT)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET credits = credits + credit_amount;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to add 50 credits to all users
SELECT add_credits_to_all_users(50);
