UPDATE "public"."subjects"
SET "alt_title" = CASE "title"
    WHEN 'PostgreSQL' THEN 'Psql'
    WHEN 'C#' THEN 'CSharp'
    WHEN 'SQL' THEN 'Sequel'
    ELSE "alt_title" -- Keep existing alt_title for other titles
END
WHERE "title" IN ('PostgreSQL', 'C#', 'SQL');

CREATE OR REPLACE FUNCTION public.compound_search(sl searchable_listings)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE AS $function$
DECLARE
  subject_names TEXT;
BEGIN
  -- Get subject names for the listing, including both title and alt_title
  SELECT string_agg(COALESCE(s.title, '') || ' ' || COALESCE(s.alt_title, ''), ' ')
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