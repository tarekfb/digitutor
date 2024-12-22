drop policy "Enable insert for authenticated users only" on "public"."subjects_suggestions";

create policy "Enable insert for self"
on "public"."subjects_suggestions"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = sender));


create policy "Enable read for self"
on "public"."subjects_suggestions"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = sender));



