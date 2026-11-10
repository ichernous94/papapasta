-- Data-only migration. Archive old menu rows; preserve every category/group/item identity.
DO $$
DECLARE
  rid text;
  main_id text;
  kids_id text;
  drinks_id text;
  source record;
  next_order integer;
  before_count bigint;
  after_count bigint;
BEGIN
  FOREACH rid IN ARRAY ARRAY['papapasta', 'centro'] LOOP
    PERFORM id FROM public.restaurants WHERE id = rid FOR UPDATE;
    IF NOT FOUND THEN CONTINUE; END IF;
    PERFORM id FROM public.menus WHERE restaurant_id = rid ORDER BY id FOR UPDATE;
    SELECT count(*) INTO before_count FROM public.menu_items i
      JOIN public.menu_groups g ON g.id = i.group_id
      JOIN public.menu_categories c ON c.id = g.category_id
      JOIN public.menus m ON m.id = c.menu_id WHERE m.restaurant_id = rid;

    INSERT INTO public.menus (id, restaurant_id, key, title, subtitle, sort_order)
      VALUES (rid || ':main', rid, 'main', 'MENU GŁÓWNE', 'specjalności lokalu', 0),
             (rid || ':kids', rid, 'kids', 'Menu Bambini', '', 1)
      ON CONFLICT (restaurant_id, key) DO NOTHING;
    INSERT INTO public.menus (id, restaurant_id, key, title, subtitle, sort_order, banner_image_id)
      VALUES (rid || ':drinks', rid, 'drinks', 'Napoje', '', 2,
        (SELECT banner_image_id FROM public.menus WHERE restaurant_id = rid AND key = 'wine'))
      ON CONFLICT (restaurant_id, key) DO NOTHING;
    SELECT id INTO main_id FROM public.menus WHERE restaurant_id = rid AND key = 'main';
    SELECT id INTO kids_id FROM public.menus WHERE restaurant_id = rid AND key = 'kids';
    SELECT id INTO drinks_id FROM public.menus WHERE restaurant_id = rid AND key = 'drinks';

    SELECT coalesce(max(sort_order), -1) + 1 INTO next_order FROM public.menu_categories WHERE menu_id = drinks_id;
    FOR source IN SELECT c.id FROM public.menu_categories c
      JOIN public.menus m ON m.id = c.menu_id
      WHERE m.restaurant_id = rid AND ((m.key = 'main' AND c.slug = 'napoje') OR m.key = 'wine')
      ORDER BY CASE WHEN m.key = 'main' THEN 0 ELSE 1 END, c.sort_order, c.id
    LOOP
      UPDATE public.menu_categories SET menu_id = drinks_id, sort_order = next_order WHERE id = source.id;
      next_order := next_order + 1;
    END LOOP;

    FOR source IN SELECT g.id FROM public.menu_groups g
      JOIN public.menu_categories c ON c.id = g.category_id
      JOIN public.menus m ON m.id = c.menu_id
      WHERE m.restaurant_id = rid AND m.key = 'autumn'
        AND (g.id = rid || ':autumn:all:hot-drinks' OR lower(trim(g.title)) IN ('gorące napoje', 'gorace napoje'))
      ORDER BY g.sort_order, g.id
    LOOP
      INSERT INTO public.menu_categories (id, menu_id, slug, label, sort_order)
        VALUES (rid || ':drinks:hot-drinks', drinks_id, 'hot-drinks', 'Gorące napoje', next_order)
        ON CONFLICT (id) DO NOTHING;
      IF NOT EXISTS (SELECT 1 FROM public.menu_categories WHERE id = rid || ':drinks:hot-drinks' AND menu_id = drinks_id) THEN
        RAISE EXCEPTION 'Unexpected hot drinks category owner for %', rid;
      END IF;
      UPDATE public.menu_groups SET category_id = rid || ':drinks:hot-drinks',
        sort_order = (SELECT coalesce(max(sort_order), -1) + 1 FROM public.menu_groups WHERE category_id = rid || ':drinks:hot-drinks')
        WHERE id = source.id;
    END LOOP;

    SELECT coalesce(max(sort_order), -1) + 1 INTO next_order FROM public.menu_categories WHERE menu_id = main_id;
    FOR source IN SELECT c.id, c.label, m.title FROM public.menu_categories c
      JOIN public.menus m ON m.id = c.menu_id
      WHERE m.restaurant_id = rid AND m.key NOT IN ('main', 'kids', 'drinks', 'wine', 'recommendations')
      ORDER BY m.sort_order, m.id, c.sort_order, c.id
    LOOP
      UPDATE public.menu_categories SET menu_id = main_id, sort_order = next_order,
        label = CASE WHEN trim(source.label) = '' THEN source.title ELSE source.label END WHERE id = source.id;
      next_order := next_order + 1;
    END LOOP;

    UPDATE public.menu_categories SET label = 'Menu Bambini' WHERE menu_id = kids_id AND trim(label) = '';
    UPDATE public.menus SET title = 'Menu Bambini', subtitle = ''
      WHERE id = kids_id AND lower(trim(title)) = 'menu' AND lower(trim(subtitle)) = 'bambini';
    UPDATE public.menus SET sort_order = CASE key WHEN 'main' THEN 0 WHEN 'kids' THEN 1 WHEN 'drinks' THEN 2 ELSE sort_order END,
      version = version + 1, updated_at = now() WHERE restaurant_id = rid;
    WITH ordered AS (
      SELECT c.id, row_number() OVER (PARTITION BY c.menu_id ORDER BY c.sort_order, c.id) - 1 AS position
      FROM public.menu_categories c WHERE c.menu_id IN (main_id, kids_id, drinks_id)
    ) UPDATE public.menu_categories c SET sort_order = ordered.position FROM ordered WHERE c.id = ordered.id;

    SELECT count(*) INTO after_count FROM public.menu_items i
      JOIN public.menu_groups g ON g.id = i.group_id
      JOIN public.menu_categories c ON c.id = g.category_id
      JOIN public.menus m ON m.id = c.menu_id WHERE m.restaurant_id = rid;
    IF before_count <> after_count THEN RAISE EXCEPTION 'Menu item count changed for %', rid; END IF;
    INSERT INTO public.audit_log (actor_id, action, target_id, details)
      VALUES ('migration:0005', 'menu.fixed-sections', rid, jsonb_build_object('itemsPreserved', after_count));
  END LOOP;
END $$;
