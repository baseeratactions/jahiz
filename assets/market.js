'use strict';
// جاهز، السوق الوسيط: يعرض الأقسام والمنتجات والخدمات، يجمع سلة الطلب، ويرسل الطلب إلى نظام جاهز (أو واتساب)
// ليحوّله فريق جاهز إلى الشريك المعتمد المنفّذ. مشترك بين index.html و en/index.html، ويحدد <html lang> اللغة.
(function(){
const EN=document.documentElement.lang==='en';
const CFG=window.JAHIZ_CONFIG||{};
const WA=CFG.WHATSAPP||'97472232609';
const M=typeof MARKET!=='undefined'?MARKET:{CATS:[],KINDS:{},COMMISSION:[],TIERS:[]};
M.BASKETS=M.BASKETS||[];M.PERIODS=M.PERIODS||{};M.DETAILS=M.DETAILS||{};
const MIN=Math.max(0,+((M.SETTINGS||{}).minOrder)||0);
const $=id=>document.getElementById(id);
const fmt=n=>Number(n).toLocaleString('en-US');
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const L=(a,e)=>EN?e:a;
const CUR=L('ر.ق','QAR');
const PHONE_RE=/^(\+?974)?[3567]\d{7}$/;
const AREAS=EN?['Doha','Al Rayyan','Lusail','Al Wakrah','Al Khor','Umm Salal','Al Daayen','Al Shamal','Al Sheehaniya']:['الدوحة','الريان','لوسيل','الوكرة','الخور','أم صلال','الظعاين','الشمال','الشحانية'];
const T={
  all:L('الكل','All'),from:L('يبدأ من','from'),add:L('أضف','Add'),items:n=>EN?`${n} items`:`${n} ${n<=10?'بنود':'بنداً'}`,
  back:L('كل الأقسام →','← All categories'),empty:L('لم نجد ما تبحث عنه. اكتبه في ملاحظات الطلب وسنوفّره لك من شركائنا.','We could not find that. Write it in the order notes and we will source it from our partners.'),
  results:q=>L(`نتائج البحث عن «${q}»`,`Results for “${q}”`),added:n=>L(`أضيف إلى السلة: ${n}`,`Added to basket: ${n}`),
  bEmpty:L('سلتك فارغة. أضف منتجات أو خدمات من الأقسام، أو اكتب ما تحتاجه في الملاحظات.','Your basket is empty. Add products or services, or write what you need in the notes.'),
  eName:L('يرجى كتابة الاسم.','Please enter your name.'),ePhone:L('يرجى كتابة رقم جوال قطري من 8 أرقام يبدأ بـ 3 أو 5 أو 6 أو 7.','Please enter an 8-digit Qatar mobile starting with 3, 5, 6 or 7.'),
  eMail:L('يرجى كتابة بريد صحيح أو تركه فارغاً.','Please enter a valid email or leave it empty.'),eBasket:L('أضف بنداً واحداً على الأقل أو اكتب طلبك في الملاحظات.','Add at least one item or write your order in the notes.'),
  eMin:r=>L(`الحد الأدنى للطلب ${fmt(MIN)} ر.ق. أضف ما قيمته ${fmt(r)} ر.ق أخرى لإرسال الطلب.`,`The minimum order is QAR ${fmt(MIN)}. Add QAR ${fmt(r)} more to send it.`),
  eAddr:L('يرجى كتابة العنوان أو أقرب معلم.','Please enter the address or a nearby landmark.'),eOk:L('يرجى الموافقة على الشروط لإرسال الطلب.','Please accept the terms to send the order.'),
  eCo:L('يرجى كتابة اسم الشركة أو المتجر.','Please enter the company or shop name.'),eCat:L('يرجى اختيار مجال عملك.','Please choose your field.'),
  sending:L('جارٍ إرسال طلبك…','Sending your order…'),
  sentOk:(id,m)=>L(`شكراً لك، وصلنا طلبك ورقمه <b>${esc(id)}</b>.${m?' أرسلنا لك تأكيداً على بريدك.':''} سيتواصل معك فريق جاهز لتأكيد السعر النهائي وموعد التوصيل، ثم نحوّل الطلب إلى الشريك المعتمد المنفّذ ونتابعه حتى يصلك.`,`Thank you, we received your order <b>${esc(id)}</b>.${m?' We emailed you a confirmation.':''} The Jahiz team will contact you to confirm the final price and delivery time, then forward the order to the accredited partner and follow it until it reaches you.`),
  sentFail:L('تعذّر إرسال الطلب عبر الموقع الآن. أرسله على واتساب من الزر أدناه وسنكمل معك فوراً.','We could not send the order online right now. Send it on WhatsApp with the button below.'),
  pOk:id=>L(`شكراً لك، وصلنا طلب انضمامك برقم <b>${esc(id)}</b>. سيتواصل معك فريق الشراكات لمراجعة الاعتماد والاتفاق على نسبة العمولة.`,`Thank you, we received your application <b>${esc(id)}</b>. Our partnerships team will contact you to review accreditation and agree the commission.`),
  orderHead:L('السلام عليكم، أرغب في طلب من جاهز:','Hello, I would like to order from Jahiz:'),
  partnerHead:L('السلام عليكم، أرغب في الانضمام إلى جاهز كشريك معتمد.','Hello, I would like to join Jahiz as an accredited partner.'),
  est:L('الإجمالي التقديري','Estimated total'),estNote:L('أسعار استرشادية، ويؤكد الشريك المنفّذ السعر النهائي ورسوم التوصيل قبل التنفيذ.','Indicative prices; the fulfilling partner confirms the final price and delivery fee first.'),
  copied:L('تم النسخ','Copied'),rm:L('إزالة','Remove'),inc:L('زيادة','More'),dec:L('إنقاص','Less'),
  perMonth:L('ر.ق شهرياً','QAR / month'),free:L('بدون اشتراك','No subscription'),custom:L('حسب الاتفاق','By agreement'),join:t=>L(`انضم كـ«${t}»`,`Join as ${t}`),
  trkSteps:{req:L(['استلمنا طلبك','التأكيد مع الشريك المعتمد','حُوِّل للتنفيذ والتوصيل'],['Order received','Confirming with the partner','Sent for fulfilment & delivery']),
    txn:L(['استلام الطلب','تجهيز الطلب لدى الشريك','تسليم الطلب للتوصيل','في الطريق إليك','تم التسليم'],['Order received','Partner preparing','Handed to delivery','On the way','Delivered'])}
};

// ---- catalogue ----
const all=[];
M.CATS.forEach(c=>c.items.forEach(([code,ar,en,p,uar,uen,g])=>{const gr=(c.groups||[])[g];all.push({c:code,n:EN?en:ar,o:EN?ar:en,p,u:EN?uen:uar,cat:c,g:g|0,gn:gr?(EN?gr[1]:gr[0]):'',go:gr?(EN?gr[0]:gr[1]):'',d:M.DETAILS[code]||{}})}));
const nItems=all.length;
// ready baskets sit in the same basket and order as single items
const BCAT={ar:'سلال جاهزة',en:'Ready baskets',about_ar:'سلة يومية أسبوعية شهرية',about_en:'daily weekly monthly basket'};
M.BASKETS.forEach(b=>all.push({c:b.code,n:EN?b.en:b.ar,o:EN?b.ar:b.en,p:b.price,u:L('للسلة','per basket'),cat:BCAT,gn:(M.PERIODS[b.period]||{})[EN?'en':'ar']||'',bk:b}));
const byCode=Object.fromEntries(all.map(s=>[s.c,s]));
const catName=c=>EN?c.en:c.ar;
const kinds=Object.keys(M.KINDS);
document.querySelectorAll('[data-n]').forEach(el=>{const k=el.dataset.n;
  el.textContent=k==='items'?nItems:k==='baskets'?M.BASKETS.length:k==='maxdisc'?Math.max(0,...M.BASKETS.map(b=>b.disc)):k==='cats'?M.CATS.length:k==='min'?fmt(MIN):k==='food'||k==='goods'||k==='service'?M.CATS.filter(c=>c.kind===k).length:el.textContent});

let kind='all',open=null;
const cart=new Map();
const KEY='jahiz_basket';
try{(JSON.parse(localStorage.getItem(KEY)||'[]')||[]).forEach(([c,q])=>{if(byCode[c])cart.set(c,Math.max(1,Math.min(99,q|0)))})}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify([...cart]))}catch(e){}};

