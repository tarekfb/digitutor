create type "public"."request_status" as enum ('accepted', 'rejected', 'pending', 'invalid');

create table "public"."conversation_requests" (
    "student_id" uuid not null,
    "teacher_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "messages" uuid[] not null,
    "status" request_status not null,
    "id" uuid not null
);


alter table "public"."conversation_requests" enable row level security;

create table "public"."request_messages" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "sender" uuid not null,
    "conversation_request" uuid not null,
    "content" text not null
);


alter table "public"."request_messages" enable row level security;

CREATE UNIQUE INDEX conversation_requests_pkey ON public.conversation_requests USING btree (id);

CREATE UNIQUE INDEX request_messages_pkey ON public.request_messages USING btree (id);

alter table "public"."conversation_requests" add constraint "conversation_requests_pkey" PRIMARY KEY using index "conversation_requests_pkey";

alter table "public"."request_messages" add constraint "request_messages_pkey" PRIMARY KEY using index "request_messages_pkey";

alter table "public"."conversation_requests" add constraint "public_conversation_requests_student_id_fkey" FOREIGN KEY (student_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."conversation_requests" validate constraint "public_conversation_requests_student_id_fkey";

alter table "public"."conversation_requests" add constraint "public_conversation_requests_teacher_id_fkey" FOREIGN KEY (teacher_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."conversation_requests" validate constraint "public_conversation_requests_teacher_id_fkey";

alter table "public"."request_messages" add constraint "public_request_messages_conversation_request_fkey" FOREIGN KEY (conversation_request) REFERENCES conversation_requests(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."request_messages" validate constraint "public_request_messages_conversation_request_fkey";

grant delete on table "public"."conversation_requests" to "anon";

grant insert on table "public"."conversation_requests" to "anon";

grant references on table "public"."conversation_requests" to "anon";

grant select on table "public"."conversation_requests" to "anon";

grant trigger on table "public"."conversation_requests" to "anon";

grant truncate on table "public"."conversation_requests" to "anon";

grant update on table "public"."conversation_requests" to "anon";

grant delete on table "public"."conversation_requests" to "authenticated";

grant insert on table "public"."conversation_requests" to "authenticated";

grant references on table "public"."conversation_requests" to "authenticated";

grant select on table "public"."conversation_requests" to "authenticated";

grant trigger on table "public"."conversation_requests" to "authenticated";

grant truncate on table "public"."conversation_requests" to "authenticated";

grant update on table "public"."conversation_requests" to "authenticated";

grant delete on table "public"."conversation_requests" to "service_role";

grant insert on table "public"."conversation_requests" to "service_role";

grant references on table "public"."conversation_requests" to "service_role";

grant select on table "public"."conversation_requests" to "service_role";

grant trigger on table "public"."conversation_requests" to "service_role";

grant truncate on table "public"."conversation_requests" to "service_role";

grant update on table "public"."conversation_requests" to "service_role";

grant delete on table "public"."request_messages" to "anon";

grant insert on table "public"."request_messages" to "anon";

grant references on table "public"."request_messages" to "anon";

grant select on table "public"."request_messages" to "anon";

grant trigger on table "public"."request_messages" to "anon";

grant truncate on table "public"."request_messages" to "anon";

grant update on table "public"."request_messages" to "anon";

grant delete on table "public"."request_messages" to "authenticated";

grant insert on table "public"."request_messages" to "authenticated";

grant references on table "public"."request_messages" to "authenticated";

grant select on table "public"."request_messages" to "authenticated";

grant trigger on table "public"."request_messages" to "authenticated";

grant truncate on table "public"."request_messages" to "authenticated";

grant update on table "public"."request_messages" to "authenticated";

grant delete on table "public"."request_messages" to "service_role";

grant insert on table "public"."request_messages" to "service_role";

grant references on table "public"."request_messages" to "service_role";

grant select on table "public"."request_messages" to "service_role";

grant trigger on table "public"."request_messages" to "service_role";

grant truncate on table "public"."request_messages" to "service_role";

grant update on table "public"."request_messages" to "service_role";


