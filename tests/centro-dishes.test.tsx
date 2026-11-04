import './helpers/register-styles.cjs';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { centroDishSlug, centroDishPath, listCentroDishes, findCentroDish, centroDishMetadata, centroDishStructuredData } from '../src/server/content/centro-dishes';
import MenuList from '../src/components/MenuList';
import Recommendations from '../src/components/Recommendations';
import JsonLd from '../src/components/JsonLd';
import type { EditorMenu, EditorItem } from '../src/types/admin';

const image = { src:'/images/centro/grilled-chicken-dish.jpg',width:1200,height:800,blurDataURL:'data:image/gif;base64,R0lGODlhAQABAAAAACw=',alt:'Carpaccio' };
const item:EditorItem = { allergens:[], id:'centro:main:carpaccio',name:'Carpaccio di manzo',portion:'230 g',price:'55',description:['A real menu description'],isNew:false,visible:true,imageId:null,imageAlt:'',image,sortOrder:0,groupId:'group' };
const menu:EditorMenu = { id:'centro:main',restaurantId:'centro',key:'main',title:'Menu główne',subtitle:'',version:1,categories:[{id:'category',label:'Przystawki',groups:[{id:'group',title:'',note:'',afterNote:'',items:[item]}]}] };

test('Dish URLs are readable, distinguish duplicate names and retain identity through renames', () => {
  assert.match(centroDishSlug(item),/^carpaccio-di-manzo-[a-f0-9]{12}$/);
  assert.match(centroDishSlug({...item,name:'Łosoś & żółta papryka'}),/^losos-zolta-papryka-/);
  assert.notEqual(centroDishPath(item),centroDishPath({...item,id:'centro:recommendations:carpaccio'}));
  const renamed = {...menu,categories:[{...menu.categories[0],groups:[{...menu.categories[0].groups[0],items:[{...item,name:'Renamed dish'}]}]}]};
  assert.equal(findCentroDish([renamed],centroDishSlug(item))?.name,'Renamed dish');
  assert.match(findCentroDish([renamed],centroDishSlug(item))!.href,/renamed-dish-/);
  assert.equal(findCentroDish([menu],'not-a-dish'),undefined);
});

test('Only visible Centro dishes with photos receive detail pages and sitemap entries', () => {
  const mixed = {...menu,categories:[{...menu.categories[0],groups:[{...menu.categories[0].groups[0],items:[item,{...item,id:'hidden',visible:false},{...item,id:'no-image',image:undefined}]}]}]};
  const dishes=listCentroDishes([mixed,{...menu,restaurantId:'papapasta'}]);
  assert.equal(dishes.length,1);
  assert.equal(dishes[0].category,'Przystawki');
});

test('Dish metadata has its own canonical and social image; schema preserves display-only prices', () => {
  const dish=listCentroDishes([menu])[0]; const metadata=centroDishMetadata(dish);
  assert.equal(metadata.alternates?.canonical,dish.href);
  assert.ok(String(metadata.title).includes(item.name));
  assert.equal(new URL(String(metadata.metadataBase)).origin,'https://centro.papapasta.pl');
  assert.equal((metadata.twitter as { card?: string })?.card,'summary_large_image');
  assert.equal(centroDishStructuredData(dish).offers?.priceCurrency,'PLN');
  for(const price of ['29/36','do wyboru','w cenie steków','']) assert.equal(centroDishStructuredData({...dish,price}).offers,undefined);
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

test('Centro image rows link to a dish page; Papa Pasta retains its existing photo viewer', () => {
  const groups=[{id:'group',items:[item]}];
  const centro=renderToStaticMarkup(<MenuList groups={groups} columns={2} variant="centro"/>);
  assert.ok(centro.includes(`href="${centroDishPath(item)}"`));
  const original=renderToStaticMarkup(<MenuList groups={groups}/>);
  assert.ok(original.includes('Powiększ zdjęcie:'));
  assert.ok(!original.includes(centroDishPath(item)));
});
