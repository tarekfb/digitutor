import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import type { z } from "zod";
import { invalidate } from "$app/navigation";
import type { SupabaseClient, Session } from "@supabase/supabase-js";
import { redirect } from "@sveltejs/kit";
import type { Database } from "lucide-svelte";

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

export const getRecipient = (self: "teacher" | "student" | "admin") => {
  switch (self) {
    case "teacher":
      return "student";
    case "student":
      return "teacher";
    case "admin":
      return "admin";
  }
}

export const logout = (
  supabase: SupabaseClient<Database>,
  session: Session | null | undefined,
) => {
  if (!session) redirect(303, "/auth");
  supabase.auth.signOut();
  invalidate("supabase:auth");
};