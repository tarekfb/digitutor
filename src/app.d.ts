import { SupabaseClient, Session, User } from "@supabase/supabase-js";
import { Database } from "./supabase";
import type { MessageId } from "./lib/shared/constants/constants.ts";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      supabaseServiceRole: SupabaseClient<Database>;
      safeGetSession: () => Promise<{
        session: Session | null;
        user: User | null;
      }>;
      session: Session | null;
      user: User | null;
    }
    interface PageData {
      flash?: {
        type: "success" | "error" | "info" | "warning";
        message: string;
      };
    }
    interface Error {
      message: string;
      description: string;
      trackingId?: string;
      id?: MessageId;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data?: any;
    }
    // interface PageData {
    //   session: Session | null;
    // }
    // interface Platform {}
  }
}

export { };