function toast(t){const el=$('toast');if(!el)return;el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,1800)}
const priceHTML=s=>`<span class="price"><small>${T.from}</small> ${s.d&&s.d.was>s.p?`<s class="num">${fmt(s.d.was)}</s> `:''}${fmt(s.p)} <small>${CUR} ${esc(s.u)}</small></span>`;

const kbox=$('kinds');
if(kbox){[['all',T.all],...kinds.map(k=>[k,EN?M.KINDS[k].en:M.KINDS[k].ar])].forEach(([k,n])=>{const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.k=k;b.textContent=n;b.setAttribute('aria-pressed',k==='all');b.onclick=()=>{kind=k;open=null;$('sq').value='';if(location.hash.startsWith('#cat='))history.replaceState(null,'','#shop');render()};kbox.appendChild(b)})}

function catTile(c){const lo=Math.min(...c.items.map(i=>i[3]));
  return `<a class="cat" href="#cat=${c.code}"><span class="ic" aria-hidden="true">${c.icon}</span><b>${esc(catName(c))}</b><span>${T.items(units(c.items.map(i=>byCode[i[0]])).length)} · ${T.from} <span class="num">${fmt(lo)}</span> ${CUR}</span></a>`}
// specifications the management filled in (لوحة الإدارة ← المواد): pack, origin and quality under the name, a picture when there is one
function specs(d){return [EN?d.pack_en||d.pack:d.pack,EN?d.origin_en||d.origin:d.origin,EN?d.quality_en||d.quality:d.quality,EN?d.brand_en||d.brand:d.brand].filter(Boolean)}
// the supplier company, when the management names one (المورد), shows under the specifications and is searchable
const supOf=d=>EN?d.sup_en||d.sup:d.sup;
const imgSrc=u=>window.MARKET_STORE&&MARKET_STORE.src?MARKET_STORE.src(u):u;
function itemCard(s){const q=cart.get(s.c)||0,d=s.d||{},out=d.st==='out',sp=specs(d);
  return `<div class="item${out?' out':''}${d.feat?' feat':''}" data-c="${s.c}">${d.img?`<img class="ph" src="${esc(imgSrc(d.img))}" alt="${esc(s.n)}" loading="lazy" width="72" height="72">`:''}<div class="t"><b>${esc(s.n)}</b>${sp.length?`<span class="spec">${sp.map(esc).join(' · ')}</span>`:''}${d.sup?`<span class="sup">${L('المورد: ','Supplier: ')}${esc(supOf(d))}</span>`:''}<small>${esc(s.gn||catName(s.cat))} · <span class="code">${s.c}</span></small></div>
   <div class="p">${priceHTML(s)}${out?`<span class="oos">${L('غير متوفر حالياً','Out of stock')}</span>`:q?qtyHTML(s,q):`<button type="button" class="add" data-add="${s.c}" aria-label="${esc(T.add+' '+s.n)}">${T.add}</button>`}</div></div>`}
