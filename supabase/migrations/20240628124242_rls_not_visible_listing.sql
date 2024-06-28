drop policy "Enable read depending on visible" on "public"."listings";

create policy "Enable read depending on visible"
on "public"."listings"
as permissive
for select
to authenticated, anon
using (((visible = true) OR ((visible = false) AND (( SELECT auth.uid() AS uid) = profile))));



