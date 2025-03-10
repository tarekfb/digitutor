DROP FUNCTION IF EXISTS public.compound_search(searchable_listings);
DROP VIEW IF EXISTS public.searchable_listings;

CREATE
OR REPLACE VIEW public.searchable_listings AS
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

CREATE OR REPLACE FUNCTION public.compound_search(sl searchable_listings)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE AS $function$
DECLARE
  subject_names TEXT;
BEGIN
  -- Get subject names for the listing
  SELECT string_agg(s.title, ' ')
  INTO subject_names
  FROM subjects s
  WHERE s.id = ANY((sl).subjects);

  -- Construct the searchable text string using column positions
  -- Note: Column positions based on the view definition:
  -- first_name is column 8, title is column 2, 
  -- description is column 3, hourly_price is column 4, subjects is column 15
  RETURN (sl).first_name || ' ' ||
         COALESCE((sl).title, '') || ' ' ||
         COALESCE((sl).description, '') || ' ' ||
         COALESCE((sl).hourly_price::TEXT, '') || ' ' ||
         COALESCE(subject_names, '');
END;
$function$;