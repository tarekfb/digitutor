import { redirect, error } from "@sveltejs/kit";
import { unknownErrorMessage } from "$lib/constants";
import { getMessages } from "src/lib/server/database/messages";
import { getConversation } from "src/lib/server/database/conversations.js";

export const load = async ({ locals: { supabase, getSession }, params: { slug } }) => {
  try {
    const session = await getSession();
    if (!session)
      throw redirect(303, "/login");

    const conversation = await getConversation(supabase, slug);
    // if (!conversation)
      // error(404, {
      //   message: 'Not found'
      // });
      // const messages = await getMessages(supabase, conversation.id);
      // if (!messages)
      //   error(404, {
      //     message: 'Not found'
      //   });

      return { conversation };
  } catch (e) {
    console.error("Error when fetching messages from slug: " + slug, e);
    error(500, {
      message: unknownErrorMessage,
    });
  };
}

// export const actions = {
//   deleteListing: async ({ locals: { supabase, getSession }, params: { slug } }) => {
//     const session = await getSession();
//     if (!session)
//       throw redirect(303, "/login");
//     try {
//       await deleteListing(supabase, slug);
//     } catch (error) {
//       return fail(500, {
//         errorMessage: unknownErrorMessage,
//       });
//     }
//     throw redirect(303, `/account`);
//   },
//   updateListing: async (event) => {
//     const { locals: { supabase, getSession }, params: { slug } } = event;
//     const session = await getSession();
//     if (!session)
//       throw redirect(303, "/login");

//     const form = await superValidate(event, zod(createListingSchema));

//     if (!form.valid) {
//       return fail(400, {
//         form,
//       });
//     }

//     try {
//       await updateListing(supabase, form.data, slug);
//       return message(form, 'Annonsen är uppdaterad.');
//     } catch (error) {
//       return fail(500, {
//         form,
//       });
//     }
//   },
// };
