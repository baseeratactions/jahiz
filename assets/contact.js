'use strict';
// Jahiz contact details on every public page: the phone, WhatsApp and email come from config.js
// (or from the manager's site settings through sitetext.js). Pages carry empty contact links only;
// this script fills them, and keeps each one hidden while its value is not set.
(function(){
var st=document.createElement('style');st.textContent='[data-ct][hidden]{display:none!important}';document.head.appendChild(st);
function mark(){
  document.querySelectorAll('a[href="https://wa.me/"]:not([id])').forEach(function(a){a.setAttribute('data-ct','wa')});
  document.querySelectorAll('a[href="tel:"]').forEach(function(a){a.setAttribute('data-ct','tel')});
  document.querySelectorAll('a[href="mailto:"]').forEach(function(a){a.setAttribute('data-ct','mail')});
}
function run(){
  var C=window.JAHIZ_CONFIG||{},wa=String(C.WHATSAPP||'').replace(/\D/g,''),em=String(C.EMAIL||'').trim();
  var ph=String(C.PHONE||'').trim(),phd=ph.replace(/\D/g,'')||wa,phText=ph||(wa?'+'+wa:'');
  document.querySelectorAll('a[data-ct]').forEach(function(a){
    var k=a.getAttribute('data-ct'),pre=a.getAttribute('data-pre')||'',on=false;
    if(k==='wa'){on=!!wa;if(on)a.href='https://wa.me/'+wa}
    else if(k==='tel'){on=!!phd;if(on){a.href='tel:+'+phd;if(a.hasAttribute('data-phone'))a.textContent=pre+phText}}
    else if(k==='mail'){on=!!em;if(on){a.href='mailto:'+em;if(a.hasAttribute('data-mail'))a.textContent=pre+em}}
    a.hidden=!on;
  });
  document.querySelectorAll('.links,footer .fc').forEach(function(c){
    var any=[].some.call(c.querySelectorAll('a'),function(a){return !a.hidden});c.hidden=!any;
  });
}
mark();run();
window.jahizContact=run;
})();
