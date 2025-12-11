const CACHE_NAME = 'tractor-app-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json'
    // أضف مسار الأيقونة هنا إذا قمت بتحميلها محلياً
];

// تثبيت Service Worker وتخزين الملفات
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// تفعيل واستعادة الملفات عند عدم وجود إنترنت
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
