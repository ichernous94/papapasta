import './helpers/register-styles.cjs';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { dishSlug, dishPath, listDishes as listRestaurantDishes, findDish as findRestaurantDish, dishMetadata, dishStructuredData } from '../src/server/content/dishes';
import MenuList from '../src/components/MenuList';
import Recommendations from '../src/components/Recommendations';
import JsonLd from '../src/components/JsonLd';
import type { EditorMenu, EditorItem } from '../src/types/admin';

const image = { src:'/images/centro/grilled-chicken-dish.jpg',width:1200,height:800,blurDataURL:'data:image/gif;base64,R0lGODlhAQABAAAAACw=',alt:'Carpaccio' };
const item:EditorItem = { allergens:[], id:'centro:main:carpaccio',name:'Carpaccio di manzo',portion:'230 g',price:'55',description:['A real menu description'],isNew:false,visible:true,imageId:null,imageAlt:'',image,sortOrder:0,groupId:'group' };
const menu:EditorMenu = { id:'centro:main',restaurantId:'centro',key:'main',title:'Menu główne',subtitle:'',version:1,categories:[{id:'category',label:'Przystawki',groups:[{id:'group',title:'',note:'',afterNote:'',items:[item]}]}] };

test('Dish URLs are readable, distinguish duplicate names and retain identity through renames', () => {
  assert.match(dishSlug(item),/^carpaccio-di-manzo-[a-f0-9]{12}$/);
  assert.match(dishSlug({...item,name:'Łosoś & żółta papryka'}),/^losos-zolta-papryka-/);
  assert.notEqual(dishPath(item),dishPath({...item,id:'centro:recommendations:carpaccio'}));
  const renamed = {...menu,categories:[{...menu.categories[0],groups:[{...menu.categories[0].groups[0],items:[{...item,name:'Renamed dish'}]}]}]};
  assert.equal(findDish([renamed],dishSlug(item))?.name,'Renamed dish');
  assert.match(findDish([renamed],dishSlug(item))!.href,/renamed-dish-/);
  assert.equal(findDish([menu],'not-a-dish'),undefined);
});

test('Only visible Centro dishes with photos receive detail pages and sitemap entries', () => {
  const mixed = {...menu,categories:[{...menu.categories[0],groups:[{...menu.categories[0].groups[0],items:[item,{...item,id:'hidden',visible:false},{...item,id:'no-image',image:undefined}]}]}]};
  const dishes=listDishes([mixed,{...menu,restaurantId:'papapasta'}]);
  assert.equal(dishes.length,1);
  assert.equal(dishes[0].category,'Przystawki');
});

test('Dish metadata has its own canonical and social image; schema preserves display-only prices', () => {
  const dish=listDishes([menu])[0]; const metadata=dishMetadata(dish);
  assert.equal(metadata.alternates?.canonical,dish.href);
  assert.ok(String(metadata.title).includes(item.name));
  assert.equal(new URL(String(metadata.metadataBase)).origin,'https://centro.papapasta.pl');
  assert.equal((metadata.twitter as { card?: string })?.card,'summary_large_image');
  assert.equal(dishStructuredData(dish).offers?.priceCurrency,'PLN');
  for(const price of ['29/36','do wyboru','w cenie steków','']) assert.equal(dishStructuredData({...dish,price}).offers,undefined);
  const html=renderToStaticMarkup(<JsonLd data={{name:'</script><script>alert(1)</script>'}}/>);
  assert.equal((html.match(/<script/g)??[]).length,1);
  assert.ok(html.includes('\\u003c'));
});

test('Menu and recommendations without photos keep the original rendered markup', () => {
  const groups=[{id:'group',title:'',items:[{...item,image:undefined}]}];
  assert.equal(renderToStaticMarkup(<MenuList groups={groups} columns={2}/>),renderToStaticMarkup(<MenuList groups={groups} columns={2} variant="centro"/>));
  const recommendations=[{id:item.id,name:item.name,price:'55',description:'Description'}];
  assert.equal(renderToStaticMarkup(<Recommendations items={recommendations}/>),renderToStaticMarkup(<Recommendations items={recommendations} restaurantId="centro"/>));
});

test('Photo variants link to a dish page; the default variant retains its photo viewer', () => {
  const groups=[{id:'group',items:[item]}];
  const centro=renderToStaticMarkup(<MenuList groups={groups} columns={2} variant="centro"/>);
  assert.ok(centro.includes(`href="${dishPath(item)}"`));
  const original=renderToStaticMarkup(<MenuList groups={groups}/>);
  assert.ok(original.includes('Powiększ zdjęcie:'));
  assert.ok(!original.includes(dishPath(item)));
});

function listDishes(menus: Parameters<typeof listRestaurantDishes>[0]) { return listRestaurantDishes(menus, 'centro'); }
function findDish(menus: Parameters<typeof findRestaurantDish>[0], slug: string) { return findRestaurantDish(menus, 'centro', slug); }

test('PapaPasta and Centro lookup, metadata and recommendations remain isolated', () => {
  const papaItem = { ...item, id: 'papapasta:main:carpaccio', price: '61', allergens: ['milk' as const] };
  const recommendation = { ...papaItem, id: 'papapasta:recommendations:carpaccio', price: '49', allergens: ['gluten' as const] };
  const papa = { ...menu, restaurantId: 'papapasta' as const, categories: [{ ...menu.categories[0], groups: [{ ...menu.categories[0].groups[0], items: [papaItem] }] }] };
  const rec = { ...papa, key: 'recommendations', categories: [{ ...papa.categories[0], groups: [{ ...papa.categories[0].groups[0], items: [recommendation] }] }] };
  const menus = [menu, papa, rec];
  const dishes = listRestaurantDishes(menus, 'papapasta');
  assert.equal(dishes.length, 2);
  assert.equal(findRestaurantDish(menus, 'centro', dishSlug(papaItem)), undefined);
  assert.equal(findRestaurantDish(menus, 'papapasta', dishSlug(item)), undefined);
  assert.equal(dishes[1].price, '49');
  assert.deepEqual(dishes[1].allergens, ['gluten']);
  assert.equal(new URL(String(dishMetadata(dishes[0]).metadataBase)).origin, 'https://papapasta.pl');
  assert.equal(dishStructuredData(dishes[0]).url, 'https://papapasta.pl' + dishes[0].href);
  const html = renderToStaticMarkup(<MenuList variant="papapasta" groups={[{ id: 'g', items: [papaItem] }]} columns={2}/>);
  assert.ok(html.includes(`href="${dishPath(papaItem)}"`));
  assert.ok(!html.includes('class="columns"'));
  const recHtml = renderToStaticMarkup(<Recommendations restaurantId="papapasta" items={[{ ...recommendation, description: 'Recommendation' }]}/>);
  assert.ok(recHtml.includes(`href="${dishPath(recommendation)}"`));
  const groups = [{ id: 'g', items: [{ ...papaItem, image: undefined }] }];
  assert.equal(renderToStaticMarkup(<MenuList groups={groups} columns={2}/>), renderToStaticMarkup(<MenuList variant="papapasta" groups={groups} columns={2}/>));
});
