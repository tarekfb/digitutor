create sequence "public"."subjects_id_seq";

alter table "public"."subjects" add column "alt_title" character varying(255);

alter table "public"."subjects" add column "created_at" timestamp with time zone default now();

alter table "public"."subjects" add column "updated_at" timestamp with time zone default now();

alter table "public"."subjects" alter column "id" set default nextval('subjects_id_seq'::regclass);

alter table "public"."subjects" alter column "title" set data type character varying(255) using "title"::character varying(255);

alter sequence "public"."subjects_id_seq" owned by "public"."subjects"."id";

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
BEGIN
  -- Initialize listing fields to default values
  listing_title := '';
  listing_description := '';
  listing_hourly_price := 0;

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

  -- Check if the role is 'teacher' and if the listing is visible
  IF profile_role = 'teacher' AND listing_title IS NOT NULL THEN
    RETURN profile_first_name || ' ' || profile_last_name || ' ' ||
           COALESCE(listing_title, '') || ' ' || 
           COALESCE(listing_description, '') || ' ' ||
           COALESCE(listing_hourly_price::TEXT, '');
  ELSE
    RETURN NULL; -- or you can return '' for an empty string
  END IF;
END;
$function$
;

create policy "Enable read access for all users"
on "public"."subjects"
as permissive
for select
to public
using (true);

INSERT INTO public.subjects (title, alt_title, created_at)
VALUES 
  ('JavaScript', 'JS', now()),
  ('Typescript', 'TS', now()),
  ('Python', '', now()),
  ('Java', '', now()),
  ('C#', '', now()),
  ('C++', 'CPlusPlus', now()),
  ('Ruby', '', now()),
  ('Swift', '', now()),
  ('Go', '', now()),
  ('PHP', '', now()),
  ('HTML', '', now()),
  ('CSS', '', now()),
  ('React.JS', 'React', now()),
  ('Angular.JS', 'Angular', now()),
  ('Vue.JS', 'Vue', now()),
  ('Node.JS', 'Node', now()),
  ('Django', '', now()),
  ('Flask', '', now()),
  ('Spring', '', now()),
  ('dotNet', '.Net', now()),
  ('Laravel', '', now()),
  ('Rust', '', now()),
  ('Kotlin', '', now()),
  ('Scala', '', now()),
  ('Perl', '', now()),
  ('MATLAB', '', now()),
  ('R', '', now()),
  ('Elixir', '', now()),
  ('Svelte', '', now()),
  ('Ember.JS', 'Ember', now()),
  ('Backbone.JS', 'Backbone', now()),
  ('jQuery', '', now()),
  ('Bootstrap', '', now()),
  ('Tailwind CSS', 'Tailwind', now()),
  ('GraphQL', 'GQL', now()),
  ('Redux', '', now()),
  ('Electron', '', now()),
  ('TensorFlow', 'TF', now()),
  ('PyTorch', '', now()),
  ('FastAPI', '', now()),
  ('Express', '', now()),
  ('Flutter', '', now()),
  ('Apache Spark', 'Spark', now()),
  ('Hadoop', '', now()),
  ('Terraform', '', now()),
  ('Ansible', '', now()),
  ('Puppet', '', now()),
  ('Kubernetes', 'K8s', now()),
  ('Docker', '', now()),
  ('Redis', '', now()),
  ('MongoDB', '', now()),
  ('SQL', '', now()),
  ('PostgreSQL', 'Postgres', now()),
  ('MySQL', '', now()),
  ('Oracle', '', now()),
  ('SQLite', '', now());
