create table "public"."bug_report" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "description" text,
    "tracking_id" uuid
);


alter table "public"."bug_report" enable row level security;

CREATE UNIQUE INDEX bug_report_pkey ON public.bug_report USING btree (id);

alter table "public"."bug_report" add constraint "bug_report_pkey" PRIMARY KEY using index "bug_report_pkey";

grant delete on table "public"."bug_report" to "anon";

grant insert on table "public"."bug_report" to "anon";

grant references on table "public"."bug_report" to "anon";

grant select on table "public"."bug_report" to "anon";

grant trigger on table "public"."bug_report" to "anon";

grant truncate on table "public"."bug_report" to "anon";

grant update on table "public"."bug_report" to "anon";

grant delete on table "public"."bug_report" to "authenticated";

grant insert on table "public"."bug_report" to "authenticated";

grant references on table "public"."bug_report" to "authenticated";

grant select on table "public"."bug_report" to "authenticated";

grant trigger on table "public"."bug_report" to "authenticated";

grant truncate on table "public"."bug_report" to "authenticated";

grant update on table "public"."bug_report" to "authenticated";

grant delete on table "public"."bug_report" to "service_role";

grant insert on table "public"."bug_report" to "service_role";

grant references on table "public"."bug_report" to "service_role";

grant select on table "public"."bug_report" to "service_role";

grant trigger on table "public"."bug_report" to "service_role";

grant truncate on table "public"."bug_report" to "service_role";

grant update on table "public"."bug_report" to "service_role";


