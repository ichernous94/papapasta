import { ALLERGEN_IDS, normalizeAllergens } from '@/config/allergens';
import { z } from 'zod';
export const emailSchema = z.string().trim().toLowerCase().email('Enter a valid email address');
export const passwordSchema = z.string().min(12, 'Use at least 12 characters').max(128, 'Use no more than 128 characters');
export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, 'Enter your password').max(128) });
export const totpSchema = z.object({ code: z.string().regex(/^\d{6}$/, 'Enter the six-digit code') });
export const createUserSchema = z.object({ name: z.string().trim().min(1, 'Enter a name').max(120), email: emailSchema, password: passwordSchema, role: z.enum(['admin', 'user']) }).strict();
export const passwordChangeSchema = z.object({ currentPassword: z.string().min(1, 'Enter your current password'), newPassword: passwordSchema });
export const allergensSchema = z.array(z.enum(ALLERGEN_IDS)).transform(normalizeAllergens);
export const itemInputSchema = z.object({
    menuId: z.string().min(1), version: z.number().int().positive(), sourceMenuId: z.string().optional(), sourceVersion: z.number().int().positive().optional(), id: z.string().optional(), groupId: z.string().min(1),
    name: z.string().trim().min(1, 'Enter a name').max(200), portion: z.string().trim().max(100), price: z.string().trim().max(100),
    allergens: allergensSchema.optional(),
    description: z.string().max(6000), isNew: z.boolean(), visible: z.boolean(), imageAlt: z.string().trim().max(300), removeImage: z.boolean(),
}).strict();
export const structureInputSchema = z.object({
    menuId: z.string().min(1), version: z.number().int().positive(), id: z.string().min(1),
    columns: z.number().int().min(1).max(2).optional(), columnBreak: z.number().int().min(1).optional(),
    removeBanner: z.boolean().optional(),
    kind: z.enum(['menu', 'category', 'group']), title: z.string().trim().max(200), note: z.string().max(6000), afterNote: z.string().max(6000),
}).strict();
export type ItemInput = z.infer<typeof itemInputSchema>;
export const qrInputSchema = z.object({ restaurantId: z.enum(['papapasta', 'centro']), name: z.string().trim().min(1).max(200), url: z.string().trim().max(2048).url().refine(value => { try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; } }, 'Use an HTTP(S) URL'), active: z.boolean() }).strict();
