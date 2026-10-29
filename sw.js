/* Versioned offline shell. New external translations cannot be retrieved offline. */
const CACHE='deutschdaily-static-v17-full-a1-audit';
const FILES=['./','./index.html','./styles.css','./app.js','./phrases.js','./lessons.js','./a1-course-data.js','./visual-stories.js','./listening-lab.js','./visual-lab.js','./visual-lab.css','./sentence-builder.js','./sentence-builder.css','./pronunciation-data.js','./pronunciation-lab.js','./pronunciation-lab.css','./a1-mock-data.js','./a1-mock.js','./a1-mock.css','./a1-themes-data.js','./a1-themes.js','./a1-themes.css','./a1-essentials-data.js','./a1-grammar-bridge-data.js','./a1-bridge.js','./a1-bridge.css','./a1-course.js','./academy.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('deutschdaily-static-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(req,copy)));}return response;
 })));
});
