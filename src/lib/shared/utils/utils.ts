import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import type { z } from "zod";
import { invalidate } from "$app/navigation";
import type { SupabaseClient, Session, PostgrestError } from "@supabase/supabase-js";
import { redirect } from "@sveltejs/kit";
import type { Database } from "lucide-svelte";
import type { Tables } from "src/supabase";
import type { Profile } from "../models/profile";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { requestContactSchema, startContactSchema } from "../models/conversation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 },
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;

  const scaleConversion = (
    valueA: number,
    scaleA: [number, number],
    scaleB: [number, number],
  ) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (
    style: Record<string, number | string | undefined>,
  ): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, "");
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t,
      });
    },
    easing: cubicOut,
  };
};

export type TypeToZod<T> = {
  [K in keyof T]: T[K] extends (string | number | boolean | null | undefined | number[])
  ? (undefined extends T[K] ? z.ZodOptional<z.ZodType<Exclude<T[K], undefined>>> : z.ZodType<T[K]>)
  : z.ZodObject<TypeToZod<T[K]>>
};

export const convertToInitials = (firstName: string, lastName: string): string => (firstName[0] + lastName[0]).toUpperCase();

export const getNow = () => new Date().toISOString();

export const timeAgo = (dateIsoString: string): string => {
  const pastDate = new Date(dateIsoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  const minutes = 60;
  const hours = minutes * 60;
  const days = hours * 24;
  const years = days * 365;

  if (diffInSeconds < minutes) {
    return '>1 min';
  } else if (diffInSeconds < hours) {
    const mins = Math.floor(diffInSeconds / minutes);
    return `${mins} minut${mins > 1 ? 'er' : ''}`;
  } else if (diffInSeconds < days) {
    const hrs = Math.floor(diffInSeconds / hours);
    return `${hrs} timm${hrs > 1 ? 'ar' : 'e'}`;
  } else if (diffInSeconds < years) {
    const dys = Math.floor(diffInSeconds / days);
    return `${dys} dag${dys > 1 ? 'ar' : ''}`;
  } else {
    const yrs = Math.floor(diffInSeconds / years);
    return `${yrs} år`;
  }
}

export const getRecipient = (self: "teacher" | "student") => {
  switch (self) {
    case "teacher":
      return "student";
    case "student":
      return "teacher";
  }
}

export const logout = (
  supabase: SupabaseClient<Database>,
  session: Session | null | undefined,
) => {
  if (!session) redirect(303, "/sign-in");
  supabase.auth.signOut();
  invalidate("supabase:auth");
};

export const removeUndefined = (fields: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(fields).filter(([_, v]) => v !== undefined)
  );

export const isPostgrestError = (error: any): error is PostgrestError => (
  typeof error.message === 'string' &&
  typeof error.details === 'string' &&
  typeof error.code === 'string'
);

export const isStorageErrorCustom = (error: any): error is PostgrestError => (
  typeof error.error === 'string' &&
  typeof error.message === 'string' &&
  typeof error.statusCode === 'string'
);

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 B'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const truncate = (text: string, limit: number) => {
  if (text.split(' ').length > limit) {
    const truncatedText = text.split(' ').slice(0, limit).join(' ');
    return `${truncatedText}...`;
  }
  return text;
};

export const verifyAvatarOwnership = (avatarUrl: string, userId: string) => {
  const dirs = avatarUrl.split("/");
  const expectedUserId = dirs[dirs.length - 1].split("---")[0];
  return expectedUserId === userId;
}

export const formatDateReadable = (date: string) => {
  const rawDate = new Date(date);
  const year = rawDate.getFullYear().toString();
  const month = getSwedishMonthName(rawDate.getMonth() + 1).substring(0, 3);
  let day = rawDate.getDate().toString().padStart(2, '0');
  if (day.substring(0, 1) === '0') day = day.substring(1);
  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
};

const getSwedishMonthName = (monthNumber: number) => {
  const monthNames = [
    'Januari',
    'Februari',
    'Mars',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'Augusti',
    'September',
    'Oktober',
    'November',
    'December',
  ];
  return monthNames[monthNumber - 1];
};

export const formatProfile = ({ id, role, first_name: firstName, last_name: lastName, avatar_url: avatarUrl }: Tables<"profiles">): Profile => {
  if (role === "admin")
    throw new Error("Unsupported role")

  return { id, role, firstName, lastName, avatarUrl }
}

export const loadContactTeacherForms = async (teacher?: Tables<"profiles">) => {
  const initValues = { teacher: teacher?.id, role: teacher?.role }
  const requestContactForm = await superValidate(initValues, zod(requestContactSchema))
  const startContactForm = await superValidate(initValues, zod(startContactSchema))
  return { requestContactForm, startContactForm }
}
