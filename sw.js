/* Mathescent service worker: network first so updates show up right away,
   with a cached copy as a fallback so the site still opens offline. */
var CACHE="mathescent-v1";
var FILES=["./","index.html","style.css","script.js","extras.js","manifest.webmanifest","icon.svg"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  var req=e.request;
  if(req.method!=="GET")return;
  var url=new URL(req.url);
  if(url.origin!==location.origin&&url.hostname.indexOf("fonts.g")<0)return;
  e.respondWith(fetch(req).then(function(res){
    if(res&&res.ok){var copy=res.clone();caches.open(CACHE).then(function(c){c.put(req,copy)})}
    return res}).catch(function(){return caches.match(req).then(function(m){return m||caches.match("index.html")})}))});
