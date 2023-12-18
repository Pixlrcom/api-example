import { createToken } from "$lib/token.server";

// We generate the token on the server side to not leak our clientSecret

export async function load({ url }) {
    const origin = url.origin;
    const token = await createToken({ mode: 'embedded', origin });
    return { token }
}