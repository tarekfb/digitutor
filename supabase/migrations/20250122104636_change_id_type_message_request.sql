alter table "public"."request_messages" drop constraint "request_messages_pkey";

drop index if exists "public"."request_messages_pkey";

alter table "public"."request_messages" alter column "id" drop identity;

alter table "public"."request_messages" alter column "id" set data type uuid using "id"::uuid;


