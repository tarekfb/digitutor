ALTER ROLE authenticator
SET
    pgrst.db_aggregates_enabled = 'true';

NOTIFY pgrst,
'reload config';

CREATE OR REPLACE FUNCTION get_top_teacher_by_reviews() 
RETURNS TABLE(
    id uuid, 
    first_name text, 
    last_name text, 
    avatar_url text, 
    avg_rating numeric,
    subjects smallint[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,  
        p.first_name,
        p.last_name,
        p.avatar_url,
        AVG(rv.rating) AS avg_rating,
        ARRAY_AGG(DISTINCT subject_id) AS subjects  
    FROM
        profiles p
    LEFT JOIN 
        reviews rv ON rv.receiver = p.id
    LEFT JOIN 
        listings l ON l.profile = p.id
    LEFT JOIN 
        UNNEST(l.subjects) AS subject_id ON TRUE  
    LEFT JOIN 
        subjects s ON s.id = subject_id
    WHERE
        p.role = 'teacher'  
    GROUP BY
        p.id
    ORDER BY
        avg_rating DESC;
END;
$$ LANGUAGE plpgsql;