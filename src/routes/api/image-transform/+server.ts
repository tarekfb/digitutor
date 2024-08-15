// import type { RequestHandler } from "@sveltejs/kit";

// // platform: {
// //   env: {},
// //   context: ExecutionContext {},
// //   caches: CacheStorage { default: Cache {} },
// //   cf: {
// //     clientTcpRtt: 3,
// //     longitude: '17.99480',
// //     httpProtocol: 'HTTP/1.1',
// //     tlsCipher: 'AEAD-AES256-GCM-SHA384',
// //     continent: 'EU',
// //     asn: 2119,
// //     clientAcceptEncoding: 'br, gzip, deflate',
// //     tlsClientExtensionsSha1: 'Y7DIC8A6G0/aXviZ8ie/xDbJb7g=',
// //     isEUCountry: '1',
// //     verifiedBotCategory: '',
// //     tlsClientAuth: [Object],
// //     tlsExportedAuthenticator: [Object],
// //     tlsVersion: 'TLSv1.3',
// //     city: 'Solna',
// //     timezone: 'Europe/Stockholm',
// //     tlsClientHelloLength: '386',
// //     requestPriority: '',
// //     edgeRequestKeepAliveStatus: 1,
// //     tlsClientRandom: 'F4e00fMZsTUrKriZV7xNHF+LnLhp06DXg+e0HRjxWeQ=',
// //     region: 'Stockholm County',
// //     latitude: '59.35910',
// //     postalCode: '169 00',
// //     regionCode: 'AB',
// //     asOrganization: 'Telenor Sverige AB',
// //     colo: 'ARN',
// //     country: 'SE',
// //     botManagement: [Object]
// //   }
// // },
// export const GET = ((requestEvent) => {

//   const { platform } = requestEvent;
//   const { url } = requestEvent;
//   let options = { cf: { image: { width: "", height: "", quality: "" } } }

//   if (url.searchParams.has("width")) options.cf.image.width = url.searchParams.get("width") ?? ""
//   if (url.searchParams.has("height")) options.cf.image.height = url.searchParams.get("height") ?? ""
//   if (url.searchParams.has("quality")) options.cf.image.quality = url.searchParams.get("quality") ?? ""

//   // Get URL of the original (full size) image to resize.
//   // You could adjust the URL here, e.g., prefix it with a fixed address of your server,
//   // so that user-visible URLs are shorter and cleaner.
//   const imageURL = url.searchParams.get("image")
//   if (!imageURL) return new Response('Missing "image" value', { status: 400 })

//   try {
//     // TODO: Customize validation logic
//     const { hostname, pathname } = new URL(imageURL)

//     // Optionally, only allow URLs with JPEG, PNG, GIF, or WebP file extensions
//     // @see https://developers.cloudflare.com/images/url-format#supported-formats-and-limitations
//     if (!/\.(jpe?g|png|gif|webp)$/i.test(pathname)) {
//       return new Response('Disallowed file extension', { status: 400 })
//     }

//     // Demo: Only accept "example.com" images
//     if (hostname !== 'example.com') {
//       return new Response('Must use "example.com" source images', { status: 403 })
//     }
//   } catch (err) {
//     return new Response('Invalid "image" value', { status: 400 })
//   }

//   // Build a request that passes through request headers
//   const imageRequest = new Request(imageURL, {
//     headers: request.headers
//   })

//   const res = await fetch(imageRequest, options)


//   return new Response(String(Math.random()));
// }) satisfies RequestHandler;