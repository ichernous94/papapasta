-- Data-only initialization of the reserved Centro popup, independently from public articles.
-- published stays false for compatibility with older article readers; enabled lives in the reserved JSON body.
-- Existing popup settings and all article/media/menu data are preserved.
INSERT INTO public.promotions (id,restaurant_id,slug,title,date,published,static_image,image_alt,body)
SELECT '668d54f7-97f8-4cb2-a46a-7d4a113cdbf6','centro','centro-promotion-popup','Rozgrzewające menu — Włoska Jesień','2026-11-10',false,'/images/promotional/promotional-image.jpg','Rozgrzewające menu — Włoska Jesień, Papa Pasta Centro','[{"type":"paragraph","enabled":true,"text":"Papa Pasta Centro\n\nCrème Brulée — 38 zł. Kremowy, deserowy koktajl na rumie z nutą wanilii, Cointreau i aksamitną pianką.\n\nVanilla Pear — 37 zł. Rześki gin sour z soczystą gruszką, waniliowym akcentem i delikatną pianką.\n\nAperol Martini — 38 zł. Tequila reposado i Aperol w duecie z cydrem, limonką oraz pikantnym miodem.\n\nGolden Fall — 39 zł. Bourbon Maker’s Mark i amaretto w słodko-kwaśnym wydaniu z cynamonem i pianką.\n\nCinnamone Fashion — 39 zł, pikantny. Korzenny miks bourbonu i Jack Daniel’s Fire ze słodkim cynamonem oraz rześkim cydrem."}]'::jsonb
WHERE EXISTS (SELECT 1 FROM public.restaurants WHERE id='centro')
ON CONFLICT (slug) DO NOTHING;
