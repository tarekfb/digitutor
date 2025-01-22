import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "src/supabase";
import { getNow } from "src/lib/shared/utils/utils";
import type { DbConversationRequestBase, DbConversationRequestWithReferences } from "src/lib/shared/models/conversation-request";
import { sendRequestMessage } from "./request-messages";

export const getConversationRequest = async (
  supabase: SupabaseClient<Database>,
  id: string,
  role: "student" | "teacher" | "admin",
  profileId: string,
): Promise<DbConversationRequestWithReferences> => {
  let query = supabase
    .from("conversation_requests")
    .select(
      `
                *,
                teacher (
                  *
                ),
                student (
                  *
                )
              `,
    )
    .eq("id", id);

  if (role === "student") query = query.eq("student", profileId);
  else if (role === "teacher") query = query.eq("teacher", profileId);

  const { data, error } = await query.limit(1).single();

  if (error) {
    console.error("Failed to get conversation request: " + id, { error });
    throw error;
  }

  return data as unknown as DbConversationRequestWithReferences;
};

export const getStudentTeacherInteraction = async (
  supabase: SupabaseClient<Database>,
  student: string,
  teacher: string,
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("all_conversatons")
    .select(
      `id`,
    )
    .eq("student", student)
    .eq("teacher", teacher)
    .limit(1)
    .single();

  return error ? null : (data as unknown as string); // error means no existing convo, return null
};

export const getConversationRequestForStudentAndTeacher = async (
  supabase: SupabaseClient<Database>,
  student: string,
  teacher: string,
): Promise<DbConversationRequestWithReferences | null> => {
  const { data, error } = await supabase
    .from("conversation_requests")
    .select(
      `
                  *,
                  teacher (
                    *
                  ),
                  student (
                    *
                  )
                `,
    )
    .eq("student", student)
    .eq("teacher", teacher)
    .limit(1)
    .single();

  return error ? null : (data as unknown as DbConversationRequestWithReferences); // error means no existing convo, return null
};

export const getConversationRequests = async (
  supabase: SupabaseClient<Database>,
  userId: string,
  max?: number,
): Promise<DbConversationRequestWithReferences[]> => {
  let query = supabase
    .from("conversation_requests")
    .select(
      `
          *,
          teacher (
            *
          ),
          student (
            *
          )
        `,
    )
    .or(`teacher.eq.${userId},student.eq.${userId}`);
  // todo rewrite this function to take teacherid or studentid, and improve this search

  if (max) query = query.limit(max);

  const { data, error } = await query;

  if (error) {
    console.error("Failed to get conversation requests for userid: " + userId, {
      error,
    });
    throw error;
  }

  return data as unknown as DbConversationRequestWithReferences[];
};

export const createConversationRequest = async (
  supabase: SupabaseClient<Database>,
  teacher: string,
  firstMessage: string,
): Promise<DbConversationRequestBase> => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    console.error("Missing session when creating conversation");
    throw new Error("No session");
  }

  const student = session.user.id;

  const dbConversationRequest: DbConversationRequestBase = {
    id: crypto.randomUUID(),
    teacher,
    student: student,
    created_at: getNow(),
    // @ts-expect-error for some reason, supabase type def doesnt use my enum
    status: "pending",
  };

  const { data, error } = await supabase
    .from("conversation_requests")
    .insert(dbConversationRequest)
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error("Failed to create conversation request: ", { error });
    throw error;
  }

  await sendRequestMessage(
    supabase,
    { content: firstMessage, conversation: data.id },
    session,
  ); // does this need to be awaited? todo: remove if not needed
  
  return data as unknown as DbConversationRequestBase;
};
