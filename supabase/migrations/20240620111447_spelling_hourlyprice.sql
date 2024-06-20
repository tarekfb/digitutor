alter table "public"."listings" drop column "hourlyPrice";

alter table "public"."listings" add column "hourly_price" smallint not null;
