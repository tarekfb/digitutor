ALTER ROLE authenticator
SET
    pgrst.db_aggregates_enabled = 'true';

NOTIFY pgrst,
'reload config';

CREATE OR REPLACE FUNCTION get_top_teacher_by_reviews() 
RETURNS TABLE(id uuid, first_name text, last_name text, avatar_url text, avg_rating numeric) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id,  -- Assuming this is the receiver ID
        r.first_name,
        r.last_name,
        r.avatar_url,
        AVG(rv.rating) AS avg_rating
    FROM
        profiles r
    LEFT JOIN 
        reviews rv ON rv.receiver = r.id
    WHERE
        r.role = 'teacher'  -- Ensure we are only selecting teachers
    GROUP BY
        r.id
    ORDER BY
        avg_rating DESC;
END;
$$ LANGUAGE plpgsql;