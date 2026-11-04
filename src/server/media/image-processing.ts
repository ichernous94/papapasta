import sharp from 'sharp';
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export async function processDishImage(input: Buffer) {
    if (!input.length || input.length > MAX_IMAGE_BYTES)
        throw new Error('Images must be no larger than 5 MB');
    try {
        // libvips may treat APNG as a single PNG; reject its animation control chunk explicitly.
        if (input.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
            for (let offset = 8; offset + 12 <= input.length;) {
                const length = input.readUInt32BE(offset);
                if (input.toString('ascii', offset + 4, offset + 8) === 'acTL')
                    throw new Error('animation');
                offset += length + 12;
            }
        }
        const options = { limitInputPixels: 25000000, animated: true, failOn: 'warning' as const };
        const metadata = await sharp(input, options).metadata();
        if (!['jpeg', 'png', 'webp'].includes(metadata.format ?? '') || (metadata.pages ?? 1) !== 1 || !metadata.width || !metadata.height || metadata.width * metadata.height > 25000000)
            throw new Error('format');
        const { data, info } = await sharp(input, options).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
        const blur = await sharp(data).resize({ width: 20, height: 20, fit: 'inside' }).webp({ quality: 40 }).toBuffer();
        return { data, width: info.width, height: info.height, byteSize: data.length, mimeType: 'image/webp', blurDataURL: `data:image/webp;base64,${blur.toString('base64')}` };
    }
    catch {
        throw new Error('Use a static JPEG, PNG or WebP image up to 25 megapixels');
    }
}
