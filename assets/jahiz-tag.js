'use strict';
// Jahiz shares Basira's WhatsApp number and email for now, so every WhatsApp message and email started from these pages
// opens with a clear Jahiz mark: the team then knows at a glance the message came through Jahiz, not Basira.
// Links are rewritten when they are clicked, so links filled in later (the order and partner forms, the admin panel) are covered too.
(function(){
const EN=document.documentElement.lang==='en',ADMIN=/crm\.html$/.test(location.pathname);
const TAG=EN?'🟣 *Jahiz*':'🟣 *جاهز*';
const HELLO=ADMIN?(EN?'Hello, this is the Jahiz team.':'مرحباً، معك فريق جاهز.'):(EN?'Hello, I am contacting you from the Jahiz website.':'السلام عليكم، أتواصل معكم من موقع جاهز.');
const SUBJ=EN?'Jahiz':'جاهز';
function wa(a){const u=new URL(a.href),t=u.searchParams.get('text')||'';
  if(t.startsWith(TAG))return;u.searchParams.set('text',TAG+'\n'+(t||HELLO));a.href=u.toString().replace(/\+/g,'%20')}
function mail(a){const h=a.getAttribute('href'),i=h.indexOf('?'),addr=i<0?h:h.slice(0,i),q=new URLSearchParams(i<0?'':h.slice(i+1)),s=q.get('subject')||'';
  if(s.startsWith(SUBJ))return;q.set('subject',s?SUBJ+': '+s:SUBJ+(EN?': enquiry from the website':': استفسار من الموقع'));a.setAttribute('href',addr+'?'+q.toString().replace(/\+/g,'%20'))}
function mark(a){try{if(/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(a.href))wa(a);else if(/^mailto:/i.test(a.getAttribute('href')||''))mail(a)}catch(e){}}
// before the browser follows the link (mouse, touch, keyboard or middle click)
['click','auxclick','contextmenu'].forEach(ev=>document.addEventListener(ev,e=>{const a=e.target.closest&&e.target.closest('a[href]');if(a)mark(a)},true));
window.JAHIZ_TAG={TAG,mark};
})();
