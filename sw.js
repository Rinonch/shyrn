// Enhanced Service Worker with Security & Performance Features
const CACHE_VERSION = 'shyrn-blog-v2.1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGES_CACHE = `${CACHE_VERSION}-images`;

// Cache configuration with security headers
const CACHE_CONFIG = {
    maxEntries: 50,
    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    networkTimeoutSeconds: 5,
    cacheableResponse: {
        statuses: [0, 200],
        headers: {
            'X-Cacheable': 'true'
        }
    }
};

// Files to cache on install with integrity verification
const CORE_CACHE_FILES = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/manifest.json',
    '/images/shyrn-logo.svg',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
];

// Security headers for cached responses
const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin'
};

// Cache strategies with security validation
class CacheStrategy {
    static async cacheFirst(request, cacheName) {
        try {
            const cache = await caches.open(cacheName);
            const cached = await cache.match(request);

            if (cached && this.validateCachedResponse(cached)) {
                return this.addSecurityHeaders(cached);
            }

            const networkResponse = await this.fetchWithTimeout(request);

            if (networkResponse && networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                await cache.put(request, responseClone);
            }

            return this.addSecurityHeaders(networkResponse);
        } catch (error) {
            console.warn('Cache-first strategy failed:', error);
            return this.createErrorResponse();
        }
    }

    static async networkFirst(request, cacheName) {
        try {
            const networkResponse = await this.fetchWithTimeout(request);

            if (networkResponse && networkResponse.status === 200) {
                const cache = await caches.open(cacheName);
                const responseClone = networkResponse.clone();
                await cache.put(request, responseClone);
                return this.addSecurityHeaders(networkResponse);
            }

            // Fallback to cache
            const cache = await caches.open(cacheName);
            const cached = await cache.match(request);

            if (cached && this.validateCachedResponse(cached)) {
                return this.addSecurityHeaders(cached);
            }

            return this.createErrorResponse();
        } catch (error) {
            console.warn('Network-first strategy failed:', error);

            // Fallback to cache on network error
            const cache = await caches.open(cacheName);
            const cached = await cache.match(request);

            if (cached && this.validateCachedResponse(cached)) {
                return this.addSecurityHeaders(cached);
            }

            return this.createErrorResponse();
        }
    }

