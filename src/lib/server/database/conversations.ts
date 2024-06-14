import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "src/supabase"
import type { Conversation, InputMessage } from "src/lib/models/conversations";
import { getNow } from "src/lib/utils";
import { sendMessage } from "./messages";

export const getConversation = async (
  supabase: SupabaseClient<Database>,
  id: string
): Promise<Conversation> => {
  const { data, error } = await supabase
    .from("conversations")
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
    .eq("id", id)
    .limit(1)
    .single();

  if (error) {
    console.error("Failed to get conversation: " + id, { error });
    throw error;
  }

  return data as unknown as Conversation;
}

export const getConversationForStudentAndTeacher = async (
  supabase: SupabaseClient<Database>,
  student: string,
  teacher: string
): Promise<Conversation | null> => {
  const { data, error } = await supabase
    .from("conversations")
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

  return error ? null : data as unknown as Conversation; // error means no existing convo, return null
}

export const startConversation = async (
  supabase: SupabaseClient<Database>,
  teacher: string,
  student: string,
  firstMessage: string,
): Promise<Conversation> => {
  const { data, error } = await supabase
    .from("conversations")
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

  if (error) {
    console.error(`Failed to get conversation for studentid ${student} and teacherid ${teacher}`, { error });
    throw error;
  }

  if (!data) {
    console.error(`Failed to get conversation for studentid ${student} and teacherid ${teacher}`, { data, error });
    throw new Error("Unexpected null response");
  }

  if (data.length === 0) { // no existing convo, create new
    const newConversation = await createConversation(supabase, teacher);
    await sendMessage(supabase, { content: firstMessage, conversation: newConversation.id }); // does this need to be awaited? todo: remove if not needed
    return newConversation as unknown as Conversation;
  }

  throw new Error("A conversation already exists for this student and teacher");
}

export const getConversations = async (
  supabase: SupabaseClient<Database>,
  userId: string,
  max?: number,
): Promise<Conversation[]> => {
  let query = supabase
    .from("conversations")
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
    .or(`teacher.eq.${userId},student.eq.${userId}`)
  // todo rewrite this function to take teacherid or studentid, and improve this search

  if (max) query = query.limit(max);

  const { data, error } = await query;

  if (error) {
    console.error("Failed to get conversations for userid: " + userId, { error });
    throw error;
  }

  return data as unknown as Conversation[];
}

export const createConversation = async (
  supabase: SupabaseClient<Database>,
  teacher: string,
): Promise<Tables<"conversations">> => {
  const session = await supabase.auth.getSession();

  if (!session.data.session) {
    console.error("Missing session when creating conversation");
    throw new Error("No session");
  }

  const student = session.data.session.user.id;

  const dbConversation: Tables<"conversations"> = {
    id: crypto.randomUUID(),
    teacher,
    student: student,
    created_at: getNow(),
  };

  const { data, error } = await supabase
    .from("conversations")
    .insert(dbConversation)
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error("Failed to create conversation: ", { error });
    throw error;
  }

  if (!data) {
    console.error("Failed to create conversation. Response was null.");
    throw new Error("Unexpected null response");
  }

  return data;
};

