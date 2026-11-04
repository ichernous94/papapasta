ALTER TABLE public.menu_items ADD COLUMN allergens text[] NOT NULL DEFAULT '{}'::text[];
