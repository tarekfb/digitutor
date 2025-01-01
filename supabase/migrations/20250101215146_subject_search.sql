set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.compound_search(listing record)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
DECLARE
  profile_first_name TEXT;
  profile_last_name TEXT;
  profile_role TEXT;
  listing_title TEXT;
  listing_description TEXT;
  listing_hourly_price INT;
  subject_names TEXT;
BEGIN
  -- Initialize listing fields to default values
  listing_title := '';
  listing_description := '';
  listing_hourly_price := 0;
  subject_names := '';

  -- Retrieve the profile information
  SELECT p.first_name, p.last_name, p.role
  INTO profile_first_name, profile_last_name, profile_role
  FROM profiles p
  WHERE p.id = listing.profile;

  -- Retrieve the title, description, and hourly_price from the listings table for visible listings
  SELECT l.title, l.description, l.hourly_price 
  INTO listing_title, listing_description, listing_hourly_price
  FROM listings l
  WHERE l.id = listing.id AND l.visible = TRUE;

  -- Get subject names for the listing
  SELECT string_agg(s.title, ' ')
  INTO subject_names
  FROM subjects s
  WHERE s.id = ANY(listing.subjects);

  -- Check if the role is 'teacher' and if the listing is visible
  IF profile_role = 'teacher' AND listing_title IS NOT NULL THEN
    RETURN profile_first_name || ' ' || profile_last_name || ' ' ||
           COALESCE(listing_title, '') || ' ' || 
           COALESCE(listing_description, '') || ' ' ||
           COALESCE(listing_hourly_price::TEXT, '') || ' ' ||
           COALESCE(subject_names, '');
  ELSE
    RETURN NULL; -- or you can return '' for an empty string
  END IF;
END;
$function$
;


