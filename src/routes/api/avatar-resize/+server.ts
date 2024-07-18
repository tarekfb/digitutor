import type { RequestHandler } from "./$types";
import { type RequestEvent } from '@sveltejs/kit';
import { Buffer } from 'node:buffer';
import { PhotonImage, SamplingFilter, resize } from "@cf-wasm/photon";
import { maxAvatarUncompressedSize } from 'src/lib/shared/constants/constants';

export const POST =  (async (requestEvent: RequestEvent): Promise<Response> => {
    const { url } = requestEvent;
    console.log({ url });
    const arrayBuffer = await requestEvent.request.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // const uncompressedByteSize = Buffer.byteLength(arrayBuffer);


    const inputImage = PhotonImage.new_from_byteslice(inputBuffer);

    // resize image using photon
    const outputImage = resize(
        inputImage,
        500,
        500,
        SamplingFilter.Triangle
    );

    // get webp bytes
    const outputBuffer = outputImage.get_bytes_webp();
    return new Response(outputBuffer);
    // return new Response(inputBuffer);
}) satisfies RequestHandler;