import { createToken } from '$lib/token.server';
import { redirect } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import type { PixlrPayloadJWT } from 'pixlr-sdk';

async function upload(file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = `static/upload/${file.name}`;

    await mkdir('static/upload/', { recursive: true });
    await writeFile(filePath, buffer);
}

export const actions = {
    open: async ({ url, request }) => {
        const formData = await request.formData();
        const image = formData.get('file') as File;

        await upload(image);

        const payload = {
            mode: 'http',
            follow: true,
            openUrl: `${url.origin}/upload/${image.name}`,
            saveUrl: `${url.origin}/http?/save`
        } as PixlrPayloadJWT;

        const token = await createToken(payload);

        throw redirect(303, `https://pixlr.com/express/?token=${token}`);
    },

    save: async ({ request }) => {
        const formData = await request.formData();
        const image = formData.get('file') as File;

        await upload(image);

        return { fileName: image.name };
    }
}