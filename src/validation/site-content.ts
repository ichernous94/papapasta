import { z } from 'zod';
const version = z.number().int().positive();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s => !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s, 'Enter a valid date');
export const promotionInputSchema = z.object({
  id: z.string().uuid().optional(), version: version.optional(), title: z.string().trim().min(1).max(200), date,
  body: z.array(z.object({ type: z.enum(['paragraph','heading','list']), text: z.string().trim().max(6000) }).strict()).max(100),
  published: z.boolean(), imageAlt: z.string().trim().max(300), removeImage: z.boolean(),
}).strict().superRefine((input, ctx) => {
  if (input.id && !input.version) ctx.addIssue({ code: 'custom', message: 'Missing version' });
  if (input.published && !input.body.some(b => b.text.trim())) ctx.addIssue({ code: 'custom', message: 'Published promotions need text' });
});
export const promotionDeleteSchema = z.object({ id: z.string().uuid(), version }).strict();
export const galleryInputSchema = z.object({
  restaurantId: z.enum(['papapasta','centro']), version, id: z.string().uuid().optional(),
  alt: z.string().trim().min(1).max(300), visible: z.boolean(),
}).strict();
export const galleryOperationSchema = z.object({
  restaurantId: z.enum(['papapasta','centro']), version, id: z.string().uuid(), action: z.enum(['up','down','delete']),
}).strict();
