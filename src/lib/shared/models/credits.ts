import type { Tables } from "src/supabase.ts";
import type { DbProfile, Profile } from "./profile.ts";

export type DbCreditTransactionsBase = Tables<"credit_transactions">;

export type DbCreditTransactionsWithReferences = Omit<
  DbCreditTransactionsBase,
  "student"
> & {
  student: DbProfile;
};

export type CreditTransactionsBase = Omit<
  DbCreditTransactionsBase,
  "created_at" | "updated_at"
> & {
  createdAt: string;
  updatedAt: string;
};

export type CreditTransactionsWithReferences = Omit<
  CreditTransactionsBase,
  "student"
> & {
  student: Profile;
};

export type InputCreditTransaction = {
  amount: number;
  comment?: string;
  student: string;
};
