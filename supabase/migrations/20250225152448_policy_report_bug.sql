create policy "Enable insert access for all users"
on "public"."bug_report"
as permissive
for insert
to public
with check (true);



