CREATE OR REPLACE VIEW avg_rating
WITH (security_invoker = on) AS
SELECT
    p.id,
    p.first_name,
    p.avatar_url,
    p.created_at,
    p.updated_at,
    COALESCE(ROUND(AVG(rv.rating), 1), 0) AS avg_rating,
    COALESCE(COUNT(rv.id), 0) AS review_count
FROM
    profiles p
LEFT JOIN 
    reviews rv ON rv.receiver = p.id
WHERE
    p.role = 'teacher'
GROUP BY
    p.id, p.first_name, p.avatar_url, p.created_at, p.updated_at;