/* DeutschDaily Academy: accessible hash routes on GitHub Pages. No server-side rewrite required. */
(() => {
 'use strict';
 const routes = new Set(['dashboard','course','vocabulary','exam','translator','practice','resources']);
 const legacy = {home:'dashboard',a1course:'course',a1review:'vocabulary',a1exam:'exam',alphabet:'practice',lessons:'practice',references:'resources'};
 const sections = () => [...document.querySelectorAll('[data-academy-view]')];
 const slug = () => {
   let path = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
   const route = legacy[path[0]] || path[0] || 'dashboard';
   return {route:routes.has(route)?route:'dashboard',unit:path[0]==='course' && /^a1-\d{2}$/.test(path[1]||'')?path[1]:null};
 };
 const names={dashboard:'Your dashboard',course:'A1 course',vocabulary:'Vocabulary review',exam:'Exam practice',translator:'English–German translator',practice:'Daily practice',resources:'References & backup'};
 function refreshProgress(){
   try {
     const status=JSON.parse(localStorage.getItem('deutschdaily-a1-pathway-v1')||'{}');
     const lessons=window.DEUTSCH_A1?.units||[];
     const done=lessons.filter(u=>['vocabulary','grammar','listening','reading','writing','speaking'].every(x=>status[u.id]?.[x])).length;
     const num=lessons.length||36;
     const text=document.getElementById('academyDashUnits');
     const pct=document.getElementById('academyDashPercent');
     if(text)text.textContent=`${done} of ${num} units practiced →`;
     if(pct)pct.textContent=`${Math.round(done/num*100)}%`;
   }catch{ /* Browser storage is optional */ }
 }
 function navigate(){
   const {route,unit}=slug();
   document.body.classList.add('academy-enhanced');
   for(const el of sections()){
     const active=el.dataset.academyView===route;
     el.hidden=!active;
     el.classList.toggle('is-active',active);
   }
   for(const link of document.querySelectorAll('[data-route]')){
     const active=link.dataset.route===route;
     link.classList.toggle('active',active);
     if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
   }
   document.title=`${names[route]} | DeutschDaily Academy`;
   refreshProgress();
   if(route==='course'&&unit)document.dispatchEvent(new CustomEvent('deutschdaily:open-unit',{detail:{id:unit}}));
   if(!unit)window.scrollTo({top:0,behavior:'instant'});
   const main=document.getElementById('home');
   if(main)main.setAttribute('aria-label',names[route]);
 }
 function init(){
   window.addEventListener('hashchange',navigate);
   window.addEventListener('storage',refreshProgress);
   document.addEventListener('deutschdaily:restore-a1',refreshProgress);
   document.addEventListener('deutschdaily:progress-update',refreshProgress);
   navigate();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init); else init();
})();
