alter table "public"."conversation_requests" drop constraint "public_conversation_requests_student_id_fkey";

alter table "public"."conversation_requests" drop constraint "public_conversation_requests_teacher_id_fkey";

alter table "public"."conversation_requests" drop column "student_id";

alter table "public"."conversation_requests" drop column "teacher_id";

alter table "public"."conversation_requests" add column "student" uuid not null;

alter table "public"."conversation_requests" add column "teacher" uuid not null;

alter table "public"."conversation_requests" add constraint "public_conversation_requests_student_id_fkey" FOREIGN KEY (student) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."conversation_requests" validate constraint "public_conversation_requests_student_id_fkey";

alter table "public"."conversation_requests" add constraint "public_conversation_requests_teacher_id_fkey" FOREIGN KEY (teacher) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."conversation_requests" validate constraint "public_conversation_requests_teacher_id_fkey";

create policy "Enable insert for self"
on "public"."conversation_requests"
as permissive
for insert
to authenticated
with check ((( SELECT (auth.uid() = conversation_requests.student)) AND (student <> teacher)));


create policy "Enable read for self"
on "public"."conversation_requests"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = teacher) OR (( SELECT auth.uid() AS uid) = student)));


create policy "Enable insert for self"
on "public"."request_messages"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = sender));


create policy "Enable read for self using conversation"
on "public"."request_messages"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM conversations c
  WHERE ((c.id = request_messages.conversation_request) AND ((c.student = auth.uid()) OR (c.teacher = auth.uid()))))));



