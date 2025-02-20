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
    l.subjects
FROM
    listings l
    JOIN profiles p ON l.profile = p.id
    LEFT JOIN subjects s ON s.id = ANY(l.subjects)
WHERE
    l.visible = TRUE
    AND p.role = 'teacher'
GROUP BY
    l.id,
    p.id;
    
create or replace view "public"."student_credit_balances" WITH (security_invoker = on) as  SELECT credit_transactions.student,
    COALESCE(sum(credit_transactions.amount), (0)::real) AS balance
   FROM credit_transactions
  GROUP BY credit_transactions.student;
