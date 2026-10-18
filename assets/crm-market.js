'use strict';
// Admin: the marketplace catalogue (المواد والأصناف). Items with their full record (names, group, pack, size, weight, origin,
// quality, barcode, picture, cost, consumer price, partner, stock...), categories and their groups, and the ready daily, weekly
// and monthly baskets. Edits a working copy, then publishes it: with Jahiz's own server through 'saveMarket', otherwise to
// this browser only (market-store.js shows it on the home page here) with a file to download for the site.
// The public part lands in MARKET (market-data.js shape) plus MARKET.DETAILS; cost, partner, stock and notes stay in PRIV.
// Uses helpers from crm.js ($, esc, L, EN, fmt, toast, ask, S, CFG, REMOTE, isAdmin, VIEWS).
(function(){
if(typeof MARKET==='undefined'||!window.MARKET_STORE)return;
const PKEY='jahiz_market_priv',ONLINE=REMOTE&&!CFG.SHARED_SERVER;
let W=null,P=null,dirty=false,busy=false,edI=null,edB=null,edC=null;
const KINDS={food:L('مواد غذائية','Food'),goods:L('مواد ومستلزمات','Goods'),service:L('خدمات','Services')};
const ST={active:L('متاح','Available'),out:L('غير متوفر','Out of stock'),hidden:L('مخفي','Hidden')};
const ORIGIN=[['قطر','Qatar'],['السعودية','Saudi Arabia'],['الإمارات','UAE'],['عُمان','Oman'],['الكويت','Kuwait'],['البحرين','Bahrain'],['مصر','Egypt'],['الأردن','Jordan'],['لبنان','Lebanon'],['سوريا','Syria'],['تركيا','Turkey'],['إيران','Iran'],['الهند','India'],['باكستان','Pakistan'],['سريلانكا','Sri Lanka'],['بنغلاديش','Bangladesh'],['الصين','China'],['تايلاند','Thailand'],['فيتنام','Vietnam'],['ماليزيا','Malaysia'],['إندونيسيا','Indonesia'],['الفلبين','Philippines'],['اليابان','Japan'],['كوريا الجنوبية','South Korea'],['كينيا','Kenya'],['إثيوبيا','Ethiopia'],['جنوب أفريقيا','South Africa'],['المغرب','Morocco'],['تونس','Tunisia'],['إسبانيا','Spain'],['إيطاليا','Italy'],['فرنسا','France'],['اليونان','Greece'],['هولندا','Netherlands'],['بلجيكا','Belgium'],['ألمانيا','Germany'],['بولندا','Poland'],['الدنمارك','Denmark'],['أيرلندا','Ireland'],['المملكة المتحدة','United Kingdom'],['أوكرانيا','Ukraine'],['الولايات المتحدة','United States'],['كندا','Canada'],['المكسيك','Mexico'],['البرازيل','Brazil'],['الأرجنتين','Argentina'],['تشيلي','Chile'],['أستراليا','Australia'],['نيوزيلندا','New Zealand']];
const QUALITY=[['ممتاز','Premium'],['درجة أولى','Grade A'],['درجة ثانية','Grade B'],['اقتصادي','Economy'],['عضوي','Organic'],['طازج محلي','Fresh local'],['مبرّد','Chilled'],['مجمّد','Frozen'],['أصلي بضمان الوكيل','Genuine, agent warranty'],['خدمة معتمدة','Accredited service']];
const STORE={dry:L('جاف (حرارة الغرفة)','Dry (room temperature)'),chilled:L('مبرّد 0 إلى 5°','Chilled 0 to 5°'),frozen:L('مجمّد -18°','Frozen -18°'),na:L('لا ينطبق','Not applicable')};
const enOf=(list,ar)=>(list.find(x=>x[0]===ar)||[])[1]||'';
const num=v=>v===''||v==null||isNaN(+v)?null:+v;
const money=v=>v==null?'':fmt(Math.round(v*100)/100);
const clone=o=>JSON.parse(JSON.stringify(o));
const cats=()=>W.CATS;
const catOf=code=>W.CATS.find(c=>c.items.some(i=>i[0]===code));
const findItem=code=>{for(const c of W.CATS){const i=c.items.find(x=>x[0]===code);if(i)return {c,i}}return null};
const D=code=>W.DETAILS[code]||(W.DETAILS[code]={});
const PR=code=>P[code]||(P[code]={});
const margin=(price,cost)=>price>0&&cost!=null?(price-cost)/price*100:null;
// the EAN-13 / UPC-A / EAN-8 check digit, so a mistyped barcode is caught before it is saved
function barcodeOk(b){if(!b)return true;if(!/^\d{8}$|^\d{12,13}$/.test(b))return false;const d=b.split('').map(Number),chk=d.pop();
  const s=d.reverse().reduce((a,x,i)=>a+x*(i%2?1:3),0);return (10-s%10)%10===chk}

// ---- loading and publishing ----
async function load(){busy=true;
  try{if(ONLINE){const j=await S.api('marketAdmin',{});W=j.ver&&j.market?j.market:MARKET_STORE.raw();P=j.priv||{}}
    else{W=MARKET_STORE.raw();try{P=JSON.parse(localStorage.getItem(PKEY)||'null')||{}}catch(e){P={}}}}
  catch(e){W=MARKET_STORE.raw();P={};toast(L('تعذّر جلب الكتالوج من الخادم، فُتحت النسخة المحفوظة في الموقع.','Could not load the catalogue from the server; showing the site copy.'))}
  W.DETAILS=W.DETAILS||{};W.BASKETS=W.BASKETS||[];W.PERIODS=W.PERIODS||MARKET_STORE.BUILT.PERIODS||{};W.KINDS=W.KINDS||MARKET_STORE.BUILT.KINDS;W.SETTINGS=Object.assign({minOrder:50},MARKET_STORE.BUILT.SETTINGS,W.SETTINGS);
  dirty=false;busy=false}
function changed(){dirty=true;state()}
function state(){document.querySelectorAll('.mkState').forEach(el=>{const n=W.CATS.reduce((a,c)=>a+c.items.length,0);
  el.textContent=(dirty?L('تعديلات غير منشورة · ','Unpublished changes · '):'')+L(`${W.CATS.length} قسماً، ${fmt(n)} صنفاً، ${W.BASKETS.length} سلال`,`${W.CATS.length} categories, ${fmt(n)} items, ${W.BASKETS.length} baskets`)});
  document.querySelectorAll('.mkSave,.mkUndo').forEach(b=>b.disabled=!dirty)}
async function publish(){if(!dirty)return;
  if(!await ask(ONLINE?L('نشر الكتالوج الآن؟ تظهر الأصناف والأسعار والسلال لزوار الموقع كما هي هنا، وتبقى التكلفة والمخزون وبيانات الشركاء داخل لوحة الإدارة فقط.','Publish the catalogue now? Visitors see the items, prices and baskets as they are here; cost, stock and partner details stay inside the admin panel.')
    :L('حفظ الكتالوج على هذا الجهاز؟ موقع جاهز يعمل الآن على خادم بصيرة المشترك، لذلك يظهر ما تحفظه في الصفحة الرئيسية على هذا المتصفح فقط. نزّل ملف الموقع بعد الحفظ ليُرفع على الموقع لكل الزوار.','Save the catalogue on this device? Jahiz runs on the shared Basira server for now, so what you save shows on the home page in this browser only. Download the site file afterwards to publish it for every visitor.'),{ok:ONLINE?L('نشر','Publish'):L('حفظ','Save')}))return;
  const pub={KINDS:W.KINDS,PERIODS:W.PERIODS,CATS:W.CATS,BASKETS:W.BASKETS,DETAILS:W.DETAILS,SETTINGS:W.SETTINGS};
  try{if(ONLINE){const j=await S.api('saveMarket',{market:pub,priv:P});if(!j.ok)throw new Error(j.code?L('رمز مكرر: ','Duplicate code: ')+j.code:j.error);MARKET_STORE.remember({ver:j.ver,market:pub})}
    else{MARKET_STORE.remember({ver:'local-'+Date.now(),market:pub});localStorage.setItem(PKEY,JSON.stringify(P))}
    dirty=false;state();toast(ONLINE?L('نُشر الكتالوج','Catalogue published'):L('حُفظ على هذا الجهاز','Saved on this device'))}
  catch(e){toast(L('تعذّر الحفظ: ','Could not save: ')+(e.message||e))}}
function download(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
// the same file the site is built from, so a developer can replace assets/market-data.js with it
function siteFile(){const head=['// كتالوج جاهز، مُصدَّر من لوحة الإدارة ← المواد والأصناف بتاريخ '+new Date().toISOString().slice(0,10)+'.','// يحل محل assets/market-data.js. التكلفة والمخزون وبيانات الشركاء غير موجودة هنا عمداً.'];
  const pub={SETTINGS:W.SETTINGS,KINDS:W.KINDS,PERIODS:W.PERIODS,CATS:W.CATS,BASKETS:W.BASKETS,COMMISSION:MARKET_STORE.BUILT.COMMISSION,TIERS:MARKET_STORE.BUILT.TIERS,DETAILS:W.DETAILS};
  return head.join('\n')+'\nconst MARKET = '+JSON.stringify(pub,null,1)+';\n'}
// a spreadsheet of every item with its full record (opens in Excel; UTF-8 with BOM so Arabic shows correctly)
const COLS=[['code','الرمز'],['cat','القسم'],['group','المجموعة'],['ar','الاسم بالعربية'],['en','الاسم بالإنجليزية'],['brand','العلامة التجارية'],['unit','الوحدة'],['pack','العبوة أو الوزن'],['size','الحجم أو الأبعاد'],['weight','وزن الشحن (كجم)'],['origin','بلد المنشأ'],['quality','الجودة'],['storage','التخزين'],['shelf','الصلاحية'],['barcode','الباركود'],['sku','رمز المخزون SKU'],['cost','التكلفة'],['price','سعر المستهلك'],['was','السعر قبل الخصم'],['margin','هامش الربح %'],['comm','عمولة جاهز %'],['partner','الشريك المنفّذ'],['stock','المخزون'],['reorder','حد إعادة الطلب'],['status','الحالة'],['img','الصورة']];
function rowsAll(){const out=[];W.CATS.forEach(c=>c.items.forEach(i=>{const d=W.DETAILS[i[0]]||{},p=P[i[0]]||{},g=(c.groups||[])[i[6]]||[];
  out.push({code:i[0],cat:c.ar,group:g[0]||'',ar:i[1],en:i[2],brand:d.brand||'',unit:i[4],pack:d.pack||'',size:d.size||'',weight:d.weight??'',origin:d.origin||'',quality:d.quality||'',storage:d.storage?STORE[d.storage]:'',shelf:d.shelf||'',barcode:d.barcode||'',sku:d.sku||'',
    cost:p.cost??'',price:i[3],was:d.was??'',margin:p.cost!=null?Math.round(margin(i[3],p.cost)):'',comm:p.comm??'',partner:p.partner||'',stock:p.stock??'',reorder:p.reorder??'',status:ST[d.st||'active'],img:d.img&&!d.img.startsWith('data:')?d.img:d.img?L('صورة مرفوعة','uploaded'):'',c,i,d,p})}));return out}
function csv(){const q=v=>{v=String(v??'');return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
  return '﻿'+[COLS.map(x=>x[1]).join(','),...rowsAll().map(r=>COLS.map(([k])=>q(r[k])).join(','))].join('\r\n')}

// ---- shared toolbar ----
function bar(title,extra){return `<div class="bar"><h2>${title}</h2><span class="sp"></span><span class="mute sm mkState"></span>
  <button class="btn sm pri mkSave" type="button">${ONLINE?L('حفظ ونشر','Save and publish'):L('حفظ','Save')}</button><button class="btn sm ghost mkUndo" type="button">${L('تراجع','Undo')}</button></div>
  ${ONLINE?'':`<p class="note sm mknote">${L('موقع جاهز يعمل الآن على خادم بصيرة المشترك، فيُحفظ الكتالوج على هذا الجهاز ويظهر في الصفحة الرئيسية على هذا المتصفح فقط. لنشره لكل الزوار نزّل «ملف الموقع» من تبويب التقارير وأرسله لفريق التطوير، أو شغّل خادماً مستقلاً لجاهز.','Jahiz runs on the shared Basira server for now, so the catalogue is saved on this device and shows on the home page in this browser only. To publish it for every visitor, download the site file from the reports tab and send it to the developers, or set up a separate Jahiz server.')}</p>`}${extra||''}`}
function wire(root){root.querySelectorAll('.mkSave').forEach(b=>b.onclick=publish);
  root.querySelectorAll('.mkUndo').forEach(b=>b.onclick=async()=>{if(!await ask(L('التراجع عن كل التعديلات غير المنشورة؟','Discard all unpublished changes?'),{ok:L('تراجع','Discard')}))return;await load();VIEWS[CUR]()});state()}
let CUR='mati';
async function ensure(v){CUR=v;if(!isAdmin())return false;if(!W&&!busy){await load()}return !!W}

// ---- items ----
const F={kind:'',cat:'',grp:'',st:'',q:'',sort:'code',page:0};
const PAGE=60;
function filtered(){const q=F.q.trim().toLowerCase();let r=rowsAll().filter(x=>(!F.kind||x.c.kind===F.kind)&&(!F.cat||x.c.code===F.cat)&&(F.grp===''||String(x.i[6])===F.grp)&&(!F.st||(x.d.st||'active')===F.st||(F.st==='low'&&x.p.stock!=null&&x.p.reorder!=null&&x.p.stock<=x.p.reorder)||(F.st==='nocost'&&x.p.cost==null))&&
  (!q||[x.code,x.ar,x.en,x.brand,x.barcode,x.sku,x.origin,x.partner,x.group].join(' ').toLowerCase().includes(q)));
  const k=F.sort;if(k!=='code')r.sort((a,b)=>k==='name'?a.ar.localeCompare(b.ar,'ar'):k==='price'?b.price-a.price:k==='margin'?(+a.margin||-1e9)-(+b.margin||-1e9):k==='stock'?(+a.stock||0)-(+b.stock||0):0);return r}
async function renderItems(){const v=$('v-mati');if(!await ensure('mati'))return;
  const cs=cats(),cc=cs.find(c=>c.code===F.cat);
  v.innerHTML=bar(L('الأصناف والخدمات','Items and services'))+`<div class="panel ctbar">
   <label>${L('النوع','Type')}<select id="miK"><option value="">${L('الكل','All')}</option>${Object.entries(KINDS).map(([k,n])=>`<option value="${k}" ${F.kind===k?'selected':''}>${n}</option>`).join('')}</select></label>
   <label>${L('القسم','Category')}<select id="miC"><option value="">${L('كل الأقسام','All categories')}</option>${cs.filter(c=>!F.kind||c.kind===F.kind).map(c=>`<option value="${c.code}" ${F.cat===c.code?'selected':''}>${esc(c.icon+' '+(EN?c.en:c.ar))}</option>`).join('')}</select></label>
   <label>${L('المجموعة','Group')}<select id="miG" ${cc?'':'disabled'}><option value="">${L('كل المجموعات','All groups')}</option>${cc?(cc.groups||[]).map((g,k)=>`<option value="${k}" ${F.grp===String(k)?'selected':''}>${esc(EN?g[1]:g[0])}</option>`).join(''):''}</select></label>
   <label>${L('الحالة','Status')}<select id="miS"><option value="">${L('الكل','All')}</option>${Object.entries(ST).map(([k,n])=>`<option value="${k}" ${F.st===k?'selected':''}>${n}</option>`).join('')}<option value="low" ${F.st==='low'?'selected':''}>${L('مخزون منخفض','Low stock')}</option><option value="nocost" ${F.st==='nocost'?'selected':''}>${L('بلا تكلفة مسجلة','No cost entered')}</option></select></label>
   <label>${L('الترتيب','Sort')}<select id="miO">${[['code',L('الرمز','Code')],['name',L('الاسم','Name')],['price',L('السعر الأعلى','Highest price')],['margin',L('الهامش الأقل','Lowest margin')],['stock',L('المخزون الأقل','Lowest stock')]].map(([k,n])=>`<option value="${k}" ${F.sort===k?'selected':''}>${n}</option>`).join('')}</select></label>
   <label class="grow">${L('بحث','Search')}<input id="miQ" type="search" value="${esc(F.q)}" placeholder="${L('الاسم أو الرمز أو الباركود أو العلامة أو الشريك','Name, code, barcode, brand or partner')}"></label>
   <div class="acts"><button class="btn sm pri" type="button" id="miAdd">${L('إضافة صنف أو خدمة','Add item or service')}</button><button class="btn sm ghost" type="button" id="miBulk">${L('تعديل الأسعار بنسبة','Change prices by %')}</button></div></div>
   <div class="panel"><div id="miT" class="tbl"></div><div class="acts" id="miPg"></div></div>`;
  wire(v);drawItems();
  const re=()=>{F.page=0;renderItems()};
  $('miK').onchange=e=>{F.kind=e.target.value;F.cat='';F.grp='';re()};$('miC').onchange=e=>{F.cat=e.target.value;F.grp='';re()};$('miG').onchange=e=>{F.grp=e.target.value;re()};
  $('miS').onchange=e=>{F.st=e.target.value;re()};$('miO').onchange=e=>{F.sort=e.target.value;re()};
  $('miQ').oninput=e=>{F.q=e.target.value;F.page=0;drawItems()};
  $('miAdd').onclick=()=>openItem(null);$('miBulk').onclick=bulkPrice}
function drawItems(){const r=filtered(),n=r.length,pages=Math.max(1,Math.ceil(n/PAGE));F.page=Math.min(F.page,pages-1);const part=r.slice(F.page*PAGE,F.page*PAGE+PAGE);
  $('miT').innerHTML=n?`<table class="mktbl"><thead><tr><th></th><th>${L('الرمز','Code')}</th><th>${L('الصنف','Item')}</th><th>${L('المجموعة','Group')}</th><th>${L('العبوة والوحدة','Pack and unit')}</th><th class="num">${L('التكلفة','Cost')}</th><th class="num">${L('سعر المستهلك','Consumer price')}</th><th class="num">${L('الهامش','Margin')}</th><th class="num">${L('المخزون','Stock')}</th><th>${L('الحالة','Status')}</th><th></th></tr></thead><tbody>${part.map(x=>{const m=x.p.cost!=null?margin(x.price,x.p.cost):null,low=x.p.stock!=null&&x.p.reorder!=null&&x.p.stock<=x.p.reorder,st=x.d.st||'active';
    return `<tr class="${st==='hidden'?'muted':''}"><td>${x.d.img?`<img class="mkph" src="${esc(x.d.img)}" alt="" width="36" height="36" loading="lazy">`:`<span class="mkph e">${x.c.icon}</span>`}</td><td class="code" dir="ltr">${x.code}</td><td><b>${esc(EN?x.en:x.ar)}</b>${x.d.feat?` <span class="pill">${L('مميز','Featured')}</span>`:''}<br><span class="mute sm">${esc([x.brand,x.origin,x.quality].filter(Boolean).join(' · '))}</span></td>
     <td class="sm">${esc(x.group)}</td><td class="sm">${esc([x.pack,x.unit].filter(Boolean).join(' · '))}</td><td class="num">${money(x.p.cost)}</td><td class="num"><b>${money(x.price)}</b>${x.d.was>x.price?`<br><s class="mute sm">${money(x.d.was)}</s>`:''}</td>
     <td class="num ${m!=null&&m<10?'bad':''}">${m==null?'<span class="mute">—</span>':Math.round(m)+'%'}</td><td class="num ${low?'bad':''}">${x.p.stock??''}</td><td><span class="mkst ${st}">${ST[st]}</span></td><td><button class="btn xs ghost" type="button" data-ie="${x.code}">${L('تعديل','Edit')}</button></td></tr>`}).join('')}</tbody></table>`:`<p class="mute">${L('لا توجد أصناف بهذا البحث.','No items match.')}</p>`;
  $('miPg').innerHTML=`<span class="mute sm">${L(`${fmt(n)} صنفاً`,`${fmt(n)} items`)}</span>`+(pages>1?`<span class="sp"></span>${Array.from({length:pages},(_,k)=>`<button class="btn xs ${k===F.page?'pri':'ghost'}" type="button" data-pg="${k}">${k+1}</button>`).join('')}`:'');
  $('miT').onclick=e=>{const b=e.target.closest('[data-ie]');if(b)openItem(b.dataset.ie)};
  $('miPg').onclick=e=>{const b=e.target.closest('[data-pg]');if(b){F.page=+b.dataset.pg;drawItems()}}}
async function bulkPrice(){const r=filtered();if(!r.length)return;
  const v=await ask(L(`تغيير سعر المستهلك لـ ${r.length} صنفاً (حسب البحث والتصفية الحالية) بنسبة مئوية. اكتب مثلاً 5 للزيادة أو -10 للتخفيض:`,`Change the consumer price of ${r.length} items (the current filter) by a percentage. Type 5 to raise or -10 to lower:`),{input:true,ok:L('تطبيق','Apply')});
  const pc=num(v);if(pc==null||pc<=-100||pc>500)return;r.forEach(x=>{x.i[3]=Math.max(0,Math.round(x.i[3]*(1+pc/100)*4)/4)});changed();drawItems();toast(L('عُدّلت الأسعار، راجعها ثم احفظ.','Prices changed; review them, then save.'))}

// ---- the item dialog: every field of a product or a service ----
function dlg(id,html){let d=$(id);if(!d){d=document.createElement('dialog');d.id=id;document.body.appendChild(d)}d.innerHTML=html;return d}
const opt=(list,val)=>list.map(([k,n])=>`<option value="${esc(k)}" ${k===val?'selected':''}>${esc(n)}</option>`).join('');
function nextCode(c){let n=0;c.items.forEach(i=>{const m=/-(\d+)$/.exec(i[0]);if(m)n=Math.max(n,+m[1])});const all=new Set(W.CATS.flatMap(x=>x.items.map(i=>i[0])));
  let k=n+1,code;do{code=c.code+'-'+String(k).padStart(2,'0');k++}while(all.has(code));return code}
function openItem(code){const at=code?findItem(code):null,c=at?at.c:(cats().find(x=>x.code===F.cat)||cats()[0]),i=at?at.i:[nextCode(c),'','',0,'','',F.grp!==''&&F.cat===c.code?+F.grp:0],d=Object.assign({},W.DETAILS[i[0]]||{}),p=Object.assign({},P[i[0]]||{});
  edI=at?i[0]:null;
  const svc=c.kind==='service';
  const g=(lab,inner,cls)=>`<label class="${cls||''}">${lab}${inner}</label>`;
  const inp=(name,val,attrs)=>`<input name="${name}" value="${esc(val??'')}" ${attrs||''}>`;
  const d0=dlg('dlgMi',`<form class="dlg crmform mkform" id="fMi" method="dialog">
  <h3>${at?L('تعديل','Edit')+' '+esc(i[0]):L('صنف أو خدمة جديدة','New item or service')}</h3>
  <fieldset><legend>${L('البيانات الأساسية','Basics')}</legend>
   <div class="grid3">${g(L('القسم','Category'),`<select name="cat">${cats().map(x=>`<option value="${x.code}" ${x.code===c.code?'selected':''}>${esc(x.icon+' '+(EN?x.en:x.ar))}</option>`).join('')}</select>`)}
    ${g(L('المجموعة','Group'),`<select name="grp"></select>`)}${g(L('الرمز','Code'),inp('code',i[0],'required dir="ltr" pattern="[A-Z]{2}-\\d{2,4}"'))}</div>
   <div class="grid2">${g(L('الاسم بالعربية','Arabic name'),inp('ar',i[1],'required maxlength="120"'))}${g(L('الاسم بالإنجليزية','English name'),inp('en',i[2],'dir="ltr" maxlength="120"'))}</div>
   <div class="grid2">${g(L('الوصف بالعربية','Arabic description'),`<textarea name="desc_ar" rows="2" maxlength="600">${esc(d.desc_ar||'')}</textarea>`)}${g(L('الوصف بالإنجليزية','English description'),`<textarea name="desc_en" rows="2" dir="ltr" maxlength="600">${esc(d.desc_en||'')}</textarea>`)}</div>
   <div class="grid3">${g(svc?L('مقدم الخدمة أو العلامة','Provider or brand'):L('العلامة التجارية','Brand'),inp('brand',d.brand))}${g(L('الحالة','Status'),`<select name="st">${opt(Object.entries(ST),d.st||'active')}</select>`)}
    <label class="chk"><input type="checkbox" name="feat" ${d.feat?'checked':''}> ${L('صنف مميز (يظهر بإطار مميز)','Featured (highlighted)')}</label></div></fieldset>
  <fieldset><legend>${L('التسعير','Pricing')}</legend>
   <div class="grid4">${g(L('التكلفة (ر.ق)','Cost (QAR)'),inp('cost',p.cost,'type="number" min="0" step="0.01"'))}${g(L('سعر المستهلك (ر.ق)','Consumer price (QAR)'),inp('price',i[3],'type="number" min="0" step="0.01" required'))}
    ${g(L('السعر قبل الخصم','Price before offer'),inp('was',d.was,'type="number" min="0" step="0.01"'))}${g(L('عمولة جاهز من الشريك %','Jahiz commission %'),inp('comm',p.comm,'type="number" min="0" max="100" step="0.5"'))}</div>
   <p class="mute sm" id="miCalc"></p>
   <div class="grid2">${g(L('الوحدة بالعربية','Arabic unit'),inp('uar',i[4],`required placeholder="${L('للكيلو','للكيلو')}" list="mkUnitsAr"`))}${g(L('الوحدة بالإنجليزية','English unit'),inp('uen',i[5],'dir="ltr" placeholder="per kg" list="mkUnitsEn"'))}</div></fieldset>
  <fieldset><legend>${svc?L('تفاصيل الخدمة','Service details'):L('العبوة والمواصفات','Pack and specifications')}</legend>
   <div class="grid3">${g(svc?L('ما تشمله الخدمة','What is included'):L('العبوة أو الوزن','Pack or weight'),inp('pack',d.pack,`placeholder="${svc?L('مثال: زيارة 4 ساعات مع المواد','e.g. 4-hour visit with supplies'):L('مثال: كيس 5 كجم','e.g. 5 kg bag')}"`))}
    ${g(L('بالإنجليزية','In English'),inp('pack_en',d.pack_en,'dir="ltr"'))}${g(svc?L('المدة','Duration'):L('الحجم أو الأبعاد','Size or dimensions'),inp('size',d.size,`placeholder="${svc?L('مثال: 3 ساعات','e.g. 3 hours'):L('مثال: 30×20×10 سم أو 1.5 لتر','e.g. 30×20×10 cm or 1.5 L')}"`))}</div>
   <div class="grid4">${svc?'':g(L('وزن الشحن (كجم)','Shipping weight (kg)'),inp('weight',d.weight,'type="number" min="0" step="0.01"'))}
    ${g(svc?L('بلد مقدم الخدمة','Provider country'):L('بلد المنشأ','Country of origin'),inp('origin',d.origin,'list="mkOrigin"'))}${g(L('الجودة أو الدرجة','Quality or grade'),inp('quality',d.quality,'list="mkQuality"'))}
    ${svc?g(L('الضمان','Warranty'),inp('warranty',d.warranty,`placeholder="${L('مثال: 3 أشهر على العمل','e.g. 3 months on labour')}"`)):g(L('التخزين','Storage'),`<select name="storage"><option value="">—</option>${opt(Object.entries(STORE),d.storage||'')}</select>`)}</div>
   ${svc?'':`<div class="grid3">${g(L('مدة الصلاحية','Shelf life'),inp('shelf',d.shelf,`placeholder="${L('مثال: 7 أيام مبرداً','e.g. 7 days chilled')}"`))}<label class="chk"><input type="checkbox" name="halal" ${d.halal?'checked':''}> ${L('حلال بشهادة','Certified halal')}</label>${g(L('المكونات أو الحساسية','Ingredients or allergens'),inp('allergens',d.allergens))}</div>`}</fieldset>
  <fieldset><legend>${L('التعريف والصورة','Identification and picture')}</legend>
   <div class="grid2">${g(L('مقارنة الأسعار مع منتج (رمز المنتج الأساسي)','Compare prices with product (base item code)'),inp('fam',d.fam,`dir="ltr" list="mkFam" placeholder="${L('مثال: FV-01 لكل أنواع الطماطم','e.g. FV-01 for every tomato')}"`))}<p class="mute sm">${L('الأصناف التي تحمل الرمز نفسه تظهر للعميل في بطاقة واحدة يختار منها المنشأ والجودة ويقارن أسعارها.','Items sharing this code show to customers as one card where they pick the origin and quality and compare prices.')}</p></div>
   <div class="grid3">${g(L('الباركود (EAN أو UPC)','Barcode (EAN or UPC)'),inp('barcode',d.barcode,'dir="ltr" inputmode="numeric" maxlength="13"'))}${g(L('رمز المخزون SKU','SKU'),inp('sku',d.sku,'dir="ltr"'))}${g(L('كلمات للبحث','Search keywords'),inp('tags',d.tags))}</div>
   <div class="grid2">${g(L('رابط الصورة (https)','Picture link (https)'),inp('img',d.img&&!d.img.startsWith('data:')?d.img:'','dir="ltr" placeholder="https://"'))}
    <label>${L('أو ارفع صورة من جهازك','Or upload a picture')}<input type="file" name="imgf" accept="image/png,image/jpeg,image/webp"></label></div>
   <div class="mkprev" id="miPrev">${d.img?`<img src="${esc(d.img)}" alt="" width="96" height="96"><button class="btn xs ghost" type="button" id="miNoImg">${L('إزالة الصورة','Remove picture')}</button>`:''}</div></fieldset>
  <fieldset><legend>${L('التوريد والمخزون (داخلي، لا يظهر للزوار)','Supply and stock (internal, not shown to visitors)')}</legend>
   <div class="grid3">${g(L('الشريك المنفّذ','Fulfilling partner'),inp('partner',p.partner))}${g(L('رمز الصنف لدى الشريك','Partner item code'),inp('pcode',p.pcode,'dir="ltr"'))}${g(L('مدة التجهيز','Lead time'),inp('lead',d.lead,`placeholder="${L('مثال: نفس اليوم','e.g. same day')}"`))}</div>
   <div class="grid4">${g(L('المخزون المتاح','Stock on hand'),inp('stock',p.stock,'type="number" step="1"'))}${g(L('حد إعادة الطلب','Reorder level'),inp('reorder',p.reorder,'type="number" min="0" step="1"'))}
    ${g(L('أقل كمية للطلب','Minimum order'),inp('min',d.min,'type="number" min="0" step="0.25"'))}${g(L('أكبر كمية للطلب','Maximum order'),inp('max',d.max,'type="number" min="0" step="1"'))}</div>
   ${g(L('ملاحظات داخلية','Internal notes'),`<textarea name="notes" rows="2">${esc(p.notes||'')}</textarea>`)}
   ${p.upd?`<p class="mute sm">${L('آخر تعديل: ','Last changed: ')}${esc(p.upd)}</p>`:''}</fieldset>
  <datalist id="mkFam">${W.CATS.flatMap(x=>x.items).filter(x=>x[1]===i[1]||x[0]===(d.fam||'')).map(x=>`<option value="${x[0]}">${esc(x[1]+' · '+((W.DETAILS[x[0]]||{}).origin||''))}</option>`).join('')}</datalist>
  <datalist id="mkOrigin">${ORIGIN.map(o=>`<option value="${EN?o[1]:o[0]}">`).join('')}</datalist><datalist id="mkQuality">${QUALITY.map(o=>`<option value="${EN?o[1]:o[0]}">`).join('')}</datalist>
  <datalist id="mkUnitsAr">${[...new Set(W.CATS.flatMap(x=>x.items.map(i=>i[4])))].slice(0,80).map(u=>`<option value="${esc(u)}">`).join('')}</datalist><datalist id="mkUnitsEn">${[...new Set(W.CATS.flatMap(x=>x.items.map(i=>i[5])))].slice(0,80).map(u=>`<option value="${esc(u)}">`).join('')}</datalist>
  <p class="err" id="miErr"></p>
  <div class="contact"><button class="btn pri" value="save">${L('حفظ','Save')}</button><button class="btn ghost" value="cancel" formnovalidate>${L('إلغاء','Cancel')}</button><span class="sp"></span>${at?`<button class="btn ghost" type="button" id="miDup">${L('نسخ كصنف جديد','Duplicate')}</button><button class="btn ghost danger" type="button" id="miDel">${L('حذف','Delete')}</button>`:''}</div></form>`);
  const f=$('fMi'),E=f.elements;let img=d.img||'';
  const groupsOf=cc=>(cc.groups&&cc.groups.length?cc.groups:[[L('عام','General'),'General']]);
  const fillG=(cc,sel)=>{E.grp.innerHTML=groupsOf(cc).map((x,k)=>`<option value="${k}" ${k===sel?'selected':''}>${esc(EN?x[1]:x[0])}</option>`).join('')};
  fillG(c,i[6]|0);
  E.cat.onchange=()=>{const cc=cats().find(x=>x.code===E.cat.value);fillG(cc,0);if(!at)E.code.value=nextCode(cc)};
  const calc=()=>{const cost=num(E.cost.value),pr=num(E.price.value),cm=num(E.comm.value);const m=margin(pr,cost);
    $('miCalc').textContent=[m!=null?L(`هامش الربح: ${money(pr-cost)} ر.ق (${Math.round(m)}%)`,`Margin: QAR ${money(pr-cost)} (${Math.round(m)}%)`):'',cm!=null&&pr?L(`عمولة جاهز التقديرية: ${money(pr*cm/100)} ر.ق للوحدة`,`Estimated Jahiz commission: QAR ${money(pr*cm/100)} per unit`):''].filter(Boolean).join(' · ')};
  ['cost','price','comm'].forEach(k=>E[k].oninput=calc);calc();
  E.origin.onchange=E.quality.onchange=()=>{};
  E.imgf.onchange=async()=>{const fl=E.imgf.files[0];if(!fl)return;try{img=await shrink(fl);E.img.value='';$('miPrev').innerHTML=`<img src="${img}" alt="" width="96" height="96">`}catch(e){toast(L('تعذّر قراءة الصورة','Could not read the picture'))}};
  E.img.oninput=()=>{img=E.img.value.trim();$('miPrev').innerHTML=/^https:\/\//.test(img)?`<img src="${esc(img)}" alt="" width="96" height="96">`:''};
  const noImg=$('miNoImg');if(noImg)noImg.onclick=()=>{img='';E.img.value='';$('miPrev').innerHTML=''};
  if(at){$('miDel').onclick=async()=>{d0.close();if(!await ask(L(`حذف ${i[0]} «${i[1]}» نهائياً؟ لإيقافه مؤقتاً اجعل حالته «مخفي» بدلاً من حذفه. يُزال من السلال الجاهزة أيضاً.`,`Delete ${i[0]} for good? To pause it, set its status to Hidden instead. It is also removed from ready baskets.`),{ok:L('حذف','Delete')}))return;
      c.items.splice(c.items.indexOf(i),1);delete W.DETAILS[i[0]];delete P[i[0]];W.BASKETS.forEach(b=>b.items=b.items.filter(x=>x[0]!==i[0]));changed();renderItems()};
    $('miDup').onclick=()=>{d0.close();const cp=i.slice();cp[0]=nextCode(c);cp[1]=i[1]+' '+L('(نسخة)','(copy)');c.items.splice(c.items.indexOf(i)+1,0,cp);W.DETAILS[cp[0]]=clone(W.DETAILS[i[0]]||{});P[cp[0]]=clone(P[i[0]]||{});delete W.DETAILS[cp[0]].barcode;changed();openItem(cp[0])}}
  f.onsubmit=e=>{if(e.submitter&&e.submitter.value==='cancel')return;e.preventDefault();$('miErr').textContent='';
    const code=E.code.value.trim().toUpperCase(),cc=cats().find(x=>x.code===E.cat.value);
    if(code!==edI&&findItem(code)){$('miErr').textContent=L('هذا الرمز مستخدم لصنف آخر.','This code is already used.');return}
    if(W.BASKETS.some(b=>b.code===code)){$('miErr').textContent=L('هذا الرمز مستخدم لسلة.','This code is used by a basket.');return}
    const bc=E.barcode.value.trim();if(!barcodeOk(bc)){$('miErr').textContent=L('الباركود غير صحيح: تأكد من الأرقام (8 أو 12 أو 13 رقماً) ورقم التحقق الأخير.','The barcode is not valid: check the digits (8, 12 or 13) and the last check digit.');return}
    if(bc){const dup=Object.entries(W.DETAILS).find(([k,v])=>v&&v.barcode===bc&&k!==edI);if(dup){$('miErr').textContent=L(`الباركود مسجل للصنف ${dup[0]}.`,`Barcode already on ${dup[0]}.`);return}}
    const fm=E.fam.value.trim().toUpperCase();if(fm&&fm!==code&&fm!==edI&&!findItem(fm)){$('miErr').textContent=L('رمز المنتج الأساسي للمقارنة غير موجود.','The base item code to compare with does not exist.');return}
    const pr=num(E.price.value),cost=num(E.cost.value);if(pr==null){$('miErr').textContent=L('اكتب سعر المستهلك.','Enter the consumer price.');return}
    if(cost!=null&&cost>pr&&!confirm(L('التكلفة أعلى من سعر المستهلك، أي أن الصنف يُباع بخسارة. هل تريد الحفظ؟','The cost is above the consumer price, so it sells at a loss. Save anyway?')))return;
    if(img.length>110000){$('miErr').textContent=L('الصورة كبيرة، اختر صورة أصغر أو ضع رابطها.','The picture is too large; choose a smaller one or use a link.');return}
    const row=[code,E.ar.value.trim(),E.en.value.trim()||E.ar.value.trim(),pr,E.uar.value.trim(),E.uen.value.trim()||E.uar.value.trim(),+E.grp.value||0];
    if(at){const oc=at.c;oc.items.splice(oc.items.indexOf(i),1,...(oc===cc?[row]:[]));if(oc!==cc)cc.items.push(row);
      if(code!==edI){W.DETAILS[code]=W.DETAILS[edI]||{};delete W.DETAILS[edI];P[code]=P[edI]||{};delete P[edI];W.BASKETS.forEach(b=>b.items.forEach(x=>{if(x[0]===edI)x[0]=code}))}}
    else cc.items.push(row);
    if(!cc.groups||!cc.groups.length)cc.groups=[[L('عام','General'),'General']];
    const dd={};['fam','desc_ar','desc_en','brand','pack','pack_en','size','origin','quality','warranty','storage','shelf','allergens','barcode','sku','tags','lead'].forEach(k=>{if(E[k]&&E[k].value.trim())dd[k]=E[k].value.trim()});
    if(dd.fam){dd.fam=dd.fam.toUpperCase();if(dd.fam===edI)dd.fam=code;}
    if(code!==edI&&edI)Object.values(W.DETAILS).forEach(x=>{if(x&&x.fam===edI)x.fam=code});
    if(dd.origin)dd.origin_en=enOf(ORIGIN,dd.origin)||dd.origin;if(dd.quality)dd.quality_en=enOf(QUALITY,dd.quality)||dd.quality;
    ['weight','was','min','max'].forEach(k=>{if(E[k]&&num(E[k].value)!=null)dd[k]=num(E[k].value)});
    if(E.halal&&E.halal.checked)dd.halal=1;if(E.feat.checked)dd.feat=1;if(E.st.value!=='active')dd.st=E.st.value;if(img)dd.img=img;
    W.DETAILS[code]=dd;if(!Object.keys(dd).length)delete W.DETAILS[code];
    const pp={};['cost','comm','stock','reorder'].forEach(k=>{if(num(E[k].value)!=null)pp[k]=num(E[k].value)});['partner','pcode','notes'].forEach(k=>{if(E[k].value.trim())pp[k]=E[k].value.trim()});
    pp.upd=new Date().toISOString().slice(0,16).replace('T',' ')+(window.ME&&ME.name?' · '+ME.name:'');P[code]=pp;
    d0.close();changed();if(CUR==='mati')drawItems();else VIEWS[CUR]();toast(L('حُفظ الصنف، ولا تنس النشر.','Item saved; remember to publish.'))};
  d0.showModal()}
// pictures are made small (at most 360 px, jpeg) so the catalogue stays light for visitors
function shrink(file){return new Promise((res,rej)=>{const r=new FileReader();r.onerror=rej;r.onload=()=>{const im=new Image();im.onerror=rej;im.onload=()=>{const k=Math.min(1,360/Math.max(im.width,im.height)),cv=document.createElement('canvas');
  cv.width=Math.round(im.width*k);cv.height=Math.round(im.height*k);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);let q=.8,u;do{u=cv.toDataURL('image/jpeg',q);q-=.1}while(u.length>60000&&q>.3);res(u)};im.src=r.result};r.readAsDataURL(file)})}

// ---- categories and their groups ----
async function renderCats(){const v=$('v-matg');if(!await ensure('matg'))return;
  v.innerHTML=bar(L('الأقسام والمجموعات','Categories and groups'))+`<p class="mute sm">${L('كل قسم له نوع (مواد غذائية أو مستلزمات أو خدمات) ومجموعات داخلية مثل الخضار والفواكه والورقيات. القسم أو المجموعة المخفية لا تظهر للزوار وتبقى محفوظة.','Each category has a type (food, goods or services) and inner groups such as vegetables, fruit and greens. A hidden category or group is kept but not shown.')}</p>
  <div class="acts"><button class="btn sm pri" type="button" id="mgAdd">${L('إضافة قسم','Add category')}</button></div>
  ${Object.entries(KINDS).map(([k,n])=>`<div class="panel"><h3>${n}</h3><div class="tbl"><table class="mktbl"><thead><tr><th></th><th>${L('الرمز','Code')}</th><th>${L('القسم','Category')}</th><th>${L('المجموعات','Groups')}</th><th class="num">${L('الأصناف','Items')}</th><th class="num">${L('يبدأ من','From')}</th><th></th></tr></thead><tbody>
   ${cats().filter(c=>c.kind===k).map(c=>`<tr class="${c.hidden?'muted':''}"><td class="mkic">${c.icon}</td><td class="code" dir="ltr">${c.code}</td><td><b>${esc(EN?c.en:c.ar)}</b>${c.hidden?` <span class="pill">${L('مخفي','Hidden')}</span>`:''}<br><span class="mute sm">${esc(EN?c.about_en:c.about_ar)}</span></td>
    <td class="sm">${(c.groups||[]).map(g=>`<span class="chip${g[2]?' off':''}">${esc(EN?g[1]:g[0])} <span class="num">${c.items.filter(i=>(c.groups||[]).indexOf(g)===i[6]).length}</span></span>`).join(' ')}</td>
    <td class="num">${c.items.length}</td><td class="num">${c.items.length?money(Math.min(...c.items.map(i=>i[3]))):''}</td><td><button class="btn xs ghost" type="button" data-ce="${c.code}">${L('تعديل','Edit')}</button> <button class="btn xs ghost" type="button" data-cv="${c.code}">${L('الأصناف','Items')}</button></td></tr>`).join('')}</tbody></table></div></div>`).join('')}`;
  wire(v);$('mgAdd').onclick=()=>openCat(null);
  v.onclick=e=>{const b=e.target.closest('[data-ce]');if(b)openCat(b.dataset.ce);const s=e.target.closest('[data-cv]');if(s){Object.assign(F,{kind:'',cat:s.dataset.cv,grp:'',q:'',page:0});go('mati')}}}
function openCat(code){const c=code?cats().find(x=>x.code===code):null;edC=c;
  const d0=dlg('dlgMg',`<form class="dlg crmform mkform" id="fMg" method="dialog"><h3>${c?L('تعديل القسم','Edit category'):L('قسم جديد','New category')}</h3>
   <div class="grid4"><label>${L('الرمز (حرفان)','Code (2 letters)')}<input name="code" required pattern="[A-Z]{2}" maxlength="2" dir="ltr" value="${c?c.code:''}" ${c?'readonly':''}></label><label>${L('النوع','Type')}<select name="kind">${opt(Object.entries(KINDS),c?c.kind:'food')}</select></label>
    <label>${L('الرمز التعبيري','Icon')}<input name="icon" maxlength="4" value="${esc(c?c.icon:'🛍️')}"></label><label class="chk"><input type="checkbox" name="hidden" ${c&&c.hidden?'checked':''}> ${L('مخفي عن الزوار','Hidden from visitors')}</label></div>
   <div class="grid2"><label>${L('الاسم بالعربية','Arabic name')}<input name="ar" required value="${esc(c?c.ar:'')}"></label><label>${L('الاسم بالإنجليزية','English name')}<input name="en" dir="ltr" value="${esc(c?c.en:'')}"></label></div>
   <div class="grid2"><label>${L('نبذة بالعربية','Arabic summary')}<textarea name="about_ar" rows="2">${esc(c?c.about_ar:'')}</textarea></label><label>${L('نبذة بالإنجليزية','English summary')}<textarea name="about_en" rows="2" dir="ltr">${esc(c?c.about_en:'')}</textarea></label></div>
   <label>${L('المجموعات بالترتيب: سطر لكل مجموعة بالشكل «الاسم بالعربية | English name»، وأضف « | مخفي» لإخفاء مجموعة','Groups in order: one per line as “Arabic name | English name”, add “ | hidden” to hide one')}<textarea name="groups" rows="6">${esc((c&&c.groups||[]).map(g=>g[0]+' | '+g[1]+(g[2]?' | '+L('مخفي','hidden'):'')).join('\n'))}</textarea></label>
   <p class="mute sm">${L('لا تحذف سطر مجموعة فيها أصناف؛ انقل أصنافها أولاً أو اجعلها مخفية. ترتيب السطور هو ترتيب العرض.','Do not delete a group line that has items; move them first or hide it. Line order is display order.')}</p>
   <p class="err" id="mgErr"></p>
   <div class="contact"><button class="btn pri" value="save">${L('حفظ','Save')}</button><button class="btn ghost" value="cancel" formnovalidate>${L('إلغاء','Cancel')}</button><span class="sp"></span>${c?`<button class="btn ghost danger" type="button" id="mgDel">${L('حذف القسم','Delete category')}</button>`:''}</div></form>`);
  const f=$('fMg'),E=f.elements;
  if(c)$('mgDel').onclick=async()=>{if(c.items.length){$('mgErr').textContent=L('القسم فيه أصناف: احذفها أو انقلها أولاً، أو اجعله مخفياً.','The category has items: delete or move them first, or hide it.');return}
    d0.close();if(!await ask(L('حذف هذا القسم؟','Delete this category?'),{ok:L('حذف','Delete')}))return;W.CATS.splice(W.CATS.indexOf(c),1);changed();renderCats()};
  f.onsubmit=e=>{if(e.submitter&&e.submitter.value==='cancel')return;e.preventDefault();const code=E.code.value.trim().toUpperCase();
    if(!c&&cats().some(x=>x.code===code)){$('mgErr').textContent=L('هذا الرمز مستخدم.','This code is used.');return}
    const gs=E.groups.value.split('\n').map(x=>x.split('|').map(y=>y.trim())).filter(x=>x[0]).map(x=>{const g=[x[0],x[1]||x[0]];if(x[2])g.push(1);return g});
    if(c&&gs.length<(c.groups||[]).length){const used=Math.max(-1,...c.items.map(i=>i[6]|0));if(used>=gs.length){$('mgErr').textContent=L('حذفت مجموعة فيها أصناف. انقل أصنافها أولاً.','You removed a group that has items. Move them first.');return}}
    const o=c||{code,items:[]};Object.assign(o,{kind:E.kind.value,icon:E.icon.value.trim()||'🛍️',ar:E.ar.value.trim(),en:E.en.value.trim()||E.ar.value.trim(),about_ar:E.about_ar.value.trim(),about_en:E.about_en.value.trim(),groups:gs.length?gs:[[L('عام','General'),'General']]});
    if(E.hidden.checked)o.hidden=1;else delete o.hidden;if(!c)W.CATS.push(o);d0.close();changed();renderCats()};
  d0.showModal()}

// ---- ready baskets (daily, weekly, monthly) ----
const listPrice=b=>b.items.reduce((a,[c,q])=>{const f=findItem(c);return a+(f?f.i[3]*q:0)},0);
const costOf=b=>b.items.reduce((a,[c,q])=>{const p=P[c]||{};return a==null||p.cost==null?null:a+p.cost*q},0);
async function renderBaskets(){const v=$('v-matb');if(!await ensure('matb'))return;
  v.innerHTML=bar(L('السلال الجاهزة','Ready baskets'))+`<p class="mute sm">${L('سلال يومية وأسبوعية وشهرية يختارها العميل بضغطة واحدة بدل اختيار كل صنف. سعر السلة = قيمة محتوياتها بسعر المستهلك ناقص نسبة الخصم، ويمكن تثبيت سعر يدوي.','Daily, weekly and monthly baskets a customer adds in one tap. Basket price = contents at consumer price less the discount, or a fixed price.')}</p>
  <div class="acts"><button class="btn sm pri" type="button" id="mbAdd">${L('إضافة سلة','Add basket')}</button></div>
  <div class="panel"><div class="tbl"><table class="mktbl"><thead><tr><th>${L('الرمز','Code')}</th><th>${L('السلة','Basket')}</th><th>${L('المدة','Period')}</th><th class="num">${L('الأصناف','Items')}</th><th class="num">${L('قيمة المحتويات','Contents value')}</th><th class="num">${L('الخصم','Discount')}</th><th class="num">${L('سعر السلة','Basket price')}</th><th class="num">${L('الهامش','Margin')}</th><th></th></tr></thead><tbody>
   ${W.BASKETS.map((b,k)=>{const lp=listPrice(b),co=costOf(b),m=co!=null?margin(b.price,co):null;return `<tr class="${b.hidden?'muted':''}"><td class="code" dir="ltr">${b.code}</td><td><b>${esc(EN?b.en:b.ar)}</b><br><span class="mute sm">${esc(EN?b.for_en:b.for_ar)}</span></td><td>${esc((W.PERIODS[b.period]||{})[EN?'en':'ar']||b.period)}</td>
    <td class="num">${b.items.length}</td><td class="num">${money(lp)}</td><td class="num">${b.disc||0}%</td><td class="num"><b>${money(b.price)}</b>${b.fixed?` <span class="pill">${L('ثابت','fixed')}</span>`:''}</td><td class="num ${m!=null&&m<10?'bad':''}">${m==null?'—':Math.round(m)+'%'}</td><td><button class="btn xs ghost" type="button" data-be="${k}">${L('تعديل','Edit')}</button></td></tr>`}).join('')}</tbody></table></div></div>`;
  wire(v);$('mbAdd').onclick=()=>openBasket(-1);v.onclick=e=>{const b=e.target.closest('[data-be]');if(b)openBasket(+b.dataset.be)}}
function openBasket(k){const b=k>=0?clone(W.BASKETS[k]):{code:'',period:'weekly',ar:'',en:'',for_ar:'',for_en:'',items:[],disc:5,price:0};edB=k;
  const d0=dlg('dlgMb',`<form class="dlg crmform mkform" id="fMb" method="dialog"><h3>${k>=0?L('تعديل السلة','Edit basket'):L('سلة جديدة','New basket')}</h3>
   <div class="grid4"><label>${L('الرمز','Code')}<input name="code" required pattern="SB-[A-Z0-9]{1,4}" dir="ltr" value="${esc(b.code||'SB-')}" placeholder="SB-W3"></label><label>${L('المدة','Period')}<select name="period">${opt(Object.entries(W.PERIODS).map(([p,x])=>[p,EN?x.en:x.ar]),b.period)}</select></label>
    <label>${L('الخصم %','Discount %')}<input name="disc" type="number" min="0" max="60" step="0.5" value="${b.disc||0}"></label><label class="chk"><input type="checkbox" name="hidden" ${b.hidden?'checked':''}> ${L('مخفية','Hidden')}</label></div>
   <div class="grid2"><label>${L('الاسم بالعربية','Arabic name')}<input name="ar" required value="${esc(b.ar)}"></label><label>${L('الاسم بالإنجليزية','English name')}<input name="en" dir="ltr" value="${esc(b.en)}"></label></div>
   <div class="grid2"><label>${L('لمن السلة بالعربية','Who it is for (Arabic)')}<input name="for_ar" value="${esc(b.for_ar)}" placeholder="${L('لأسرة من 4 إلى 6 أفراد','')}"></label><label>${L('بالإنجليزية','In English')}<input name="for_en" dir="ltr" value="${esc(b.for_en)}"></label></div>
   <fieldset><legend>${L('محتويات السلة','Contents')}</legend><div class="mkpick"><input type="search" id="mbQ" placeholder="${L('ابحث عن صنف لإضافته','Search an item to add')}"><div id="mbHits"></div></div><div id="mbList"></div></fieldset>
   <div class="grid3"><label class="chk"><input type="checkbox" name="fixed" ${b.fixed?'checked':''}> ${L('سعر ثابت يدوي','Fixed manual price')}</label><label>${L('سعر السلة (ر.ق)','Basket price (QAR)')}<input name="price" type="number" min="0" step="1" value="${b.price||0}"></label><p class="mute sm" id="mbCalc"></p></div>
   <p class="err" id="mbErr"></p>
   <div class="contact"><button class="btn pri" value="save">${L('حفظ','Save')}</button><button class="btn ghost" value="cancel" formnovalidate>${L('إلغاء','Cancel')}</button><span class="sp"></span>${k>=0?`<button class="btn ghost danger" type="button" id="mbDel">${L('حذف السلة','Delete basket')}</button>`:''}</div></form>`);
  const f=$('fMb'),E=f.elements;
  const calc=()=>{const lp=listPrice(b),disc=num(E.disc.value)||0,auto=Math.round(lp*(100-disc)/100);E.price.readOnly=!E.fixed.checked;if(!E.fixed.checked)E.price.value=auto;
    const co=costOf(b),pr=num(E.price.value)||0;$('mbCalc').textContent=L(`قيمة المحتويات ${money(lp)} ر.ق`,`Contents QAR ${money(lp)}`)+(co!=null?L(` · التكلفة ${money(co)} · الهامش ${Math.round(margin(pr,co)||0)}%`,` · cost ${money(co)} · margin ${Math.round(margin(pr,co)||0)}%`):'')};
  const draw=()=>{$('mbList').innerHTML=b.items.length?`<table class="mini"><tbody>${b.items.map(([c,q],n)=>{const x=findItem(c);return `<tr><td class="code" dir="ltr">${c}</td><td>${x?esc(EN?x.i[2]:x.i[1]):`<span class="bad">${L('صنف محذوف','deleted item')}</span>`}<br><span class="mute sm">${x?esc(x.i[4])+' · '+money(x.i[3]):''}</span></td><td><input type="number" min="0.05" step="0.05" value="${q}" data-bq="${n}" aria-label="${L('الكمية','Quantity')}" style="width:80px"></td><td class="num">${x?money(x.i[3]*q):''}</td><td><button class="btn xs ghost" type="button" data-br="${n}">${L('إزالة','Remove')}</button></td></tr>`}).join('')}</tbody></table>`:`<p class="mute">${L('أضف أصنافاً من البحث أعلاه.','Add items with the search above.')}</p>`;calc()};
  $('mbQ').oninput=e=>{const q=e.target.value.trim().toLowerCase();$('mbHits').innerHTML=q.length<2?'':rowsAll().filter(x=>(x.code+' '+x.ar+' '+x.en).toLowerCase().includes(q)).slice(0,8).map(x=>`<button class="btn xs ghost" type="button" data-ba="${x.code}">${esc(x.code+' · '+(EN?x.en:x.ar)+' · '+money(x.price))}</button>`).join('')};
  $('mbHits').onclick=e=>{const a=e.target.closest('[data-ba]');if(!a)return;const ex=b.items.find(x=>x[0]===a.dataset.ba);if(ex)ex[1]+=1;else b.items.push([a.dataset.ba,1]);$('mbQ').value='';$('mbHits').innerHTML='';draw()};
  $('mbList').oninput=e=>{const q=e.target.closest('[data-bq]');if(q){b.items[+q.dataset.bq][1]=Math.max(.05,num(q.value)||1);calc()}};
  $('mbList').onclick=e=>{const r=e.target.closest('[data-br]');if(r){b.items.splice(+r.dataset.br,1);draw()}};
  E.disc.oninput=E.fixed.onchange=E.price.oninput=calc;draw();
  if(k>=0)$('mbDel').onclick=async()=>{d0.close();if(!await ask(L('حذف هذه السلة؟','Delete this basket?'),{ok:L('حذف','Delete')}))return;W.BASKETS.splice(k,1);changed();renderBaskets()};
  f.onsubmit=e=>{if(e.submitter&&e.submitter.value==='cancel')return;e.preventDefault();const code=E.code.value.trim().toUpperCase();
    if(W.BASKETS.some((x,n)=>x.code===code&&n!==k)||findItem(code)){$('mbErr').textContent=L('هذا الرمز مستخدم.','This code is used.');return}
    if(!b.items.length){$('mbErr').textContent=L('أضف صنفاً واحداً على الأقل.','Add at least one item.');return}
    calc();Object.assign(b,{code,period:E.period.value,ar:E.ar.value.trim(),en:E.en.value.trim()||E.ar.value.trim(),for_ar:E.for_ar.value.trim(),for_en:E.for_en.value.trim(),disc:num(E.disc.value)||0,price:Math.round(num(E.price.value)||0),list:Math.round(listPrice(b))});
    if(E.fixed.checked)b.fixed=1;else delete b.fixed;if(E.hidden.checked)b.hidden=1;else delete b.hidden;
    if(k>=0)W.BASKETS[k]=b;else W.BASKETS.push(b);d0.close();changed();renderBaskets()};
  d0.showModal()}
// a change of item price flows into baskets that follow their contents (not fixed ones) when the catalogue is published
const _publish=publish;publish=async function(){W.BASKETS.forEach(b=>{b.list=Math.round(listPrice(b));if(!b.fixed)b.price=Math.round(b.list*(100-(b.disc||0))/100)});return _publish()};

// ---- reports and files ----
async function renderRep(){const v=$('v-matr');if(!await ensure('matr'))return;const R=rowsAll();
  const by={};R.forEach(x=>{const k=x.c.code,o=by[k]||(by[k]={c:x.c,n:0,cost:0,nc:0,stockV:0,low:0,out:0,hid:0,ms:0,nm:0});o.n++;const st=x.d.st||'active';if(st==='out')o.out++;if(st==='hidden')o.hid++;
    if(x.p.cost!=null){o.nc++;o.ms+=margin(x.price,x.p.cost);o.nm++;if(x.p.stock>0)o.stockV+=x.p.cost*x.p.stock}if(x.p.stock!=null&&x.p.reorder!=null&&x.p.stock<=x.p.reorder)o.low++});
  const tot=Object.values(by).reduce((a,o)=>({n:a.n+o.n,nc:a.nc+o.nc,stockV:a.stockV+o.stockV,low:a.low+o.low,out:a.out+o.out,hid:a.hid+o.hid}),{n:0,nc:0,stockV:0,low:0,out:0,hid:0});
  const noImg=R.filter(x=>!x.d.img).length,noBc=R.filter(x=>x.c.kind!=='service'&&!x.d.barcode).length;
  v.innerHTML=bar(L('تقارير المواد','Catalogue reports'))+`<div class="kpis mkk">${[[L('الأصناف','Items'),fmt(tot.n)],[L('بتكلفة مسجلة','With cost'),fmt(tot.nc)],[L('قيمة المخزون بالتكلفة','Stock value at cost'),money(tot.stockV)+' '+L('ر.ق','QAR')],[L('مخزون منخفض','Low stock'),fmt(tot.low)],[L('غير متوفر','Out of stock'),fmt(tot.out)],[L('مخفي','Hidden'),fmt(tot.hid)],[L('بلا صورة','No picture'),fmt(noImg)],[L('سلع بلا باركود','Goods without barcode'),fmt(noBc)]].map(([a,b])=>`<div class="panel"><span class="mute sm">${a}</span><b class="num">${b}</b></div>`).join('')}</div>
   <div class="panel"><h3>${L('حسب القسم','By category')}</h3><div class="tbl"><table class="mktbl"><thead><tr><th>${L('القسم','Category')}</th><th class="num">${L('الأصناف','Items')}</th><th class="num">${L('بتكلفة','With cost')}</th><th class="num">${L('متوسط الهامش','Average margin')}</th><th class="num">${L('قيمة المخزون','Stock value')}</th><th class="num">${L('منخفض','Low')}</th><th class="num">${L('غير متوفر','Out')}</th></tr></thead><tbody>
   ${Object.values(by).map(o=>`<tr><td>${o.c.icon} ${esc(EN?o.c.en:o.c.ar)}</td><td class="num">${o.n}</td><td class="num">${o.nc}</td><td class="num">${o.nm?Math.round(o.ms/o.nm)+'%':'—'}</td><td class="num">${money(o.stockV)}</td><td class="num ${o.low?'bad':''}">${o.low}</td><td class="num">${o.out}</td></tr>`).join('')}</tbody></table></div></div>
   <div class="panel"><h3>${L('إعدادات الطلب','Order settings')}</h3><div class="ctbar"><label>${L('الحد الأدنى لقيمة الطلب (ر.ق)','Minimum order value (QAR)')}<input id="mrMin" type="number" min="0" step="5" value="${W.SETTINGS.minOrder}"></label>
    <p class="mute sm">${L('يكفي صنف واحد إذا بلغت قيمته الحد الأدنى. اكتب 0 لإلغاء الحد. الطلب المكتوب في الملاحظات دون أصناف يُقبل ويُسعَّر من الفريق.','One item is enough if it reaches the minimum. Enter 0 for no minimum. A notes-only order is accepted and priced by the team.')}</p></div></div>
   <div class="panel"><h3>${L('الملفات والنسخ الاحتياطية','Files and backups')}</h3><p class="mute sm">${L('جدول Excel بكل بيانات الأصناف، ونسخة احتياطية كاملة تشمل التكلفة والمخزون، وملف الموقع الذي يحل محل market-data.js دون أي بيانات داخلية.','An Excel sheet of every item, a full backup with cost and stock, and the site file that replaces market-data.js without internal data.')}</p>
   <div class="acts"><button class="btn sm ghost" type="button" id="mrCsv">${L('تنزيل جدول الأصناف (Excel)','Download items sheet (Excel)')}</button><button class="btn sm ghost" type="button" id="mrBak">${L('نسخة احتياطية كاملة (JSON)','Full backup (JSON)')}</button>
    <label class="btn sm ghost">${L('استرجاع نسخة','Restore a backup')}<input type="file" id="mrImp" accept="application/json,.json" hidden></label><button class="btn sm ghost" type="button" id="mrSite">${L('ملف الموقع (market-data.js)','Site file (market-data.js)')}</button><button class="btn sm ghost danger" type="button" id="mrReset">${L('العودة إلى الكتالوج الأصلي','Back to the original catalogue')}</button></div></div>`;
  wire(v);const day=new Date().toISOString().slice(0,10);
  $('mrMin').onchange=e=>{const n=num(e.target.value);if(n==null||n<0)return;W.SETTINGS.minOrder=n;changed()};
  $('mrCsv').onclick=()=>download(`jahiz-items-${day}.csv`,csv(),'text/csv;charset=utf-8');
  $('mrBak').onclick=()=>download(`jahiz-catalogue-${day}.json`,JSON.stringify({kind:'jahiz-market',at:new Date().toISOString(),market:W,priv:P},null,1),'application/json');
  $('mrSite').onclick=()=>download('market-data.js',siteFile(),'text/javascript');
  $('mrImp').onchange=async e=>{const fl=e.target.files[0];if(!fl)return;try{const j=JSON.parse(await fl.text());if(j.kind!=='jahiz-market'||!j.market||!Array.isArray(j.market.CATS))throw 0;
    if(!await ask(L('استرجاع هذه النسخة بدل الكتالوج الحالي؟ لن تُنشر قبل أن تضغط حفظ.','Restore this backup instead of the current catalogue? Nothing is published until you save.'),{ok:L('استرجاع','Restore')}))return;W=MARKET_STORE.clean(j.market);P=j.priv||{};W.DETAILS=W.DETAILS||{};W.BASKETS=W.BASKETS||[];changed();renderRep()}
    catch(x){toast(L('الملف ليس نسخة احتياطية من كتالوج جاهز.','This is not a Jahiz catalogue backup.'))}e.target.value=''};
  $('mrReset').onclick=async()=>{if(!await ask(L('العودة إلى الكتالوج الأصلي للموقع؟ يُلغى كل ما حُفظ من تعديلات. نزّل نسخة احتياطية أولاً إن أردت الاحتفاظ بها.','Go back to the original catalogue? Every saved change is dropped. Download a backup first if you want to keep it.'),{ok:L('عودة','Reset')}))return;
    try{if(ONLINE)await S.api('saveMarket',{market:null});MARKET_STORE.remember(null);localStorage.removeItem(PKEY)}catch(x){}W=clone(MARKET_STORE.BUILT);W.DETAILS=W.DETAILS||{};P={};dirty=false;renderRep();toast(L('عاد الكتالوج الأصلي','Original catalogue restored'))}}

Object.assign(VIEWS,{mati:renderItems,matg:renderCats,matb:renderBaskets,matr:renderRep});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});
})();
