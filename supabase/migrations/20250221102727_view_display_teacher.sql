CREATE OR REPLACE VIEW public.teacher_subjects AS
SELECT 
    p.id AS teacher_id,
    p.first_name,
    p.created_at,
    p.updated_at,
    p.avatar_url,
    p.bio,
    p.role,
    COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', s.id,
            'alt_title', s.alt_title,
            'title', s.title
        ) 
        ORDER BY s.title
    ), '[]') AS subjects
FROM 
    profiles p
    LEFT JOIN listings l ON l.profile = p.id
    LEFT JOIN subjects s ON s.id = ANY(l.subjects)
WHERE 
    p.role = 'teacher'
GROUP BY 
    p.id,
    p.first_name,
    p.created_at,
    p.updated_at,
    p.avatar_url,
    p.bio,
    p.role;

CREATE OR REPLACE VIEW public.top_rated_teachers
WITH (security_invoker = on) AS
SELECT 
    p.id,
    p.first_name,
    p.avatar_url,
    COALESCE(ar.avg_rating, 0) AS avg_rating,
    COALESCE(ar.review_count, 0) AS review_count,
    COUNT(CASE 
        WHEN rv.rating = 5 AND rv.description IS NOT NULL 
        THEN 1 
    END) AS five_star_reviews_with_description,
    ts.subjects
FROM 
    profiles p
    LEFT JOIN avg_rating ar ON ar.id = p.id
    LEFT JOIN reviews rv ON rv.receiver = p.id
    LEFT JOIN teacher_subjects ts ON ts.teacher_id = p.id
WHERE 
    p.role = 'teacher'
GROUP BY 
    p.id,
    p.first_name,
    p.avatar_url,
    ar.avg_rating,
    ar.review_count,
    ts.subjects
ORDER BY 
    five_star_reviews_with_description DESC;