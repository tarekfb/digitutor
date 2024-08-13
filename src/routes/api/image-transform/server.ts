import type { RequestHandler } from "@sveltejs/kit";

export const GET = ((unknownObj) => {
  console.log("HIT API")
  console.log(unknownObj)
  return new Response(String(Math.random()));
}) satisfies RequestHandler;