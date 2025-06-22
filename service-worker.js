self.addEventListener("install", (e) => {
  console.log("[ServiceWorker] Installed");
  e.waitUntil(
    caches.open("sennin-cache").then((cache) =>
      cache.addAll([
        "index.html",
        "script.js",
        "style.css",
        "manifest.json"
      ])
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) =>
      response || fetch(e.request)
    )
  );
});
