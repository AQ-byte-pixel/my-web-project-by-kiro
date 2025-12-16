// 主JavaScript文件 - 简单网页系统
// 性能优化的交互增强功能

(function () {
    'use strict';

    // 性能监控 - 跨浏览器兼容
    if ('PerformanceObserver' in window) {
        try {
            const perfObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'navigation') {
                        console.log('页面加载时间:', entry.loadEventEnd - entry.loadEventStart, 'ms');
                    }
                }
            });
            perfObserver.observe({ entryTypes: ['navigation'] });
        } catch (e) {
            // 降级方案
            console.log('性能监控不支持');
        }
    }

    // 图片懒加载优化
    function optimizeImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // 图片即将进入视口，可以进行预处理
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // 平滑滚动优化
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // 使用 requestAnimationFrame 优化滚动性能
                    requestAnimationFrame(() => {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    });
                }
            });
        });
    }

    // 资源预加载优化
    function preloadResources() {
        // 预加载下一个可能访问的资源
        const criticalImages = [
            'assets/images/web-design-icon.svg',
            'assets/images/responsive-icon.svg',
            'assets/images/accessibility-icon.svg',
            'assets/images/performance-icon.svg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // DOM 内容加载完成后初始化
    document.addEventListener('DOMContentLoaded', function () {
        console.log('简单网页系统已加载');

        // 初始化性能优化功能
        optimizeImages();
        initSmoothScroll();
        preloadResources();

        // 报告首屏渲染时间
        if ('performance' in window && 'getEntriesByType' in performance) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const paintEntries = performance.getEntriesByType('paint');
                    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
                    if (fcpEntry) {
                        console.log('首屏内容渲染时间:', fcpEntry.startTime.toFixed(2), 'ms');
                    }
                }, 0);
            });
        }
    });

    // 页面可见性API优化
    if ('visibilityState' in document) {
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') {
                // 页面重新可见时的优化处理
                console.log('页面重新激活');
            }
        });
    }

})();
// 跨浏览器兼容性增强

// Polyfill for older browsers
if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Polyfill for matches
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function (s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) { }
            return i > -1;
        };
}

// 检测浏览器支持
function detectBrowserSupport() {
    const support = {
        flexbox: CSS.supports('display', 'flex'),
        grid: CSS.supports('display', 'grid'),
        customProperties: CSS.supports('color', 'var(--test)'),
        intersectionObserver: 'IntersectionObserver' in window,
        performanceObserver: 'PerformanceObserver' in window
    };

    console.log('浏览器支持情况:', support);
    return support;
}

// 初始化兼容性检测
const browserSupport = detectBrowserSupport();

// 根据浏览器支持情况调整功能
if (!browserSupport.intersectionObserver) {
    // 降级方案：立即加载所有图片
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.removeAttribute('loading');
    });
}

// IE11 特殊处理
if (navigator.userAgent.indexOf('Trident') !== -1) {
    document.body.classList.add('ie11');

    // IE11 不支持 CSS Grid，使用 flexbox 降级
    const gridElements = document.querySelectorAll('.services-grid, .contact-methods');
    gridElements.forEach(element => {
        element.classList.add('ie11-flex-fallback');
    });
}

// Safari 特殊处理
if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
    document.body.classList.add('safari');
}

// Firefox 特殊处理
if (navigator.userAgent.indexOf('Firefox') !== -1) {
    document.body.classList.add('firefox');
}