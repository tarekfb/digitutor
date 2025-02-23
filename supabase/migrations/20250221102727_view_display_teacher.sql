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
WITH teacher_reviews AS (
    SELECT 
        rv.id as review_id,
        rv.description as review_description,
        rv.sender,
        rv.receiver,
        rv.rating,
        rv.created_at,
        -- Sender profile fields
        p_sender.first_name as sender_first_name,
        p_sender.avatar_url as sender_avatar_url,
        p_sender.bio as sender_bio,
        p_sender.created_at as sender_created_at,
        p_sender.role as sender_role,
        p_sender.updated_at as sender_updated_at,
        -- Receiver profile fields
        p_receiver.first_name as receiver_first_name,
        p_receiver.avatar_url as receiver_avatar_url,
        p_receiver.bio as receiver_bio,
        p_receiver.created_at as receiver_created_at,
        p_receiver.role as receiver_role,
        p_receiver.updated_at as receiver_updated_at
    FROM reviews rv
    JOIN profiles p_sender ON p_sender.id = rv.sender
    JOIN profiles p_receiver ON p_receiver.id = rv.receiver
)
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
    ts.subjects,
    JSONB_AGG(
        JSONB_BUILD_OBJECT(
            'review_id', tr.review_id,
            'description', tr.review_description,
            'sender', JSONB_BUILD_OBJECT(
                'id', tr.sender,
                'first_name', tr.sender_first_name,
                'avatar_url', tr.sender_avatar_url,
                'bio', tr.sender_bio,
                'created_at', tr.sender_created_at,
                'role', tr.sender_role,
                'updated_at', tr.sender_updated_at
            ),
            'receiver', JSONB_BUILD_OBJECT(
                'id', tr.receiver,
                'first_name', tr.receiver_first_name,
                'avatar_url', tr.receiver_avatar_url,
                'bio', tr.receiver_bio,
                'created_at', tr.receiver_created_at,
                'role', tr.receiver_role,
                'updated_at', tr.receiver_updated_at
            ),
            'rating', tr.rating,
            'created_at', tr.created_at
        ) ORDER BY tr.created_at DESC
    ) FILTER (WHERE tr.review_id IS NOT NULL) AS reviews
FROM 
    profiles p
    LEFT JOIN avg_rating ar ON ar.id = p.id
    LEFT JOIN reviews rv ON rv.receiver = p.id
    LEFT JOIN teacher_subjects ts ON ts.teacher_id = p.id
    LEFT JOIN teacher_reviews tr ON tr.receiver = p.id
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