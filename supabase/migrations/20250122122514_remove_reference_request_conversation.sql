alter table "public"."conversation_requests" drop column "messages";

alter table "public"."request_messages" alter column "id" set default gen_random_uuid();

alter table "public"."request_messages" alter column "id" drop identity;

alter table "public"."request_messages" alter column "id" set data type uuid using "id"::uuid;


