import type { AllergenId } from '@/config/allergens';
import { relations } from 'drizzle-orm';
import { type AnyPgColumn, pgTable, text, integer, boolean, timestamp, uuid, jsonb, uniqueIndex, index } from 'drizzle-orm/pg-core';
const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
export const restaurants = pgTable('restaurants', {
    id: text('id').primaryKey(), name: text('name').notNull(),
});
export const menus = pgTable('menus', {
    id: text('id').primaryKey(),
    restaurantId: text('restaurant_id').notNull().references(() => restaurants.id),
    key: text('key').notNull(), title: text('title').notNull(), subtitle: text('subtitle').notNull().default(''),
    version: integer('version').notNull().default(1), sortOrder: integer('sort_order').notNull().default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    bannerImageId: uuid('banner_image_id').references((): AnyPgColumn => mediaAssets.id),
}, table => [uniqueIndex('menu_restaurant_key').on(table.restaurantId, table.key)]);
export const categories = pgTable('menu_categories', {
    id: text('id').primaryKey(), menuId: text('menu_id').notNull().references(() => menus.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(), label: text('label').notNull(), note: text('note').notNull().default(''),
    columns: integer('columns').notNull().default(1), columnBreak: integer('column_break').notNull().default(1),
    sortOrder: integer('sort_order').notNull().default(0),
}, table => [index('category_menu').on(table.menuId)]);
export const groups = pgTable('menu_groups', {
    id: text('id').primaryKey(), categoryId: text('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
    title: text('title').notNull().default(''), note: text('note').notNull().default(''), afterNote: text('after_note').notNull().default(''),
    sortOrder: integer('sort_order').notNull().default(0),
}, table => [index('group_category').on(table.categoryId)]);
export const mediaAssets = pgTable('media_assets', {
    id: uuid('id').primaryKey().defaultRandom(), objectKey: text('object_key').notNull().unique(),
    width: integer('width').notNull(), height: integer('height').notNull(), mimeType: text('mime_type').notNull(),
    byteSize: integer('byte_size').notNull(), blurDataURL: text('blur_data_url').notNull(),
    status: text('status', { enum: ['pending', 'ready', 'orphan'] }).notNull().default('pending'),
    createdBy: text('created_by').notNull(), createdAt: createdAt(),
});
export const items = pgTable('menu_items', {
    id: text('id').primaryKey(), groupId: text('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
    name: text('name').notNull(), portion: text('portion').notNull().default(''), price: text('price').notNull().default(''),
    allergens: text('allergens').array().$type<AllergenId[]>().notNull().default([]),
    description: text('description').array().notNull().default([]), isNew: boolean('is_new').notNull().default(false),
    visible: boolean('visible').notNull().default(true), sortOrder: integer('sort_order').notNull().default(0),
    imageId: uuid('image_id').references(() => mediaAssets.id), imageAlt: text('image_alt').notNull().default(''),
}, table => [index('item_group').on(table.groupId), index('item_image').on(table.imageId)]);
export const auditLog = pgTable('audit_log', {
    id: uuid('id').primaryKey().defaultRandom(), actorId: text('actor_id').notNull(), action: text('action').notNull(),
    targetId: text('target_id').notNull(), details: jsonb('details').$type<Record<string, unknown>>().notNull().default({}),
    createdAt: createdAt(),
}, table => [index('audit_created').on(table.createdAt)]);
export const menusRelations = relations(menus, ({ one, many }) => ({ categories: many(categories), bannerImage: one(mediaAssets, { fields: [menus.bannerImageId], references: [mediaAssets.id] }) }));
export const categoriesRelations = relations(categories, ({ one, many }) => ({ menu: one(menus, { fields: [categories.menuId], references: [menus.id] }), groups: many(groups) }));
export const groupsRelations = relations(groups, ({ one, many }) => ({ category: one(categories, { fields: [groups.categoryId], references: [categories.id] }), items: many(items) }));
export const itemsRelations = relations(items, ({ one }) => ({ group: one(groups, { fields: [items.groupId], references: [groups.id] }), image: one(mediaAssets, { fields: [items.imageId], references: [mediaAssets.id] }) }));
export const mediaRelations = relations(mediaAssets, ({ many }) => ({ items: many(items) }));

export const qrCodes = pgTable('qr_codes', {
    id: uuid('id').primaryKey().defaultRandom(),
    restaurantId: text('restaurant_id').notNull().references(() => restaurants.id),
    name: text('name').notNull(), url: text('url').notNull(), active: boolean('active').notNull().default(true),
    createdBy: text('created_by').notNull(), createdAt: createdAt(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
