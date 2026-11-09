import './helpers/register-styles.cjs';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { menuText } from '../src/utils/menuText';
import { promotionInputSchema, galleryInputSchema } from '../src/validation/site-content';
import { itemInputSchema } from '../src/validation/admin';
import { promotionPath, promotionDate } from '../src/types/content';
import DishBadges from '../src/components/DishBadges';
import MenuList from '../src/components/MenuList';
import { dishStructuredData } from '../src/server/content/dishes';

test('Menu currency is removed for prices and supplements, preserving labels, units and source data', () => {
  for (const [input,expected] of [['55 zł','55'],['29/36 PLN','29/36'],['sos + 8zł, bazylia 0zł','sos + 8, bazylia 0'],['12,50 zł / 100 ml','12,50 / 100 ml'],['w cenie steków','w cenie steków'],['złocisty sos','złocisty sos'],['9 PLN/kg','9/kg']]) assert.equal(menuText(input),expected);
  const groups=[{id:'g',note:'Dopłata 8zł',afterNote:'10 PLN / 100ml',items:[{id:'i',name:'Pasta',price:'55 zł',description:['sos + 8zł'],meatless:true,recommended:true,spicy:true}]}];
  for(const variant of ['papapasta','centro'] as const){const html=renderToStaticMarkup(<MenuList groups={groups} variant={variant}/>);assert.ok(!html.includes('zł'));assert.ok(!html.includes('PLN'));assert.ok(html.includes('Dania bez mięsa'));assert.ok(html.includes('Polecamy'));assert.ok(html.includes('Danie pikantne'));}
  assert.equal(groups[0].items[0].price,'55 zł');
  const schema=dishStructuredData({id:'i',name:'Pasta',restaurantId:'papapasta',category:'Pasta',menuTitle:'Menu',slug:'pasta-123',href:'/menu/pasta-123',price:'55',image:{src:'/test.jpg',width:1,height:1,alt:'',blurDataURL:''}});
  assert.equal(schema.offers?.priceCurrency,'PLN');
});
test('Dish badges are independent, labelled and absent by default', () => {
  assert.equal(renderToStaticMarkup(<DishBadges item={{}}/>),'');
  const html=renderToStaticMarkup(<DishBadges item={{meatless:true,recommended:true,spicy:true}}/>);
  assert.equal((html.match(/role="img"/g)??[]).length,3);
  assert.equal((html.match(/<svg/g)??[]).length,3);
  const input={menuId:'m',version:1,groupId:'g',name:'Dish',portion:'',price:'',description:'',isNew:false,visible:true,imageAlt:'',removeImage:false};
  assert.equal(itemInputSchema.parse(input).meatless,undefined);
  assert.equal(itemInputSchema.parse({...input,meatless:false,spicy:true}).meatless,false);
  assert.equal(itemInputSchema.safeParse({...input,recommended:'yes'}).success,false);
});
test('Promotion validation rejects bad dates, empty published articles and unknown block types', () => {
  const draft={title:'Promotion',date:'2026-11-09',body:[],published:false,imageAlt:'',removeImage:false};
  assert.ok(promotionInputSchema.safeParse(draft).success);
  assert.ok(!promotionInputSchema.safeParse({...draft,date:'2026-02-30'}).success);
  assert.ok(!promotionInputSchema.safeParse({...draft,published:true}).success);
  assert.ok(!promotionInputSchema.safeParse({...draft,body:[{type:'html',text:'<script/>'}]}).success);
  assert.ok(promotionInputSchema.safeParse({...draft,published:true,body:[{type:'paragraph',text:'Lunch'}]}).success);
  assert.ok(!galleryInputSchema.safeParse({restaurantId:'other',version:1,alt:'Photo',visible:true}).success);
});
test('Promotion URLs preserve the legacy lunch URL and Polish dates', () => {
  assert.equal(promotionPath({slug:'zestawy-obiadowe'}),'/zestawy-obiadowe');
  assert.equal(promotionPath({slug:'nowa-oferta-1234'}),'/promocje/nowa-oferta-1234');
  assert.equal(promotionDate('2025-10-28'),'28 października 2025');
});