const qtyHTML=(s,q)=>`<span class="qty"><button type="button" data-dec="${s.c}" aria-label="${esc(T.dec+' '+s.n)}">−</button><output class="num">${q}</output><button type="button" data-inc="${s.c}" aria-label="${esc(T.inc+' '+s.n)}">+</button></span>`;
// Arabic matches anywhere in a word (prefixes such as «ال»), English from the start of a word so «ac» does not hit «packed»
// the category summary is searched only when no item name, group or specification matches, so «AC» does not list every accredited partner
// both languages are searched on either page, and Arabic spelling variants (أ/إ/ا، ة/ه، ى/ي and diacritics) count as the same letter
const norm=x=>String(x||'').toLowerCase().replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي');
// common local names for the same product, so «بندورة» finds tomatoes and «رز» finds rice
const SYN={'بندوره':'طماطم','رز':'ارز','بطاطا':'بطاطس','بطيخ احمر':'بطيخ','جاج':'دجاج','فراخ':'دجاج','كوسه':'كوسا','مكيف':'تكييف','مكيفات':'تكييف','غساله':'غسال'};
// every word of the query must be found, in any order; an English word of one or two letters («ac») must be the whole word
function match(s,q,wide){const t=norm([s.n,s.o,s.cat.ar,s.cat.en,s.gn,s.go,s.c].concat(s.d?[specs(s.d).join(' '),s.d.origin_en,s.d.origin,s.d.brand,s.d.brand_en,s.d.sup,s.d.sup_en,s.d.barcode,s.d.tags]:[]).concat(wide?[s.cat.about_en,s.cat.about_ar]:[]).filter(Boolean).join(' '));
  const one=w=>/[\u0600-\u06FF]/.test(w)?t.includes(w)||(SYN[w]&&t.includes(SYN[w])):new RegExp('(^|[^a-z0-9])'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+(w.length<3?'($|[^a-z0-9])':'')).test(t);
  q=norm(q);return (SYN[q]&&t.includes(SYN[q]))||q.split(/\s+/).filter(Boolean).every(one)}
