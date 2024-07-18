import type { RequestHandler } from "./$types";
import { type RequestEvent } from '@sveltejs/kit';
import { Buffer } from 'node:buffer';
import * as photon from "@cf-wasm/photon";
import { maxAvatarUncompressedSize } from 'src/lib/shared/constants/constants';

export const POST =  (async (requestEvent: RequestEvent): Promise<Response> => {
    const { url } = requestEvent;
    console.log({ url });
    const arrayBuffer = await requestEvent.request.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // const uncompressedByteSize = Buffer.byteLength(arrayBuffer);

    const moduleInstance = await WebAssembly.instantiate(photon);

    const inputImage = photon.PhotonImage.new_from_byteslice(inputBuffer);

    // resize image using photon
    const outputImage = photon.resize(
        inputImage,
        500,
        500,
        photon.SamplingFilter.Triangle
    );

    // get webp bytes
    const outputBuffer = outputImage.get_bytes_webp();
    return new Response(outputBuffer);
    // return new Response(inputBuffer);
}) satisfies RequestHandler;