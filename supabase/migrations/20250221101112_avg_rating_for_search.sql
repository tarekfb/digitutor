CREATE
OR REPLACE VIEW public.searchable_listings
WITH (security_invoker = on) AS
SELECT
    l.id,
    l.title,
    l.description,
    l.hourly_price,
    l.created_at,
    l.updated_at,
    l.profile as profile_id,
    p.first_name,
    p.avatar_url,
    p.role,
    p.bio,
    p.created_at as profile_created_at,
    p.updated_at as profile_updated_at,
    l.subjects,
    ar.avg_rating,
    ar.review_count
FROM
    listings l
    JOIN profiles p ON l.profile = p.id
    LEFT JOIN subjects s ON s.id = ANY(l.subjects)
    LEFT JOIN avg_rating ar ON ar.id = p.id
WHERE
        l.visible = TRUE
    AND p.role = 'teacher'
