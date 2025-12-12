const CACHE_NAME = 'tractor-app-v3';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon512.png',
    'https://cdn.tailwindcss.com'  // أضف CDN إذا أردت التخزين
];

// تثبيت Service Worker
self.addEventListener('install', (e) => {
    console.log('📦 تثبيت Service Worker');
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('✅ الملفات مخزنة في Cache');
                return cache.addAll(ASSETS);
            })
            .catch(error => {
                console.log('❌ خطأ في تخزين الملفات:', error);
            })
    );
    self.skipWaiting();
});

// تفعيل Service Worker
self.addEventListener('activate', (e) => {
    console.log('🚀 Service Worker مفعل');
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('🗑️ حذف Cache قديم:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// إدارة الطلبات
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
            .then(response => {
                // إذا كان الملف موجود في Cache
                if (response) {
                    return response;
                }
                
                // إذا لم يكن موجود، حمله من الشبكة
                return fetch(e.request)
                    .then(response => {
                        // لا تخزن طلبات Cross-Origin
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // خزن في Cache للاستخدام المستقبلي
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(e.request, responseToCache);
                            });
                        
                        return response;
                    });
            })
            .catch(() => {
                // عرض صفحة Offline إذا فشل كل شيء
                if (e.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            })
    );
});
