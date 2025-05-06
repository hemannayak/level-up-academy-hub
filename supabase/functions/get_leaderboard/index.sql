
-- Create function to get leaderboard data
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  total_minutes INTEGER,
  streak_days INTEGER,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  xp_points INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(lt.id, p.id) as id,
    COALESCE(lt.user_id, p.id) as user_id,
    COALESCE(lt.total_minutes, 0) as total_minutes,
    COALESCE(lt.streak_days, 0) as streak_days,
    p.full_name,
    p.avatar_url,
    u.email,
    COALESCE(lt.total_minutes, 0) * 10 as xp_points
  FROM
    public.profiles p
  LEFT JOIN
    auth.users u ON p.id = u.id
  LEFT JOIN
    public.learning_time lt ON p.id = lt.user_id
  ORDER BY
    COALESCE(lt.total_minutes, 0) DESC,
    p.created_at ASC;
END;
$$;
