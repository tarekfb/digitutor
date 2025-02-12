import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types.ts";
import { getEmailById, sendEmail } from "src/lib/shared/utils/emails/utils.ts";
import ResponseNotification from "src/emails/response-notification.svelte";
import { getProfileByUser } from "src/lib/server/database/profiles.ts";

export const POST: RequestHandler = async ({
  request,
  locals: { supabase },
}) => {
  const requestBody: unknown = await request.json();
  const requestBodyTyped = requestBody as {
    studentId: string;
    conversationId: string;
  };

  const { studentId, conversationId } = requestBodyTyped;

  if (!studentId) {
    console.error("Bad request, missing param studentId")
    return json({ success: false, status: 400 });
  }

  let email: string;
  try {
    email = await getEmailById(supabase, studentId);
  } catch (error) {
    console.error(`Error getting email while sending request response email for studentId: ${studentId}`, error)
    return json({ success: true });
  }

  let studentName = "";
  try {
    const student = await getProfileByUser(supabase, studentId);
    studentName = student.first_name;
  } catch (error) {
    console.error(`Error getting student profile while sending request response email for student ${studentId}`, error);
  }

  try {
    const { error: sendError } = await sendEmail(ResponseNotification, [email], "Din kontaktförfrågan har besvarats", { studentName, conversationId })
    if (sendError)
      console.error(`Error sending email for request response for student ${studentId} and conversationId: ${conversationId}`, sendError);
  } catch (e) {
    console.error(`Error sending email for request response for student ${studentId} and conversationId: ${conversationId}`, e);
    return json({ success: false })
  }

  return json({ success: true });
};
