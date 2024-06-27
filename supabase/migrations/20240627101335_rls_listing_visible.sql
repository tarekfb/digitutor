drop policy "Enable read access for all users" on "public"."listings";

alter table "public"."stripe_customers" drop column "testr";

alter table "public"."stripe_customers" add column "test" text default 'test'::text;

create policy "Enable read depending on visible"
on "public"."listings"
as permissive
for select
to public
using (((visible = true) OR ( SELECT (auth.uid() = listings.profile))));



