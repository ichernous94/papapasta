'use server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { unstable_rethrow } from 'next/navigation';
import { requireAdministrator } from '@/server/auth/guards';
import { getDb } from '@/server/db';
import { qrCodes, auditLog, restaurants } from '@/server/db/schema';
import { qrInputSchema } from '@/validation/admin';
export async function saveQRCodeAction(raw: unknown) {
    const { user } = await requireAdministrator();
    try {
        const input = qrInputSchema.parse(raw);
        await getDb().transaction(async tx => {
            if (!await tx.query.restaurants.findFirst({ where: eq(restaurants.id, input.restaurantId) })) throw new Error();
            const [row] = await tx.insert(qrCodes).values({ ...input, createdBy: user.id }).returning();
            await tx.insert(auditLog).values({ actorId: user.id, action: 'qr.create', targetId: row.id });
        });
        revalidatePath('/site-admin/qr-codes');
        return { success: true };
    } catch (error) { unstable_rethrow(error); return { error: 'Could not create QR code. Check the name and HTTP(S) URL.' }; }
}
export async function deleteQRCodeAction(id: string) {
    const { user } = await requireAdministrator();
    try {
        z.string().uuid().parse(id);
        await getDb().transaction(async tx => {
            const deleted = await tx.delete(qrCodes).where(eq(qrCodes.id, id)).returning();
            if (!deleted.length) throw new Error();
            await tx.insert(auditLog).values({ actorId: user.id, action: 'qr.delete', targetId: id });
        });
        revalidatePath('/site-admin/qr-codes');
        return { success: true };
    } catch (error) { unstable_rethrow(error); return { error: 'Could not delete QR code.' }; }
}
