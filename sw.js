const CACHE='health-brief-45810e5f';
const SHELL=['./','./index.html','./archive.html','./manifest.webmanifest',
             './icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL).catch(()=>{})));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(
    ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const isDoc = r.mode==='navigate' || (r.headers.get('accept')||'').includes('text/html');
  if(isDoc){
    e.respondWith(fetch(r).then(res=>{
      const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res;
    }).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
  }else{
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{
      const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res;
    })));
  }
});
