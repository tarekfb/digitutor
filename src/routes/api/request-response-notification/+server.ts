import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types.ts";
import { getEmailById, sendEmail } from "src/lib/shared/utils/emails/utils.ts";
import ResponseNotification from "src/emails/response-notification.svelte";
import { getProfileByUser } from "src/lib/server/database/profiles.ts";
import { logError } from "src/lib/shared/utils/logging/utils.ts";

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
    logError({ message: "Bad request, missing param studentId", additionalData: { studentId, conversationId } })
    return json({ success: false, status: 400 });
  }

  let email: string;
  try {
    email = await getEmailById(supabase, studentId);
  } catch (error) {
    logError({ error, message: `Error getting email while sending request response email`, additionalData: { studentId, conversationId } })
    return json({ success: true });
  }

  let studentName = "";
  try {
    const student = await getProfileByUser(supabase, studentId);
    studentName = student.first_name;
  } catch (error) {
    logError({ error, message: `Error getting student profile while sending request response email`, additionalData: { studentId, conversationId } })
  }

  try {
    const { error: sendError } = await sendEmail(ResponseNotification, [email], "Din kontaktförfrågan har besvarats", { studentName, conversationId })
    if (sendError)
      logError({ error: sendError, message: `Error sending email for request response`, additionalData: { studentId, conversationId } });
  } catch (e) {
    logError({ error: e, message: `Error sending email for request response`, additionalData: { studentId, conversationId } });
    return json({ success: false })
  }

  return json({ success: true });
};
