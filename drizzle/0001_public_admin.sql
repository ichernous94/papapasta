ALTER TYPE auth.user_role SET SCHEMA public;
--> statement-breakpoint
ALTER TABLE auth."user" SET SCHEMA public;
--> statement-breakpoint
ALTER TABLE auth."session" SET SCHEMA public;
--> statement-breakpoint
ALTER TABLE auth."account" SET SCHEMA public;
--> statement-breakpoint
ALTER TABLE auth."verification" SET SCHEMA public;
--> statement-breakpoint
ALTER TABLE auth."two_factor" SET SCHEMA public;
--> statement-breakpoint
ALTER TABLE auth."rate_limit" SET SCHEMA public;
--> statement-breakpoint
ALTER TABLE content."restaurants" SET SCHEMA public;
--> statement-breakpoint
ALTER TABLE content."menus" SET SCHEMA public;
--> statement-breakpoint
ALTER TABLE content."menu_categories" SET SCHEMA public;
--> statement-breakpoint
ALTER TABLE content."menu_groups" SET SCHEMA public;
--> statement-breakpoint
ALTER TABLE content."media_assets" SET SCHEMA public;
--> statement-breakpoint
ALTER TABLE content."menu_items" SET SCHEMA public;
--> statement-breakpoint
ALTER TABLE content."audit_log" SET SCHEMA public;
--> statement-breakpoint
ALTER TABLE public."user" ADD COLUMN last_login_at timestamptz;
--> statement-breakpoint
CREATE TABLE public.qr_codes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), restaurant_id text NOT NULL REFERENCES public.restaurants(id),
 name text NOT NULL, url text NOT NULL, active boolean NOT NULL DEFAULT true,
 created_by text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
DROP SCHEMA auth;
--> statement-breakpoint
DROP SCHEMA content;
