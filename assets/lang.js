'use strict';
// Language switcher that always stays in the top bar: Arabic | English, plus other languages through Google Translate.
// Built from the page's own ".lang" link (the address of the same page in the other language). Google's script loads only after a visitor picks another language.
(function(){
const EN=document.documentElement.lang==='en',SRC=EN?'en':'ar';
const wrap=document.querySelector('header.top .wrap'),alt=document.querySelector('header.top .lang');if(!wrap||!alt||document.querySelector('.lsw'))return;
const here=location.pathname.split('/').pop()+location.search+location.hash,other=alt.getAttribute('href');
const cur=(document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]+\/([^;]+)/)||[])[1]||'';
const LANGS=[['en','English'],['fr','Français'],['de','Deutsch'],['es','Español'],['it','Italiano'],['pt','Português'],['ru','Русский'],['tr','Türkçe'],['fa','فارسی'],['ur','اردو'],['hi','हिन्दी'],['bn','বাংলা'],['ml','മലയാളം'],['ta','தமிழ்'],['ne','नेपाली'],['si','සිංහල'],['tl','Filipino'],['id','Bahasa Indonesia'],['ms','Bahasa Melayu'],['zh-CN','中文'],['ja','日本語'],['ko','한국어'],['sw','Kiswahili'],['so','Soomaali'],['am','አማርኛ'],['ar','العربية']].filter(([c])=>c!==SRC&&c!=='en'&&c!=='ar');
function setLang(c){const host=location.hostname,exp=c?'':';expires=Thu, 01 Jan 1970 00:00:00 GMT',v=c?`/${SRC}/${c}`:'';
  [host,'.'+host.split('.').slice(-2).join('.')].forEach(d=>{document.cookie='googtrans='+v+';path=/;domain='+d+exp});document.cookie='googtrans='+v+';path=/'+exp;location.reload()}
const box=document.createElement('div');box.className='lsw notranslate';box.translate=false;box.setAttribute('role','group');box.setAttribute('aria-label',EN?'Language':'اللغة');
const ar=EN?other:here,en=EN?here:other;
box.innerHTML=`<a href="${ar}" lang="ar" hreflang="ar"${EN?'':' aria-current="true"'}><span class="lshort">عربي</span></a>`+
  `<a href="${en}" lang="en" hreflang="en"${EN?' aria-current="true"':''}><span class="lshort">EN</span></a>`;
const sel=document.createElement('select');sel.className='gtsel';sel.setAttribute('aria-label',EN?'Other languages (Google Translate)':'لغات أخرى (ترجمة Google)');sel.title=sel.getAttribute('aria-label');
sel.innerHTML=`<option value="">🌐</option>`+(cur&&cur!==SRC?`<option value="-">↩ ${EN?'English (original)':'العربية (الأصل)'}</option>`:'')+LANGS.map(([c,n])=>`<option value="${c}"${c===cur?' selected':''}>${n}</option>`).join('');
sel.onchange=()=>{const v=sel.value;if(v==='-')setLang('');else if(v)setLang(v)};box.appendChild(sel);
// a link that keeps the hash (#section) when switching between Arabic and English
box.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(location.hash&&!a.hasAttribute('aria-current')&&!/#/.test(a.getAttribute('href')))a.href=a.getAttribute('href')+location.hash}));
const li=alt.closest('li');(li||alt).hidden=true;
const burger=wrap.querySelector('.burger');wrap.insertBefore(box,burger||null);
if(cur&&cur!==SRC){const h=document.createElement('div');h.id='gte';h.hidden=true;document.body.appendChild(h);
  window.gtInit=()=>new google.translate.TranslateElement({pageLanguage:SRC,autoDisplay:false},'gte');
  const s=document.createElement('script');s.src='https://translate.google.com/translate_a/element.js?cb=gtInit';s.async=true;document.head.appendChild(s)}
})();
