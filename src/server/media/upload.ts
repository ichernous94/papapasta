import 'server-only';
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { getDb } from '@/server/db';
import { mediaAssets } from '@/server/db/schema';
import { processDishImage } from './image-processing';
import { MEDIA_PREFIX, storageConfig, uploadObject } from './storage';
export async function prepareUpload(file: File, actorId: string) {
    if (!storageConfig())
        throw new Error('Image storage is not configured. Save dish details without a new image.');
    if (file.size > 5 * 1024 * 1024)
        throw new Error('Images must be no larger than 5 MB');
    const processed = await processDishImage(Buffer.from(await file.arrayBuffer()));
    const id = randomUUID();
    const objectKey = `${MEDIA_PREFIX}${id}.webp`;
    const { data, ...metadata } = processed;
    await getDb().insert(mediaAssets).values({ id, objectKey, ...metadata, createdBy: actorId });
    try {
        await uploadObject(objectKey, data);
    }
    catch {
        await getDb().update(mediaAssets).set({ status: 'orphan' }).where(eq(mediaAssets.id, id));
        throw new Error('Could not upload the image. Your form and previous image are preserved; try again.');
    }
    return id;
}
