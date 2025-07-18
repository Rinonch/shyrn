// Modern Blog JavaScript with Security & Performance Enhancements
'use strict';

// Security: Prevent global namespace pollution
(function () {
    // Security: Input sanitization function
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Security: XSS prevention for search
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function (m) { return map[m]; });
    }

    // Performance: Debounce function
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Performance: Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Modern: Intersection Observer for animations
    class AnimationObserver {
        constructor() {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    threshold: 0.1,
                    rootMargin: '50px'
                }
            );
        }

        observe(elements) {
            elements.forEach(el => this.observer.observe(el));
        }

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }
    }

    // Modern: Service Worker registration with error handling
    class ServiceWorkerManager {
        static async register() {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('/sw.js', {
                        scope: '/'
                    });

                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // Show update notification
                                this.showUpdateNotification();
                            }
                        });
                    });

                    console.log('ServiceWorker registered successfully');
                    return registration;
                } catch (error) {
                    console.error('ServiceWorker registration failed:', error);
                }
            }
        }

        static showUpdateNotification() {
            const notification = document.createElement('div');
            notification.className = 'update-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <span>New version available!</span>
                    <button onclick="window.location.reload()">Update</button>
                </div>
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
        }
    }

    // Enhanced Search with security and performance
    class BlogSearch {
        constructor() {
            this.searchInput = document.getElementById('searchInput');
            this.blogPosts = document.querySelectorAll('.blog-post');
            this.searchHistory = this.loadSearchHistory();
            this.initializeSearch();
        }

        initializeSearch() {
            if (!this.searchInput) return;

            // Security: Limit input length
            this.searchInput.setAttribute('maxlength', '100');

            // Performance: Debounced search
            const debouncedSearch = debounce((query) => {
                this.performSearch(query);
            }, 300);

            this.searchInput.addEventListener('input', (e) => {
                const query = sanitizeInput(e.target.value);
                debouncedSearch(query);
            });

            // Accessibility: Keyboard navigation
            this.searchInput.addEventListener('keydown', this.handleKeyNavigation.bind(this));
        }

        performSearch(query) {
            const sanitizedQuery = escapeHtml(query.toLowerCase().trim());

            if (sanitizedQuery.length > 0) {
                this.saveToSearchHistory(sanitizedQuery);
            }

            let visibleCount = 0;

            this.blogPosts.forEach(post => {
                const title = post.querySelector('.post-title')?.textContent.toLowerCase() || '';
                const date = post.querySelector('.post-date')?.textContent.toLowerCase() || '';

                if (sanitizedQuery === '' || title.includes(sanitizedQuery) || date.includes(sanitizedQuery)) {
                    post.style.display = 'block';
                    post.style.opacity = '1';
                    visibleCount++;
                } else {
                    post.style.display = 'none';
                    post.style.opacity = '0';
                }
            });

            this.updateSearchResults(visibleCount, sanitizedQuery);

            // Analytics: Track search queries (privacy-safe)
            if (sanitizedQuery.length > 2) {
                this.trackSearch(sanitizedQuery);
            }
        }

        updateSearchResults(visibleCount, query) {
            this.removeNoResultsMessage();

            if (visibleCount === 0 && query !== '') {
                this.showNoResultsMessage(query);
            }
        }

        showNoResultsMessage(query) {
            const noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.innerHTML = `
                <div class="no-results-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <h3>No posts found for "${escapeHtml(query)}"</h3>
                    <p>Try adjusting your search terms or browse all posts</p>
                </div>
            `;
            document.querySelector('.blog-grid').appendChild(noResultsMsg);
        }

        removeNoResultsMessage() {
            const existing = document.querySelector('.no-results');
            if (existing) {
                existing.remove();
            }
        }

        handleKeyNavigation(e) {
            switch (e.key) {
                case 'Escape':
                    this.clearSearch();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.focusFirstResult();
                    break;
            }
        }

        clearSearch() {
            this.searchInput.value = '';
            this.performSearch('');
            this.searchInput.blur();
        }

        focusFirstResult() {
            const firstVisible = Array.from(this.blogPosts).find(post =>
                post.style.display !== 'none'
            );
            if (firstVisible) {
                firstVisible.querySelector('.post-link')?.focus();
            }
        }

        saveToSearchHistory(query) {
            if (!query || query.length < 2) return;

            this.searchHistory = this.searchHistory.filter(item => item !== query);
            this.searchHistory.unshift(query);
            this.searchHistory = this.searchHistory.slice(0, 10); // Keep only 10 recent searches

            try {
                localStorage.setItem('blogSearchHistory', JSON.stringify(this.searchHistory));
            } catch (e) {
                console.warn('Could not save search history:', e);
            }
        }

        loadSearchHistory() {
            try {
                const history = localStorage.getItem('blogSearchHistory');
                return history ? JSON.parse(history) : [];
            } catch (e) {
                console.warn('Could not load search history:', e);
                return [];
            }
        }

        trackSearch(query) {
            // Privacy-safe analytics - no personal data
            console.log(`Search performed: ${query.length} characters`);
        }
    }

    // Performance: Lazy loading images
    class LazyImageLoader {
        constructor() {
            this.imageObserver = new IntersectionObserver(
                this.handleImageIntersection.bind(this),
                { rootMargin: '50px' }
            );
            this.setupLazyLoading();
        }

        setupLazyLoading() {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                this.imageObserver.observe(img);

                // Add loading placeholder
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });

                img.addEventListener('error', () => {
                    this.handleImageError(img);
                });
            });
        }

        handleImageIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    this.imageObserver.unobserve(img);
                }
            });
        }

        handleImageError(img) {
            // Fallback image
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNDAiIGZpbGw9IiMxYTFhMWEiLz48dGV4dCB4PSIyMDAiIHk9IjEyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NjY2NiIgZm9udC1mYW1pbHk9IkludGVyIiBmb250LXNpemU9IjE0Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
            img.classList.add('loaded', 'error');
        }
    }

    // Modern: Performance monitoring
    class PerformanceMonitor {
        static init() {
            // Monitor Core Web Vitals
            this.measureCLS();
            this.measureFID();
            this.measureLCP();
        }

        static measureCLS() {
            if ('web-vital' in window) {
                new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (!entry.hadRecentInput) {
                            console.log('CLS:', entry.value);
                        }
                    }
                }).observe({ entryTypes: ['layout-shift'] });
            }
        }

        static measureFID() {
            if ('PerformanceEventTiming' in window) {
                new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        const delay = entry.processingStart - entry.startTime;
                        console.log('FID:', delay);
                    }
                }).observe({ entryTypes: ['first-input'] });
            }
        }

        static measureLCP() {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    // Security: CSP violation reporting
    function setupCSPReporting() {
        document.addEventListener('securitypolicyviolation', (e) => {
            console.error('CSP Violation:', {
                directive: e.violatedDirective,
                blockedURI: e.blockedURI,
                lineNumber: e.lineNumber,
                originalPolicy: e.originalPolicy
            });
        });
    }

    // Modern: Error boundary for JavaScript errors
    class ErrorHandler {
        static init() {
            window.addEventListener('error', this.handleError);
            window.addEventListener('unhandledrejection', this.handleRejection);
        }

        static handleError(e) {
            console.error('JavaScript Error:', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack
            });

            // Show user-friendly error message
            this.showErrorNotification('Something went wrong. Please try refreshing the page.');
        }

        static handleRejection(e) {
            console.error('Unhandled Promise Rejection:', e.reason);
            e.preventDefault(); // Prevent console error
        }

        static showErrorNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'error-notification';
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 5000);
        }
    }

    // Initialize everything when DOM is ready
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            // Initialize security features
            setupCSPReporting();
            ErrorHandler.init();

            // Initialize performance monitoring
            PerformanceMonitor.init();

            // Initialize core features
            const search = new BlogSearch();
            const lazyLoader = new LazyImageLoader();
            const animator = new AnimationObserver();

            // Setup animations
            const animatableElements = document.querySelectorAll('.blog-post');
            animator.observe(animatableElements);

            // Register service worker
            await ServiceWorkerManager.register();

            // Performance: Preload critical resources
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    // Preload next page resources when browser is idle
                    const criticalLinks = document.querySelectorAll('a[href^="/blog/"]');
                    criticalLinks.forEach(link => {
                        const prefetchLink = document.createElement('link');
                        prefetchLink.rel = 'prefetch';
                        prefetchLink.href = link.href;
                        document.head.appendChild(prefetchLink);
                    });
                });
            }

            console.log('🚀 Blog initialized with modern features');

        } catch (error) {
            console.error('Initialization error:', error);
            ErrorHandler.showErrorNotification('Failed to initialize some features.');
        }
    });

    // Export for global access if needed
    window.BlogApp = {
        search: BlogSearch,
        errorHandler: ErrorHandler,
        version: '2.0.0'
    };

})();