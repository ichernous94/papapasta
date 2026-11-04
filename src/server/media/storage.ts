import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
export const MEDIA_PREFIX = 'papapasta/menu-images/';
export function storageConfig() {
    const { R2_ACCOUNT_ID: account, R2_BUCKET_NAME: bucket, R2_ACCESS_KEY_ID: accessKeyId, R2_SECRET_ACCESS_KEY: secretAccessKey, R2_PUBLIC_BASE_URL: base } = process.env;
    if (!account || !bucket || !accessKeyId || !secretAccessKey || !base)
        return null;
    const url = new URL(base);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash)
        throw new Error('Invalid R2 configuration');
    return { bucket, base: base.replace(/\/$/, ''), client: new S3Client({ region: 'auto', endpoint: `https://${account}.r2.cloudflarestorage.com`, credentials: { accessKeyId, secretAccessKey } }) };
}
export async function uploadObject(key: string, body: Buffer) {
    const config = storageConfig();
    if (!config)
        throw new Error('Image storage is not configured. You can save details without uploading an image.');
    await config.client.send(new PutObjectCommand({ Bucket: config.bucket, Key: key, Body: body, ContentType: 'image/webp', CacheControl: 'public, max-age=31536000, immutable' }));
}
export async function deleteObject(key: string) {
    if (!key.startsWith(MEDIA_PREFIX))
        throw new Error('Object is outside the application scope');
    const config = storageConfig();
    if (!config)
        throw new Error('R2 is not configured');
    await config.client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
}
export function publicImageURL(key: string) {
    const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, '');
    return base && key.startsWith(MEDIA_PREFIX) ? `${base}/${key}` : null;
}
