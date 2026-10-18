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
const safeImg=u=>/^(https:\/\/|data:image\/(png|jpe?g|webp);base64,)/i.test(u||'')?u:'';
// what the management hid (a category, a group, an item or a basket) is left out for visitors; the admin panel sets MARKET_ALL to see everything
function visible(m){const D=m.DETAILS||{},off=c=>(D[c]||{}).st==='hidden';
  return Object.assign({},m,{
    CATS:m.CATS.filter(c=>!c.hidden).map(c=>Object.assign({},c,{items:c.items.filter(i=>!off(i[0])&&!((c.groups||[])[i[6]]||[])[2])})).filter(c=>c.items.length),
    BASKETS:(m.BASKETS||[]).filter(b=>!b.hidden)})}
function use(c){if(!c||!c.market||!Array.isArray(c.market.CATS)||!c.market.CATS.length)return false;
  const m=clean(c.market);Object.values(m.DETAILS||{}).forEach(d=>{if(d&&d.img)d.img=safeImg(d.img)});
  const v=window.MARKET_ALL?m:visible(m);
  ['CATS','BASKETS','DETAILS','KINDS','PERIODS','SETTINGS'].forEach(k=>{if(v[k])MK[k]=v[k]});return true}
let saved=null;try{saved=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
if(saved&&!use(saved))saved=null;
if(!saved&&!window.MARKET_ALL)Object.assign(MK,visible(MK));
window.MARKET_STORE={get ver(){return saved?saved.ver:''},BUILT,visible,clean,
  raw(){return JSON.parse(JSON.stringify(saved?saved.market:BUILT))},
  remember(c){saved=c&&c.market?{ver:c.ver||'',market:c.market,at:Date.now()}:null;
    try{if(saved)localStorage.setItem(KEY,JSON.stringify(saved));else localStorage.removeItem(KEY)}catch(e){}}};
// ask the server at most every 10 minutes; a newer version shows from the next page load
function refresh(){const C=window.JAHIZ_CONFIG||{},api=C.API;if(!api||C.SHARED_SERVER||(saved&&saved.at&&Date.now()-saved.at<6e5))return;
  fetch(api,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'market',ver:saved?saved.ver:''})})
   .then(r=>r.json()).then(j=>{if(!j||!j.ok||j.same)return;window.MARKET_STORE.remember(j.ver&&j.market?{ver:j.ver,market:j.market}:null)}).catch(()=>{})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh);else refresh();
})();
