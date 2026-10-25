'use strict';
// The marketplace catalogue (categories, items, ready baskets) as edited in the admin panel (لوحة الإدارة ← المواد).
// Loaded right after market-data.js: the last saved version is applied at once from this browser's copy, then the server
// is asked whether there is a newer one, which is kept for the next page load. With nothing saved, market-data.js stays as it is.
// Only the public part travels here (names, prices, units, groups, pictures, specifications); cost, partners and stock stay on the server.
(function(){
const KEY='jahiz_market_v1';
const MK=typeof MARKET!=='undefined'?MARKET:null;
if(!MK)return;
const BUILT=JSON.parse(JSON.stringify(MK));
MK.DETAILS=MK.DETAILS||{};
// a saved catalogue is plain text only: drop anything that could become markup on the public pages
const clean=v=>typeof v==='string'?v.replace(/[<>"`]/g,''):Array.isArray(v)?v.map(clean):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[clean(k),clean(x)])):v;
const safeImg=u=>/^(https:\/\/|data:image\/(png|jpe?g|webp);base64,|assets\/[\w\/.-]+\.(png|jpe?g|webp)$)/i.test(u||'')?u:'';
// product pictures kept in the site (assets/products/...) are written from the site root; pages in en/ reach them one folder up
const ROOT=((document.currentScript||{}).src||'').replace(/assets\/market-store\.js.*$/,'');
const src=u=>/^assets\//.test(u||'')?ROOT+u:u||'';
// what the management hid (a category, a group, an item or a basket) is left out for visitors; the admin panel sets MARKET_ALL to see everything
function visible(m){const D=m.DETAILS||{},off=c=>(D[c]||{}).st==='hidden';
  return Object.assign({},m,{
    CATS:m.CATS.filter(c=>!c.hidden).map(c=>Object.assign({},c,{items:c.items.filter(i=>!off(i[0])&&!((c.groups||[])[i[6]]||[])[2])})).filter(c=>c.items.length),
    BASKETS:(m.BASKETS||[]).filter(b=>!b.hidden)})}
// items added to the site file (market-data.js) after this browser saved its copy are merged in, with their group and
// category, so a saved copy never hides new products; items the management deleted before saving stay deleted
// (the copy remembers which codes the site file had when it was saved)
const codesOf=m=>m.CATS.flatMap(c=>c.items.map(i=>i[0]));
function merge(m,known){const have=new Set(codesOf(m)),old=known?new Set(known):null;let n=0;
  BUILT.CATS.forEach(bc=>bc.items.forEach(i=>{if(have.has(i[0])||(old&&old.has(i[0])))return;
    let c=m.CATS.find(x=>x.code===bc.code);if(!c){c=Object.assign({},bc,{items:[]});m.CATS.push(c)}
    const g=(bc.groups||[])[i[6]];c.groups=c.groups||[];let k=g?c.groups.findIndex(x=>x[0]===g[0]):0;
    if(g&&k<0){c.groups.push(g.slice());k=c.groups.length-1}
    c.items.push(i.slice(0,6).concat(k<0?0:k));m.DETAILS=m.DETAILS||{};if(BUILT.DETAILS[i[0]])m.DETAILS[i[0]]=JSON.parse(JSON.stringify(BUILT.DETAILS[i[0]]));n++}));
  return n}
function use(c){if(!c||!c.market||!Array.isArray(c.market.CATS)||!c.market.CATS.length)return false;
  if(merge(c.market,c.codes))c.codes=codesOf(BUILT);
  const m=clean(c.market);Object.values(m.DETAILS||{}).forEach(d=>{if(d&&d.img)d.img=safeImg(d.img)});
  const v=window.MARKET_ALL?m:visible(m);
  ['CATS','BASKETS','DETAILS','KINDS','PERIODS','SETTINGS'].forEach(k=>{if(v[k])MK[k]=v[k]});return true}
let saved=null;try{saved=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
if(saved&&!use(saved))saved=null;
if(!saved&&!window.MARKET_ALL)Object.assign(MK,visible(MK));
window.MARKET_STORE={get ver(){return saved?saved.ver:''},BUILT,visible,clean,src,
  raw(){return JSON.parse(JSON.stringify(saved?saved.market:BUILT))},
  remember(c){saved=c&&c.market?{ver:c.ver||'',market:c.market,at:Date.now(),codes:codesOf(BUILT)}:null;
    try{if(saved)localStorage.setItem(KEY,JSON.stringify(saved));else localStorage.removeItem(KEY)}catch(e){}}};
// ask the server at most every 10 minutes; a newer version shows from the next page load
function refresh(){const C=window.JAHIZ_CONFIG||{},api=C.API;if(!api||C.SHARED_SERVER||(saved&&saved.at&&Date.now()-saved.at<6e5))return;
  fetch(api,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'market',ver:saved?saved.ver:''})})
   .then(r=>r.json()).then(j=>{if(!j||!j.ok||j.same)return;window.MARKET_STORE.remember(j.ver&&j.market?{ver:j.ver,market:j.market}:null)}).catch(()=>{})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh);else refresh();
})();
