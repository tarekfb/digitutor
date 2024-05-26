// import { getMessages, sendMessage as sendMessageToDb } from 'src/lib/server/database/messages.js'
// import { writable, get } from 'svelte/store'
// import type { SupabaseClient } from '@supabase/supabase-js'
// import type { InputMessage } from 'src/lib/models/conversations.js'
// import type { Database } from 'lucide-svelte'
// export const chat = writable([])

// let isAdded = false
// let initChatCount = 25
// let tableName = 'global_chat'

// export const loadChat = async (supabase: SupabaseClient<Database>, conversationId: string) => {

//     const data = await getMessages(supabase, conversationId, initChatCount)
//     if (!data) throw new Error("Test")

//     chat.set(data)

//     const mySubscription = supabase
//         .from(tableName)
//         .on('INSERT', (payload) => {
//             chat.set([...data, payload.new])
//             loadChat()
//         })
//         .subscribe()
// }

// export const loadMore = async () => {
//     const { data, error } = await supabase
//         .from(tableName)
//         .select()
//         .order('id', { ascending: false })
//         .limit((initChatCount += 5))
//     chat.set(data.reverse())
// }



// export const sendMessage = async (
//     supabase: SupabaseClient<Database>,
//     input: InputMessage,
// ) => {
//     const message = sendMessageToDb(supabase, input)
//     loadChat();
// }


// export const replyData = async (id: string) => {
//     const { data, error } = await supabase.from(tableName).select().eq('id', id)
//     if (error) {
//         return console.error(error)
//     }
//     console.log('chatstore (replydata):', data)
//     return data
// }
