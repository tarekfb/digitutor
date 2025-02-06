import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { InputCreditTransaction } from "src/lib/shared/models/credits.ts";
import { getNow } from "src/lib/shared/utils/utils.ts";
import type { Database } from "src/supabase.ts";

export const getCreditsByStudent = async (
  supabase: SupabaseClient<Database>,
  studentId: string,
): Promise<{
  balance: number | null;
} | null> => {
  const { data, error } = await supabase
    .from("student_credit_balances")
    .select(`balance`)
    .eq("student", studentId)
    .limit(1)
    .maybeSingle();


  if (error) {
    console.error(`Failed to get credits for studentId: ${studentId}`, { error });
    throw error;
  }

  return data;
};

export const updateCredits = async (
  supabase: SupabaseClient<Database>,
  amount: number,
  studentId: string,
  comment: string = "",
): Promise<void> => {
  const input: InputCreditTransaction = {
    amount,
    student: studentId,
    comment,
  }

  const { error } = await supabase
    .from('credit_transactions')
    .insert({ ...input, updated_at: getNow() })

  if (error) {
    console.error(`Failed to add credit transaction for: ${studentId}`, {
      error,
    });
    throw error;
  }
};

