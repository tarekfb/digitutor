
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."role" AS ENUM (
    'student',
    'teacher',
    'admin'
);

ALTER TYPE "public"."role" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."check_conversation_reply"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Log the start of the function execution
  RAISE LOG 'Checking messages count for conversation %', NEW.conversation;

  -- Check the total count of messages for the conversation
  IF (
    SELECT COUNT(*) 
    FROM messages 
    WHERE conversation = NEW.conversation
  ) = 2 THEN
    RAISE LOG 'Conversation % has 2 messages', NEW.conversation;

    -- Check if both messages have different senders
    IF (
      SELECT COUNT(DISTINCT sender)
      FROM messages 
      WHERE conversation = NEW.conversation
    ) = 2 THEN
      RAISE LOG 'Conversation % has 2 distinct senders', NEW.conversation;

      -- Log the id being used for the update
      RAISE LOG 'Preparing to update has_replied for conversation id %', NEW.conversation;

      -- Verify the id exists in the conversations table
      IF EXISTS (
        SELECT 1 
        FROM conversations 
        WHERE id = NEW.conversation
      ) THEN
        RAISE LOG 'Conversation id % exists in the conversations table', NEW.conversation;

        -- Update the has_replied column in the conversations table
        UPDATE conversations
        SET has_replied = TRUE
        WHERE id = NEW.conversation;

        RAISE LOG 'Updated has_replied for conversation %', NEW.conversation;
      ELSE
        RAISE LOG 'Conversation id % does not exist in the conversations table', NEW.conversation;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."check_conversation_reply"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."contact_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "updated_at" timestamp with time zone,
    "first_name" "text",
    "last_name" "text",
    "email" "text",
    "phone" "text",
    "message_body" "text"
);

ALTER TABLE "public"."contact_requests" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."conversations" (
    "id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "teacher" "uuid" NOT NULL,
    "student" "uuid" NOT NULL,
    "has_replied" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."conversations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."listings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "title" "text" DEFAULT ''::"text" NOT NULL,
    "description" "text" DEFAULT ''::"text" NOT NULL,
    "subjects" smallint[] NOT NULL,
    "hourlyPrice" smallint NOT NULL,
    "currency" "text" DEFAULT 'SEK'::"text" NOT NULL,
    "profile" "uuid" NOT NULL,
    "visible" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."listings" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."messages" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sender" "uuid" NOT NULL,
    "conversation" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "id" "uuid" NOT NULL
);

ALTER TABLE "public"."messages" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "first_name" "text" NOT NULL,
    "avatar_url" "text",
    "role" "public"."role" NOT NULL,
    "last_name" "text" DEFAULT ''::"text" NOT NULL,
    "created_at" timestamp with time zone NOT NULL
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

COMMENT ON TABLE "public"."profiles" IS 'A profile with information about a user, associated to user by userId.';

CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sender" "uuid" DEFAULT "gen_random_uuid"(),
    "receiver" "uuid" NOT NULL,
    "rating" smallint NOT NULL,
    "description" "text" DEFAULT ''::"text",
    "id" "uuid" NOT NULL
);

ALTER TABLE "public"."reviews" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."stripe_customers" (
    "user_id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "stripe_customer_id" "text"
);

ALTER TABLE "public"."stripe_customers" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."subjects" (
    "id" integer NOT NULL,
    "title" "text" NOT NULL
);

ALTER TABLE "public"."subjects" OWNER TO "postgres";

ALTER TABLE ONLY "public"."contact_requests"
    ADD CONSTRAINT "contact_requests_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."stripe_customers"
    ADD CONSTRAINT "stripe_customers_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."stripe_customers"
    ADD CONSTRAINT "stripe_customers_stripe_customer_id_key" UNIQUE ("stripe_customer_id");

ALTER TABLE ONLY "public"."subjects"
    ADD CONSTRAINT "subjects_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "message_insert_trigger" AFTER INSERT ON "public"."messages" FOR EACH ROW EXECUTE FUNCTION "public"."check_conversation_reply"();

ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_student_fkey" FOREIGN KEY ("student") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_teacher_fkey" FOREIGN KEY ("teacher") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_profile_fkey" FOREIGN KEY ("profile") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_conversation_fkey" FOREIGN KEY ("conversation") REFERENCES "public"."conversations"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_fkey" FOREIGN KEY ("sender") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_sender_fkey" FOREIGN KEY ("sender") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."stripe_customers"
    ADD CONSTRAINT "stripe_customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "Enable create for users on self" ON "public"."listings" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "profile"));

CREATE POLICY "Enable delete for users on self" ON "public"."listings" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "profile"));

CREATE POLICY "Enable delete for users on self" ON "public"."profiles" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));

CREATE POLICY "Enable insert for self" ON "public"."conversations" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT ("auth"."uid"() = "conversations"."student")) AND ("student" <> "teacher")));

CREATE POLICY "Enable insert for users based on sender" ON "public"."reviews" FOR INSERT TO "authenticated" WITH CHECK ((("auth"."uid"() = "sender") AND (NOT (EXISTS ( SELECT 1
   FROM "public"."reviews" "reviews_1"
  WHERE ("reviews_1"."sender" = "auth"."uid"())))) AND (EXISTS ( SELECT 1
   FROM "public"."conversations"
  WHERE (("conversations"."student" = "reviews"."sender") AND ("conversations"."teacher" = "reviews"."receiver"))))));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."profiles" FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for users on self" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "sender"));

CREATE POLICY "Enable read access for all users" ON "public"."listings" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."profiles" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."reviews" FOR SELECT USING (true);

CREATE POLICY "Enable read for self" ON "public"."conversations" FOR SELECT TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "teacher") OR (( SELECT "auth"."uid"() AS "uid") = "student")));

CREATE POLICY "Enable read for self using conversation" ON "public"."messages" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."conversations" "c"
  WHERE (("c"."id" = "messages"."conversation") AND (("c"."student" = "auth"."uid"()) OR ("c"."teacher" = "auth"."uid"()))))));

CREATE POLICY "Enable update for users on self" ON "public"."listings" FOR UPDATE TO "authenticated" USING (( SELECT ("auth"."uid"() = "listings"."profile")));

CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id"));

ALTER TABLE "public"."contact_requests" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."conversations" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."listings" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."stripe_customers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."subjects" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."messages";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."check_conversation_reply"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_conversation_reply"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_conversation_reply"() TO "service_role";

GRANT ALL ON TABLE "public"."contact_requests" TO "anon";
GRANT ALL ON TABLE "public"."contact_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."contact_requests" TO "service_role";

GRANT ALL ON TABLE "public"."conversations" TO "anon";
GRANT ALL ON TABLE "public"."conversations" TO "authenticated";
GRANT ALL ON TABLE "public"."conversations" TO "service_role";

GRANT ALL ON TABLE "public"."listings" TO "anon";
GRANT ALL ON TABLE "public"."listings" TO "authenticated";
GRANT ALL ON TABLE "public"."listings" TO "service_role";

GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";

GRANT ALL ON TABLE "public"."stripe_customers" TO "anon";
GRANT ALL ON TABLE "public"."stripe_customers" TO "authenticated";
GRANT ALL ON TABLE "public"."stripe_customers" TO "service_role";

GRANT ALL ON TABLE "public"."subjects" TO "anon";
GRANT ALL ON TABLE "public"."subjects" TO "authenticated";
GRANT ALL ON TABLE "public"."subjects" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
