import './helpers/register-styles.cjs';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { ALLERGENS, ALLERGEN_IDS } from '../src/config/allergens';
import { allergensSchema, itemInputSchema } from '../src/validation/admin';
import AllergenList from '../src/components/AllergenList';
import AllergenPicker from '../src/components/Admin/AllergenPicker';
import DishCard from '../src/components/DishCard';
import { listDishes as listRestaurantDishes } from '../src/server/content/dishes';
import type { EditorMenu, EditorItem } from '../src/types/admin';

const item:EditorItem={ id:'centro:main:test',groupId:'group',name:'Test dish',portion:'230 g',price:'55',description:['Description'],visible:true,isNew:false,imageId:null,imageAlt:'',sortOrder:0,allergens:['milk','gluten','nuts'],image:{src:'/images/centro/grilled-chicken-dish.jpg',width:1200,height:800,blurDataURL:'data:image/gif;base64,R0lGODlhAQABAAAAACw=',alt:'Dish'} };
const menu:EditorMenu={ id:'centro:main',restaurantId:'centro',key:'main',title:'Menu',subtitle:'',version:1,categories:[{id:'category',label:'Przystawki',groups:[{id:'group',title:'',note:'',afterNote:'',items:[item]}]}] };
const input={menuId:menu.id,version:1,groupId:'group',name:'Dish',portion:'',price:'55',description:'',isNew:false,visible:true,imageAlt:'',removeImage:false};

test('Allergen validation distinguishes peanuts/tree nuts and normalizes duplicates',()=>{
  assert.equal(ALLERGEN_IDS.length,14);
  assert.equal(new Set(ALLERGEN_IDS).size,14);
  assert.equal(ALLERGENS.length,14);
  assert.deepEqual(allergensSchema.parse(['nuts','milk','milk','peanuts']),['milk','nuts','peanuts']);
  assert.equal(itemInputSchema.safeParse({...input,allergens:['unknown']}).success,false);
  assert.equal(itemInputSchema.safeParse({...input,allergens:'milk'}).success,false);
  assert.equal(itemInputSchema.parse(input).allergens,undefined);
  assert.deepEqual(itemInputSchema.parse({...input,allergens:[]}).allergens,[]);
});

test('Public allergen list is omitted when unassigned and has labelled decorative icons',()=>{
  assert.equal(renderToStaticMarkup(<AllergenList/>),'');
  assert.equal(renderToStaticMarkup(<AllergenList allergens={[]}/>),'');
  const html=renderToStaticMarkup(<AllergenList allergens={['nuts','milk','gluten','milk']}/>);
  assert.ok(html.includes('Alergeny:'));
  assert.ok(html.indexOf('Mleko')<html.indexOf('Gluten'));
  assert.ok(html.indexOf('Gluten')<html.indexOf('Orzechy'));
  assert.equal((html.match(/<li>/g)??[]).length,3);
  assert.equal((html.match(/aria-hidden="true"/g)??[]).length,3);
  assert.equal((renderToStaticMarkup(<AllergenList allergens={[...ALLERGEN_IDS]}/>).match(/<svg/g)??[]).length,14);
});

test('Admin picker restores checked selections and submits an explicit empty list',()=>{
  const html=renderToStaticMarkup(<AllergenPicker selected={['milk','peanuts']}/>);
  assert.equal((html.match(/type="checkbox"/g)??[]).length,14);
  assert.equal((html.match(/checked=""/g)??[]).length,2);
  assert.ok(html.includes('Tree nuts'));
  assert.ok(html.includes('Peanuts'));
  assert.equal((renderToStaticMarkup(<AllergenPicker/>).match(/checked=""/g)??[]).length,0);
});

test('Modal and standalone dish cards share allergen presentation; empty cards hide it',()=>{
  const dish=listDishes([menu])[0];
  for(const modal of [true,false]){
    const html=renderToStaticMarkup(<DishCard dish={dish} modal={modal}/>);
    assert.ok(html.includes('Alergeny:'));
    assert.ok(html.includes('Mleko'));
    assert.ok(!renderToStaticMarkup(<DishCard dish={{...dish,allergens:[]}} modal={modal}/>).includes('Alergeny:'));
  }
});

function listDishes(menus: Parameters<typeof listRestaurantDishes>[0]) { return listRestaurantDishes(menus, 'centro'); }