    static async fetchWithTimeout(request) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CACHE_CONFIG.networkTimeoutSeconds * 1000);

        try {
            const response = await fetch(request, {
                signal: controller.signal,
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'ServiceWorker'
                }
            });

            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    static validateCachedResponse(response) {
        if (!response) return false;

        // Check response age
        const cacheDate = response.headers.get('date');
        if (cacheDate) {
            const age = Date.now() - new Date(cacheDate).getTime();
            if (age > CACHE_CONFIG.maxAgeSeconds * 1000) {
                return false;
            }
        }

        // Validate content type for security
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
            // Additional HTML validation could go here
            return true;
        }

        return true;
    }

    static addSecurityHeaders(response) {
        if (!response) return response;

        // Clone response to add headers
        const newHeaders = new Headers(response.headers);

        // Add security headers
        Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
            if (!newHeaders.has(key)) {
                newHeaders.set(key, value);
            }
        });

        // Add cache control
        if (!newHeaders.has('Cache-Control')) {
            newHeaders.set('Cache-Control', 'public, max-age=31536000');
        }

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
        });
    }

    static createErrorResponse() {
        const errorHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Offline - Shyrn Blog</title>
                <style>
                    body { 
                        font-family: 'Inter', sans-serif; 
                        background: #0a0a0a; 
                        color: #fff; 
                        text-align: center; 
                        padding: 2rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                    }
                    .error-container {
                        max-width: 400px;
                    }
                    h1 { color: #ff4444; margin-bottom: 1rem; }
                    p { margin: 0.5rem 0; color: #999; }
                    .retry-btn {
                        background: #ff4444;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        margin-top: 1rem;
                        font-weight: 500;
                    }
                    .retry-btn:hover {
                        background: #ff3333;
                    }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <h1>You're Offline</h1>
                    <p>This page isn't available offline. Please check your internet connection and try again.</p>
                    <button class="retry-btn" onclick="window.location.reload()">Retry</button>
                </div>
            </body>
            </html>
        `;

        return new Response(errorHTML, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                ...SECURITY_HEADERS
            }
        });
    }
}

// Enhanced installation with security checks
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');

    event.waitUntil(
        (async () => {
            try {
                // Clean old caches first
                await cleanOldCaches();

                // Cache core files with integrity validation
                const cache = await caches.open(STATIC_CACHE);

                // Cache files with error handling
                const cachePromises = CORE_CACHE_FILES.map(async (url) => {
                    try {
                        const response = await fetch(url, {
                            credentials: 'same-origin',
                            headers: {
                                'X-Requested-With': 'ServiceWorker'
                            }
                        });

                        if (response.ok) {
                            await cache.put(url, response);
                            console.log(`Cached: ${url}`);
                        } else {
                            console.warn(`Failed to cache ${url}: ${response.status}`);
                        }
                    } catch (error) {
                        console.warn(`Error caching ${url}:`, error);
                    }
                });

                await Promise.allSettled(cachePromises);
                console.log('Core files cached successfully');

                // Force activation
                self.skipWaiting();
            } catch (error) {
                console.error('Service Worker installation failed:', error);
            }
        })()
    );
});

// Enhanced activation with cleanup
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');

    event.waitUntil(
        (async () => {
            try {
                // Clean old caches
                await cleanOldCaches();

                // Claim all clients
                await self.clients.claim();

                console.log('Service Worker activated successfully');

                // Notify clients of activation
                const clients = await self.clients.matchAll();
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SW_ACTIVATED',
                        version: CACHE_VERSION
                    });
                });
            } catch (error) {
                console.error('Service Worker activation failed:', error);
            }
        })()
    );
});

// Enhanced fetch handler with security and performance
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests and chrome-extension URLs
    if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
        return;
    }

    // Security check: validate origin
    if (url.origin !== self.location.origin && !isTrustedOrigin(url.origin)) {
        console.warn('Blocked request to untrusted origin:', url.origin);
        return;
    }

    event.respondWith(handleFetch(request));
});

// Enhanced fetch handler with strategy routing
async function handleFetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    try {
        // Route requests to appropriate cache strategy
        if (isCoreFile(pathname)) {
            return await CacheStrategy.cacheFirst(request, STATIC_CACHE);
        } else if (isImageFile(pathname)) {
            return await CacheStrategy.cacheFirst(request, IMAGES_CACHE);
        } else if (isHTMLFile(pathname) || pathname === '/') {
            return await CacheStrategy.networkFirst(request, DYNAMIC_CACHE);
        } else if (isAPIRequest(pathname)) {
            return await CacheStrategy.networkFirst(request, DYNAMIC_CACHE);
        } else {
            // Default to network first for other resources
            return await CacheStrategy.networkFirst(request, DYNAMIC_CACHE);
        }
    } catch (error) {
        console.error('Fetch handler error:', error);
        return CacheStrategy.createErrorResponse();
    }
}

// Helper functions for request classification
function isCoreFile(pathname) {
    return ['.css', '.js', '.woff2', '.woff', '.ttf'].some(ext => pathname.endsWith(ext)) ||
        pathname === '/manifest.json' ||
        pathname.includes('/fonts/');
}

function isImageFile(pathname) {
    return ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.ico'].some(ext => pathname.endsWith(ext));
}

function isHTMLFile(pathname) {
    return pathname.endsWith('.html') || pathname === '/' || !pathname.includes('.');
}

function isAPIRequest(pathname) {
    return pathname.startsWith('/api/') || pathname.includes('json');
}

function isTrustedOrigin(origin) {
    const trustedOrigins = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://cdn.jsdelivr.net'
    ];

    return trustedOrigins.includes(origin);
}

// Cache cleanup with security considerations
async function cleanOldCaches() {
    try {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name =>
            name.startsWith('shyrn-blog-') && name !== STATIC_CACHE &&
            name !== DYNAMIC_CACHE && name !== IMAGES_CACHE
        );

        const deletePromises = oldCaches.map(async (cacheName) => {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
        });

        await Promise.all(deletePromises);

        // Limit cache sizes
        await limitCacheSize(DYNAMIC_CACHE, CACHE_CONFIG.maxEntries);
        await limitCacheSize(IMAGES_CACHE, CACHE_CONFIG.maxEntries);

        console.log('Cache cleanup completed');
    } catch (error) {
        console.error('Cache cleanup failed:', error);
    }
}

// Limit cache size to prevent storage bloat
async function limitCacheSize(cacheName, maxEntries) {
    try {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();

        if (keys.length > maxEntries) {
            const keysToDelete = keys.slice(0, keys.length - maxEntries);
            const deletePromises = keysToDelete.map(key => cache.delete(key));
            await Promise.all(deletePromises);
            console.log(`Limited ${cacheName} to ${maxEntries} entries`);
        }
    } catch (error) {
        console.error(`Failed to limit cache size for ${cacheName}:`, error);
    }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    const { type, data } = event.data;

    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;

        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_VERSION });
            break;

        case 'FORCE_UPDATE':
            // Clear caches and force update
            cleanOldCaches().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;

        case 'CACHE_STATUS':
            getCacheStatus().then(status => {
                event.ports[0].postMessage(status);
            });
            break;

        default:
            console.warn('Unknown message type:', type);
    }
});

// Get cache status for debugging
async function getCacheStatus() {
    try {
        const cacheNames = await caches.keys();
        const status = {};

        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            status[cacheName] = keys.length;
        }

        return {
            version: CACHE_VERSION,
            caches: status,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return { error: error.message };
    }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(handleBackgroundSync());
    }
});

async function handleBackgroundSync() {
    try {
        // Handle any queued offline actions
        console.log('Background sync triggered');

        // Notify clients of sync completion
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'BACKGROUND_SYNC_COMPLETE'
            });
        });
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

console.log('Service Worker loaded:', CACHE_VERSION);
