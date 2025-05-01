
-- Create function to get leaderboard data
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  total_minutes INTEGER,
  streak_days INTEGER,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    lt.id,
    lt.user_id,
    lt.total_minutes,
    lt.streak_days,
    p.full_name,
    p.avatar_url,
    u.email
  FROM
    public.learning_time lt
  JOIN
    auth.users u ON lt.user_id = u.id
  LEFT JOIN
    public.profiles p ON lt.user_id = p.id
  ORDER BY
    lt.total_minutes DESC
  LIMIT 100;
END;
$$;
