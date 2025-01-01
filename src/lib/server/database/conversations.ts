import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "src/supabase";
import type { DbConversationWithReferences } from "$lib/shared/models/conversation";
import { getNow } from "src/lib/shared/utils/utils";
import { sendMessage } from "./messages";
import { ResourceAlreadyExistsError } from "src/lib/shared/errors/resource-already-exists-error";

export const getConversation = async (
  supabase: SupabaseClient<Database>,
  id: string,
  role: "student" | "teacher" | "admin",
  profileId: string,
): Promise<DbConversationWithReferences> => {
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
    .eq("id", id);

  if (role === "student") query = query.eq("student", profileId);
  else if (role === "teacher") query = query.eq("teacher", profileId);

  const { data, error } = await query.limit(1).single();

  if (error) {
    console.error("Failed to get conversation: " + id, { error });
    throw error;
  }

  return data as unknown as DbConversationWithReferences;
};

export const getConversationForStudentAndTeacher = async (
  supabase: SupabaseClient<Database>,
  student: string,
  teacher: string,
): Promise<DbConversationWithReferences | null> => {
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

  return error ? null : (data as unknown as DbConversationWithReferences); // error means no existing convo, return null
};

export const startConversation = async (
  supabase: SupabaseClient<Database>,
  teacher: string,
  student: string,
  firstMessage: string,
  session: Session,
): Promise<DbConversationWithReferences> => {
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
    .limit(1);

  if (error) {
    console.error(
      `Failed to get conversation for studentid ${student} and teacherid ${teacher}`,
      { error },
    );
    throw error;
  }

  if (!data) {
    console.error(
      `Failed to get conversation for studentid ${student} and teacherid ${teacher}`,
      { data, error },
    );
    throw new Error("Unexpected null response");
  }

  if (data.length === 0) {
    // no existing convo, create new
    const newConversation = await createConversation(supabase, teacher);
    await sendMessage(
      supabase,
      { content: firstMessage, conversation: newConversation.id },
      session,
    ); // does this need to be awaited? todo: remove if not needed
    return newConversation as unknown as DbConversationWithReferences;
  }

  if (data.length === 1) {
    console.error(
      "User tried to create new conversation through a bug, if this happens frequently consider implementing the update event on start convo form.",
      { teacher, student },
    );
    throw new ResourceAlreadyExistsError(409, data[0].id.toString());
  }

  console.error("Unexpected error occured, invalid code path reached", {
    data,
    error,
  });
  throw new Error("Unexpected error occured");
};

export const getConversations = async (
  supabase: SupabaseClient<Database>,
  userId: string,
  max?: number,
): Promise<DbConversationWithReferences[]> => {
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
    .or(`teacher.eq.${userId},student.eq.${userId}`);
  // todo rewrite this function to take teacherid or studentid, and improve this search

  if (max) query = query.limit(max);

  const { data, error } = await query;

  if (error) {
    console.error("Failed to get conversations for userid: " + userId, {
      error,
    });
    throw error;
  }

  return data as unknown as DbConversationWithReferences[];
};

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
    has_replied: false,
  };

  const { data, error } = await supabase
    .from("conversations")
    .insert(dbConversation)
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error("Failed to create conversation: ", { error });
    throw error;
  }

  return data;
};