function render(){const box=$('catalog');if(!box)return;const q=($('sq').value||'').trim();
  kbox&&kbox.querySelectorAll('.chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===kind));
  if(q){let hits=all.filter(s=>match(s,q));if(!hits.length)hits=all.filter(s=>match(s,q,true));
    box.innerHTML=`<p class="lead">${esc(T.results(q))}</p>`+(hits.length?viewSw()+block(hits):`<div class="empty">${T.empty}</div>`);return}
  if(open){const c=M.CATS.find(x=>x.code===open);
    box.innerHTML=`<div class="catv"><a class="btn sm ghost" href="#shop" style="align-self:flex-start">${T.back}</a><div class="cathead"><span class="ic" aria-hidden="true">${c.icon}</span><div><h3>${esc(catName(c))}</h3><p class="lead">${esc(EN?c.about_en:c.about_ar)}</p></div></div>
      ${catBody(c)}<p class="note">${T.estNote}</p></div>`;return}
  box.innerHTML=kinds.filter(k=>kind==='all'||kind===k).map(k=>`<div class="kindh"><h3>${esc(EN?M.KINDS[k].en:M.KINDS[k].ar)}</h3><span class="mute">${M.CATS.filter(c=>c.kind===k).length} ${L('أقسام','categories')}</span></div><div class="cats">${M.CATS.filter(c=>c.kind===k).map(catTile).join('')}</div>`).join('')}
// the same product from several origins or suppliers ("fam" in the item details) is shown once, with its prices compared
const fams={};all.forEach(s=>{const f=s.d&&s.d.fam;if(f)(fams[f]=fams[f]||[]).push(s)});
const famPick={};
const vLabel=s=>[EN?s.d.origin_en||s.d.origin:s.d.origin,EN?s.d.quality_en||s.d.quality:s.d.quality].filter(Boolean).join(' · ')||s.c;
function units(list){const seen=new Set(),out=[];list.forEach(s=>{const f=s.d&&s.d.fam;if(f&&fams[f]&&fams[f].length>1){if(seen.has(f))return;seen.add(f);out.push(fams[f])}else out.push(s)});return out}
function famCard(vs){const sorted=vs.slice().sort((a,b)=>a.p-b.p),lo=sorted[0].p,hi=sorted[sorted.length-1].p,f=vs[0].d.fam,pick=byCode[famPick[f]]||sorted[0],q=cart.get(pick.c)||0,inCart=vs.filter(s=>cart.has(s.c));
  return `<div class="item fam" data-fam="${f}"><div class="t"><b>${esc(vs[0].n)}</b><span class="spec">${L(`${vs.length} مصادر للمقارنة`,`${vs.length} sources to compare`)} · ${fmt(lo)}${lo!==hi?' – '+fmt(hi):''} ${CUR} ${esc(vs[0].u)}</span><small>${esc(vs[0].gn||catName(vs[0].cat))}</small></div>
   <label class="vsel"><span>${L('اختر المصدر','Choose the source')}</span><select data-fsel="${f}">${sorted.map(s=>`<option value="${s.c}" ${s===pick?'selected':''}>${esc(vLabel(s))} · ${fmt(s.p)} ${CUR}${s.p===lo&&lo!==hi?' · '+L('الأرخص','cheapest'):''}${s.d.st==='out'?' · '+L('غير متوفر','out of stock'):''}</option>`).join('')}</select></label>
   <div class="p">${priceHTML(pick)}${pick.d.st==='out'?`<span class="oos">${L('غير متوفر حالياً','Out of stock')}</span>`:q?qtyHTML(pick,q):`<button type="button" class="add" data-add="${pick.c}" aria-label="${esc(T.add+' '+pick.n+' '+vLabel(pick))}">${T.add}</button>`}</div>
   <details class="cmp"><summary>${L('قارن الأسعار','Compare prices')}</summary><table><thead><tr><th>${L('المنشأ والجودة','Origin and quality')}</th><th>${L('السعر','Price')}</th><th></th></tr></thead><tbody>${sorted.map(s=>{const n=cart.get(s.c)||0;return `<tr${s.p===lo&&lo!==hi?' class="best"':''}><td>${esc(vLabel(s))}<br><span class="code">${s.c}</span></td><td class="num">${fmt(s.p)} <small>${CUR}</small>${s.p===lo&&lo!==hi?`<br><small class="tag">${L('الأرخص','Cheapest')}</small>`:''}</td><td>${s.d.st==='out'?`<span class="oos">${L('غير متوفر','Out')}</span>`:n?qtyHTML(s,n):`<button type="button" class="add sm" data-add="${s.c}">${T.add}</button>`}</td></tr>`}).join('')}</tbody></table></details>
   ${inCart.length?`<small class="incart">${L('في سلتك: ','In your basket: ')}${inCart.map(s=>esc(vLabel(s))+' × '+cart.get(s.c)).join('، ')}</small>`:''}</div>`}
// a whole list can also be read as rows (name, specifications, unit, price), which is quicker for long categories
let VIEW='cards';try{VIEW=localStorage.getItem('jahiz_view')==='list'?'list':'cards'}catch(e){}
function rowHTML(s){const q=cart.get(s.c)||0,d=s.d||{},sp=specs(d);return `<tr${d.st==='out'?' class="out"':''}><td><b>${esc(s.n)}</b>${sp.length?`<br><small>${sp.map(esc).join(' · ')}</small>`:''}</td><td class="u">${esc(s.u)}</td><td class="num"><b>${fmt(s.p)}</b> <small>${CUR}</small></td><td>${d.st==='out'?`<span class="oos">${L('غير متوفر','Out')}</span>`:q?qtyHTML(s,q):`<button type="button" class="add sm" data-add="${s.c}" aria-label="${esc(T.add+' '+s.n)}">${T.add}</button>`}</td></tr>`}
function block(list){if(VIEW==='list')return `<div class="ilist"><table><thead><tr><th>${L('الصنف','Item')}</th><th>${L('الوحدة','Unit')}</th><th>${L('السعر','Price')}</th><th></th></tr></thead><tbody>${list.slice().sort((a,b)=>a.n===b.n?a.p-b.p:0).map(rowHTML).join('')}</tbody></table></div>`;
  return `<div class="items">${units(list).map(u=>Array.isArray(u)?famCard(u):itemCard(u)).join('')}</div>`}
const viewSw=()=>`<div class="vsw" role="group" aria-label="${L('طريقة العرض','View')}"><button type="button" class="chip" data-view="cards" aria-pressed="${VIEW==='cards'}">${L('بطاقات','Cards')}</button><button type="button" class="chip" data-view="list" aria-pressed="${VIEW==='list'}">${L('قائمة','List')}</button></div>`;
// a category with groups shows a chip per group and a heading over each group's items
function catBody(c){const gs=c.groups||[];const list=c.items.map(i=>byCode[i[0]]);
  if(gs.length<2)return viewSw()+block(list);
  return `<div class="catbar"><nav class="grpnav" aria-label="${L('مجموعات القسم','Category groups')}">${gs.map((g,k)=>{const n=units(list.filter(s=>s.g===k)).length;return n?`<a class="chip" href="#g-${c.code}-${k}">${esc(EN?g[1]:g[0])} <span class="num">${n}</span></a>`:''}).join('')}</nav>${viewSw()}</div>`+
    gs.map((g,k)=>{const its=list.filter(s=>s.g===k);return its.length?`<h4 class="grph" id="g-${c.code}-${k}">${esc(EN?g[1]:g[0])}</h4>${block(its)}`:''}).join('')}
document.addEventListener('change',e=>{const f=e.target.closest('[data-fsel]');if(f){famPick[f.dataset.fsel]=f.value;render()}});
document.addEventListener('click',e=>{const v=e.target.closest('[data-view]');if(v){VIEW=v.dataset.view;try{localStorage.setItem('jahiz_view',VIEW)}catch(x){}render()}});
// ---- ready baskets: daily, weekly or monthly, with their contents and the saving against buying each item ----
let per='all';
const qtxt=q=>q<1?L(`${fmt(q*1000)} غ`,`${fmt(q*1000)} g`):`× ${fmt(q)}`;
function basketCard(b){const s=byCode[b.code],q=cart.get(b.code)||0,P=M.PERIODS[b.period]||{};
  return `<article class="bkt" data-c="${b.code}"><div class="bkt-h"><span class="bkt-per">${esc(EN?P.en:P.ar)}</span>${b.disc?`<span class="bkt-off">${L('وفّر','Save')} ${b.disc}%</span>`:''}</div>
   <h3>${esc(s.n)}</h3><p class="mute">${esc(EN?b.for_en:b.for_ar)} · <span class="code">${b.code}</span></p>
   <details><summary>${L('محتويات السلة','What is inside')} (${b.items.length})</summary><ul>${b.items.map(([c,n])=>{const it=byCode[c];return it?`<li><span>${esc(it.n)}</span><span class="num">${qtxt(n)}</span></li>`:''}).join('')}</ul></details>
   <div class="bkt-f"><span class="price">${b.disc?`<s class="num">${fmt(b.list)}</s> `:''}${fmt(b.price)} <small>${CUR} ${L('للسلة','per basket')}</small></span>${q?qtyHTML(s,q):`<button type="button" class="add" data-add="${b.code}" aria-label="${esc(T.add+' '+s.n)}">${T.add}</button>`}</div></article>`}
function renderBaskets(){const box=$('bkts');if(!box)return;
  const pb=$('periods');if(pb&&!pb.childElementCount)[['all',T.all],...Object.keys(M.PERIODS).map(k=>[k,EN?M.PERIODS[k].en:M.PERIODS[k].ar])].forEach(([k,n])=>{const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.p=k;b.textContent=n;b.onclick=()=>{per=k;renderBaskets()};pb.appendChild(b)});
  pb&&pb.querySelectorAll('.chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.p===per));
  box.innerHTML=M.BASKETS.filter(b=>per==='all'||b.period===per).map(basketCard).join('')}
function setQty(c,q){if(q<=0)cart.delete(c);else cart.set(c,Math.min(99,q));save();render();renderBaskets();renderBasket()}
document.addEventListener('click',e=>{const t=e.target.closest('[data-add],[data-inc],[data-dec],[data-rm]');if(!t)return;
  if(t.dataset.add){const s=byCode[t.dataset.add];setQty(t.dataset.add,1);toast(T.added(s.n+(s.d&&s.d.fam?' ('+vLabel(s)+')':'')))}
  else if(t.dataset.inc)setQty(t.dataset.inc,(cart.get(t.dataset.inc)||0)+1);
  else if(t.dataset.dec)setQty(t.dataset.dec,(cart.get(t.dataset.dec)||0)-1);
  else if(t.dataset.rm)setQty(t.dataset.rm,0)});
$('sq')&&$('sq').addEventListener('input',()=>{open=null;render()});

// ---- routing: #cat=XX opens one category inside the shop section ----
function route(){const m=location.hash.match(/^#cat=([A-Z]{2})$/);
  if(m&&M.CATS.some(c=>c.code===m[1])){open=m[1];$('sq').value='';const c=M.CATS.find(x=>x.code===m[1]);kind=c.kind;render();$('shop').scrollIntoView({block:'start'});return}
  if(location.hash==='#shop'&&open){open=null;render()}}
addEventListener('hashchange',route);
// the one search box sits at the top of the shop: it filters as you type, and Enter (or the button) brings the results into view
$('hs')&&$('hs').addEventListener('submit',e=>{e.preventDefault();if($('hq'))$('sq').value=$('hq').value.trim();open=null;kind='all';render();$('catalog').scrollIntoView({block:'start'});$('sq').blur()});
document.querySelectorAll('[data-kind]').forEach(a=>a.addEventListener('click',()=>{kind=a.dataset.kind;open=null;$('sq').value='';render()}));

// ---- basket and order ----
const fullName=s=>s.n+(s.d&&s.d.fam?' ('+vLabel(s)+')':'');
function basketLines(){return [...cart].map(([c,q])=>`${fullName(byCode[c])} (${c}) × ${q}`)}
function total(){let t=0;cart.forEach((q,c)=>t+=byCode[c].p*q);return t}
function renderBasket(){const n=[...cart.values()].reduce((a,b)=>a+b,0);
  const fab=$('fab');if(fab){fab.hidden=!n;fab.querySelector('.n').textContent=n;const ft=$('fabT');if(ft)ft.textContent=n?fmt(total())+' '+CUR:''}
  const bl=$('basket');if(!bl)return;
  bl.innerHTML=cart.size?[...cart].map(([c,q])=>{const s=byCode[c];return `<div class="bi"><div><b>${esc(fullName(s))}</b><small>${T.from} ${fmt(s.p)} ${CUR} ${esc(s.u)} · <span class="code">${c}</span></small></div>${qtyHTML(s,q)}<span class="lt num">${fmt(s.p*q)}</span></div>`}).join(''):`<div class="empty">${T.bEmpty}</div>`;
  $('bTotal').textContent=fmt(total())+' '+CUR;
  // one item is enough as long as the order reaches the minimum value
  const mn=$('bMin');if(mn&&MIN){const r=Math.max(0,MIN-total());mn.hidden=false;mn.className='bmin '+(cart.size&&r?'short':cart.size?'ok':'');
    mn.textContent=!cart.size?L(`الحد الأدنى للطلب ${fmt(MIN)} ر.ق، ويمكن أن يكون صنفاً واحداً.`,`Minimum order QAR ${fmt(MIN)}; a single item is fine.`):r?L(`باقي ${fmt(Math.ceil(r))} ر.ق للوصول إلى الحد الأدنى (${fmt(MIN)} ر.ق).`,`QAR ${fmt(Math.ceil(r))} to go to reach the minimum (QAR ${fmt(MIN)}).`):L('وصلت إلى الحد الأدنى للطلب ✓','Minimum order reached ✓')}}
// the floating basket button steps aside while the basket itself is on screen
const ordSec=$('order');if(ordSec&&'IntersectionObserver' in window)new IntersectionObserver(([e])=>document.body.classList.toggle('in-order',e.isIntersecting),{threshold:.1}).observe(ordSec);
const area=$('oArea');if(area)AREAS.forEach(a=>{const o=document.createElement('option');o.textContent=a;area.appendChild(o)});
const pCat=$('pCat');if(pCat)M.CATS.forEach(c=>{const o=document.createElement('option');o.value=c.code;o.textContent=`${c.icon} ${catName(c)}`;pCat.appendChild(o)});
const post=o=>fetch(CFG.API,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(o)}).then(r=>r.json());
const sel=el=>el.options[el.selectedIndex].text;
function check(id,ok,msg){const e=$(id);if(e)e.textContent=ok?'':msg;return ok}
const oF=$('oForm');
if(oF)oF.addEventListener('submit',async e=>{e.preventDefault();
  const n=$('oName').value.trim(),ph=$('oPhone').value.replace(/\s/g,''),em=$('oMail').value.trim(),addr=$('oAddr').value.trim(),note=$('oNote').value.trim();
  const ok=[check('eName',!!n,T.eName),check('ePhone',PHONE_RE.test(ph),T.ePhone),check('eMail',!em||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em),T.eMail),
    check('eBasket',cart.size?total()>=MIN:!!note,cart.size?T.eMin(Math.ceil(MIN-total())):T.eBasket),check('eAddr',!!addr,T.eAddr),check('eOk',$('oOk').checked,T.eOk)].every(Boolean);
  if(!ok)return;
  const lines=basketLines(),info=[`${L('المنطقة','Area')}: ${sel(area)}`,`${L('العنوان','Address')}: ${addr}`,`${L('موعد التوصيل','Delivery time')}: ${sel($('oWhen'))}`,`${L('طريقة الدفع','Payment')}: ${sel($('oPay'))}`];
  if(note)info.push(`${L('ملاحظات','Notes')}: ${note}`);
  if(cart.size)info.push(`${T.est}: ${fmt(total())} ${CUR}`);
  const services=[...lines,...info].join('\n');
  const msg=`${T.orderHead}\n${L('الاسم','Name')}: ${n}\n${L('الجوال','Mobile')}: ${ph}${em?'\n'+L('البريد','Email')+': '+em:''}\n\n${services}`;
  const wa=$('oWa');wa.href=`https://wa.me/${WA}?text=`+encodeURIComponent(msg);$('oOut').hidden=false;
  const st=$('oState');
  if(!CFG.API){st.className='status';st.innerHTML=L('اضغط «أرسل الطلب على واتساب» لإكمال طلبك.','Press “Send the order on WhatsApp” to complete your order.');return}
  st.className='status';st.textContent=T.sending;const btn=oF.querySelector('[type=submit]');btn.disabled=true;
  try{const j=await post({action:'request',name:n,phone:ph,email:em,type:sel($('oType')),plan:'',contact:sel($('oVia')),services,codes:[...cart.keys()],lang:EN?'en':'ar',page:location.href,hp:$('oHp').value});
    if(!j.ok)throw new Error(j.error);st.className='status ok';st.innerHTML=T.sentOk(j.id,j.mailed);cart.clear();save();render();renderBasket()}
  catch(err){st.className='status bad';st.textContent=T.sentFail}
  finally{btn.disabled=false}
  $('oOut').scrollIntoView({block:'nearest'})});

// ---- partners: tiers, commission table, calculator and application ----
const tiers=$('tiers');
if(tiers)tiers.innerHTML=M.TIERS.map(t=>`<div class="tier${t.key==='plus'?' feat':''}"><h3>${esc(EN?t.en:t.ar)}</h3><div class="amt">${t.fee===0?T.free:t.fee==null?T.custom:`${fmt(t.fee)} <small>${T.perMonth}</small>`}</div><ul>${(EN?t.feat_en:t.feat_ar).map(f=>`<li>${esc(f)}</li>`).join('')}</ul><a class="btn ${t.key==='plus'?'pri':'ghost'}" href="#join" data-tier="${esc(EN?t.en:t.ar)}">${esc(T.join(EN?t.en:t.ar))}</a></div>`).join('');
document.querySelectorAll('[data-tier]').forEach(a=>a.addEventListener('click',()=>{const m=$('pMsg');if(m&&!m.value)m.value=L('مستوى الشراكة المطلوب: ','Partnership level: ')+a.dataset.tier}));
const ct=$('ctable');
if(ct)ct.innerHTML=M.COMMISSION.map(r=>`<tr><td>${esc(EN?r.en:r.ar)}</td><td class="num">${L(`من ${r.min}% إلى ${r.max}%`,`${r.min}% – ${r.max}%`)}</td></tr>`).join('');
const cR=$('cRate'),cA=$('cAmt'),cN=$('cN');
if(cR){M.COMMISSION.forEach((r,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${EN?r.en:r.ar} (${L(`${r.min} إلى ${r.max}%`,`${r.min}–${r.max}%`)})`;cR.appendChild(o)});
  const calc=()=>{const r=M.COMMISSION[cR.value],a=Math.max(0,+cA.value||0),n=Math.max(0,+cN.value||0),mid=(r.min+r.max)/2,sales=a*n,com=Math.round(sales*mid/100);
    $('cOut').innerHTML=L(`مبيعات شهرية تقديرية <b class="num">${fmt(sales)}</b> ر.ق، وعمولة جاهز نحو <b class="num">${fmt(com)}</b> ر.ق (${mid}%)، ويبقى لك <b class="num">${fmt(sales-com)}</b> ر.ق قبل تكاليفك.`,`Estimated monthly sales <b class="num">${fmt(sales)}</b> QAR; Jahiz commission about <b class="num">${fmt(com)}</b> QAR (${mid}%), leaving you <b class="num">${fmt(sales-com)}</b> QAR before your costs.`)};
  [cR,cA,cN].forEach(x=>x.addEventListener('input',calc));calc()}
const pF=$('pForm');
if(pF)pF.addEventListener('submit',async e=>{e.preventDefault();
  const co=$('pCo').value.trim(),n=$('pName').value.trim(),ph=$('pPhone').value.replace(/\s/g,''),em=$('pMail').value.trim();
  const ok=[check('epCo',!!co,T.eCo),check('epName',!!n,T.eName),check('epPhone',PHONE_RE.test(ph),T.ePhone),check('epMail',!em||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em),T.eMail),check('epCat',!!pCat.value,T.eCat),check('epOk',$('pOk').checked,T.eOk)].every(Boolean);
  if(!ok)return;
  const services=[L('طلب انضمام شريك معتمد','Partner application'),`${L('الشركة أو المتجر','Company or shop')}: ${co}`,`${L('المجال','Field')}: ${sel(pCat).replace(/^\S+\s/,'')} (${pCat.value})`,
    `${L('السجل التجاري','Commercial registration')}: ${$('pCr').value.trim()||'-'}`,`${L('مناطق التغطية','Coverage')}: ${$('pArea').value.trim()||'-'}`,`${L('حسابات التواصل','Social accounts')}: ${$('pSocial').value.trim()||'-'}`,$('pMsg').value.trim()].filter(Boolean).join('\n');
  const msg=`${T.partnerHead}\n${L('الاسم','Name')}: ${n}\n${L('الجوال','Mobile')}: ${ph}${em?'\n'+L('البريد','Email')+': '+em:''}\n${services}`;
  $('pWa').href=`https://wa.me/${WA}?text=`+encodeURIComponent(msg);$('pOut').hidden=false;const st=$('pState');
  if(!CFG.API){st.className='status';st.textContent=L('اضغط «أرسل على واتساب» لإكمال طلب الانضمام.','Press “Send on WhatsApp” to complete your application.');return}
  st.className='status';st.textContent=T.sending;const btn=pF.querySelector('[type=submit]');btn.disabled=true;
  try{const j=await post({action:'request',name:co+' - '+n,phone:ph,email:em,type:L('شريك معتمد','Partner'),plan:'',contact:'',services,codes:[pCat.value],lang:EN?'en':'ar',page:location.href,hp:$('pHp').value});
    if(!j.ok)throw new Error(j.error);st.className='status ok';st.innerHTML=T.pOk(j.id)}
  catch(err){st.className='status bad';st.textContent=T.sentFail}
  finally{btn.disabled=false}});

// ---- tracking an order by its number and the last 4 digits of the mobile ----
const tF=$('trkF');
if(tF)tF.addEventListener('submit',async e=>{e.preventDefault();const out=$('trkOut'),er=$('trkErr');er.textContent='';out.innerHTML='';
  const ref=$('trkRef').value.trim(),ph=$('trkPh').value.replace(/\D/g,'');
  if(!/^[TtRr]-?\d{1,6}$/.test(ref)||ph.length!==4){er.textContent=L('اكتب رقم الطلب كما وصلك، مثل R-0045، وآخر 4 أرقام من جوالك.','Enter the order number as we sent it, such as R-0045, and the last 4 digits of your mobile.');return}
  if(!CFG.API){er.textContent=L('التتبع غير متاح الآن. تواصل معنا على واتساب.','Tracking is not available right now. Message us on WhatsApp.');return}
  try{const r=await post({action:'track',ref,phone:ph});
    if(!r.ok){er.textContent=r.error==='rate_limited'?L('محاولات كثيرة. حاول بعد ساعة.','Too many tries. Try again in an hour.'):L('لم نجد طلباً بهذا الرقم وآخر 4 أرقام.','We could not find an order with this number and digits.');return}
    const steps=T.trkSteps[r.kind==='txn'?'txn':'req'];
    if(r.cancelled||r.closed&&r.step<3){out.innerHTML=`<p class="status bad">${L('أُغلق هذا الطلب. للاستفسار تواصل معنا.','This order was closed. Contact us for any question.')}</p>`;return}
    out.innerHTML=`<div class="panel"><b class="num">${esc(r.ref)}</b><ol class="trksteps">${steps.map((s,i)=>`<li class="${i+1<r.step?'done':i+1===r.step?'now':''}"${i+1===r.step?' aria-current="step"':''}>${esc(s)}</li>`).join('')}</ol>${r.updated?`<p class="mute">${L('آخر تحديث: ','Last update: ')}${esc(r.updated)}</p>`:''}</div>`}
  catch(x){er.textContent=L('تعذر الاتصال الآن. حاول بعد قليل.','Could not connect right now. Please try again shortly.')}});

// ---- social channels and contact links from config.js ----
const soc=$('social'),S=CFG.SOCIAL||{};
const NAMES={instagram:'Instagram',tiktok:'TikTok',snapchat:'Snapchat',x:'X',facebook:'Facebook'};
if(soc){const links=Object.entries(NAMES).filter(([k])=>/^https:\/\//.test(S[k]||'')).map(([k,n])=>`<a href="${esc(S[k])}" target="_blank" rel="noopener">${n}</a>`);
  soc.innerHTML=`<a href="https://wa.me/${WA}" target="_blank" rel="noopener">WhatsApp</a>`+links.join('')}
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a=>{if(!a.id)a.href=a.href.replace(/wa\.me\/\d+/,'wa.me/'+WA)});
document.querySelectorAll('[data-phone]').forEach(a=>{a.textContent=CFG.PHONE||('+'+WA);if(a.tagName==='A')a.href='tel:+'+WA});
document.querySelectorAll('[data-mail]').forEach(a=>{const m=CFG.EMAIL||'';a.textContent=m;a.href='mailto:'+m;a.hidden=!m});

// ---- mobile menu ----
const bg=$('burger');if(bg)bg.onclick=()=>{const o=!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',o);bg.setAttribute('aria-expanded',o)};
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>{document.body.classList.remove('menu-open');bg&&bg.setAttribute('aria-expanded','false')}));

render();renderBaskets();renderBasket();route();
})();
