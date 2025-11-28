// Global site optimizations: accessibility, Trusted Types, lazy media, and chunked hydration
(function () {
    'use strict';

    const idle = (callback) => (
        'requestIdleCallback' in window
            ? window.requestIdleCallback(callback)
            : window.setTimeout(callback, 16)
    );

    const createTrustedPolicy = () => {
        if (!window.trustedTypes) {
            return { createHTML: (value) => value };
        }

        try {
            return window.trustedTypes.createPolicy('blogPolicy', {
                createHTML: (value) => value,
            });
        } catch (error) {
            return window.trustedTypes.getPolicy('blogPolicy');
        }
    };

    const htmlPolicy = createTrustedPolicy();
    let animationObserver = null;

    const registerAnimationObserver = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const targets = document.querySelectorAll('[data-animate]');

        if (!targets.length || prefersReducedMotion) {
            targets.forEach((target) => target.classList.add('is-visible'));
            return;
        }

        if (!('IntersectionObserver' in window)) {
            targets.forEach((target) => target.classList.add('is-visible'));
            return;
        }

        if (!animationObserver) {
            animationObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.15,
            });
        }

        targets.forEach((target) => animationObserver.observe(target));
    };

    const observeAnimatedNode = (node) => {
        if (!node) return;
        if (animationObserver) {
            animationObserver.observe(node);
            return;
        }
        node.classList.add('is-visible');
    };

    const registerLazyImage = (img) => {
        if (!img) return;
        if (!img.hasAttribute('loading')) {
            img.loading = 'lazy';
        }
        img.decoding = 'async';

        if (img.complete) {
            img.setAttribute('data-lazy', 'loaded');
            return;
        }

        img.addEventListener('load', () => {
            img.setAttribute('data-lazy', 'loaded');
        }, { once: true });
    };

    const initLazyMedia = () => {
        document.querySelectorAll('img[data-lazy]').forEach(registerLazyImage);
    };

    const annotateIconButtons = () => {
        document.querySelectorAll('[data-icon-button]').forEach((control) => {
            if (control.getAttribute('aria-label')) return;
            const fallback = control.dataset.iconLabel || control.title || 'Toggle menu';
            control.setAttribute('aria-label', fallback);
        });
    };

    const initMobileMenu = () => {
        const button = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        if (!button || !menu) return;
        const icon = button.querySelector('i');

        const toggleMenu = () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!isExpanded));
            menu.classList.toggle('active');
            
            // Toggle between hamburger and close icon
            if (icon) {
                if (isExpanded) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            }
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        };

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!button.contains(e.target) && !menu.contains(e.target)) {
                if (menu.classList.contains('active')) {
                    button.setAttribute('aria-expanded', 'false');
                    menu.classList.remove('active');
                    document.body.style.overflow = '';
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });

        // Close menu when a menu item is clicked
        const menuItems = menu.querySelectorAll('.mobile-link');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                button.setAttribute('aria-expanded', 'false');
                menu.classList.remove('active');
                document.body.style.overflow = '';
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        button.addEventListener('click', toggleMenu);
    };

    const initSmoothScroll = () => {
        const header = document.querySelector('header');
        const offset = header ? header.offsetHeight : 72;

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (event) => {
                const hash = anchor.getAttribute('href');
                if (!hash || hash === '#') return;
                const target = document.querySelector(hash);
                if (!target) return;
                event.preventDefault();

                const { top } = target.getBoundingClientRect();
                window.scrollTo({
                    top: window.scrollY + top - offset,
                    behavior: 'smooth',
                });

                const menu = document.getElementById('mobile-menu');
                const button = document.getElementById('mobile-menu-button');
                if (menu && button && !menu.classList.contains('hidden')) {
                    button.click();
                }
            });
        });
    };

    const initBackToTop = () => {
        const button = document.getElementById('back-to-top');
        if (!button) return;

        let ticking = false;
        const reveal = () => {
            const shouldShow = window.scrollY > 300;
            button.classList.toggle('opacity-0', !shouldShow);
            button.classList.toggle('invisible', !shouldShow);
            button.classList.toggle('opacity-100', shouldShow);
            button.classList.toggle('visible', shouldShow);
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(reveal);
                ticking = true;
            }
        }, { passive: true });

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    const posts = [
        {
            title: 'The Future of AI in Web Development',
            excerpt: 'Discover how artificial intelligence is revolutionizing the way we build and interact with websites and web applications.',
            date: 'October 18, 2025',
            category: 'AI & ML',
            readTime: '5 min read',
            imageAvif: 'img/ai.avif',
            imageWebp: 'img/ai.webp',
        },
        {
            title: 'Responsive Design in 2025: Best Practices',
            excerpt: 'Explore the latest techniques for creating responsive websites that work flawlessly across all devices and screen sizes.',
            date: 'October 15, 2025',
            category: 'Web Dev',
            readTime: '7 min read',
            imageAvif: 'img/responsive.avif',
        },
        {
            title: 'Getting Started with React 19',
            excerpt: 'A comprehensive guide to the new features and improvements in React 19 for modern web development.',
            date: 'October 10, 2025',
            category: 'Web Dev',
            readTime: '8 min read',
            imageAvif: 'img/react.avif',
        },
        {
            title: "Vue.js 4: What's New",
            excerpt: 'Discover the exciting new features and performance improvements in Vue.js 4 and how they can benefit your projects.',
            date: 'October 5, 2025',
            category: 'Web Dev',
            readTime: '6 min read',
            imageAvif: 'img/vue-js.avif',
        },
        {
            title: 'Modern JavaScript: ES2025 Features',
            excerpt: 'Stay up-to-date with the latest JavaScript features and syntax improvements in ES2025.',
            date: 'September 28, 2025',
            category: 'JavaScript',
            readTime: '9 min read',
            imageAvif: 'img/es6.avif',
        },
        {
            title: 'Building Scalable Web Applications',
            excerpt: 'Learn the best practices and architectural patterns for building highly scalable web applications.',
            date: 'September 20, 2025',
            category: 'Web Dev',
            readTime: '10 min read',
            imageAvif: 'img/web-app.avif',
        },
    ];

    const createPostCard = (post) => {
        const article = document.createElement('article');
        article.className = 'group bg-white rounded-xl overflow-hidden shadow-md flex flex-col h-full elevated-card';
        article.setAttribute('data-animate', '');
        const categoryTheme = post.category === 'AI & ML' ? 'primary' : 'secondary';

        const conditionalSource = post.imageWebp
            ? `<source srcset="${post.imageWebp}" type="image/webp">`
            : '';

        const markup = `
            <div class="relative overflow-hidden h-48">
                <picture>
                    <source srcset="${post.imageAvif}" type="image/avif">
                    ${conditionalSource}
                    <img src="${post.imageAvif}" alt="${post.title}" width="640" height="384" data-lazy="true" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 45vw, 90vw">
                </picture>
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <span class="text-white text-sm font-medium">Read more →</span>
                </div>
            </div>
            <div class="p-6 flex-1 flex flex-col">
                <div class="flex items-center space-x-2 mb-3">
                    <span class="px-3 py-1 bg-${categoryTheme}-100 text-${categoryTheme}-700 text-xs font-medium rounded-full">${post.category}</span>
                    <span class="text-xs text-gray-600">${post.readTime}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                    <a href="#" class="hover:underline focus-visible:underline">${post.title}</a>
                </h3>
                <p class="text-gray-600 mb-4 flex-1">${post.excerpt}</p>
                <div class="flex items-center pt-4 border-t border-gray-100">
                    <span class="text-xs text-gray-500">${post.date}</span>
                </div>
            </div>
        `;

        article.innerHTML = htmlPolicy.createHTML(markup);
        article.querySelectorAll('img[data-lazy]').forEach(registerLazyImage);
        observeAnimatedNode(article);
        return article;
    };

    const hydrateDynamicPosts = () => {
        const container = document.querySelector('[data-dynamic-posts]');
        if (!container) return;
        container.setAttribute('role', 'list');

        let index = 0;
        const total = posts.length;

        const renderBatch = () => {
            const fragment = document.createDocumentFragment();
            let itemsProcessed = 0;
            while (index < total && itemsProcessed < 2) {
                fragment.appendChild(createPostCard(posts[index]));
                index += 1;
                itemsProcessed += 1;
            }
            container.appendChild(fragment);

            if (index < total) {
                idle(renderBatch);
            }
        };

        idle(renderBatch);
    };

    document.addEventListener('DOMContentLoaded', () => {
        // Initialize sidebar
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const closeSidebar = document.getElementById('close-sidebar');

        // Toggle sidebar
        function toggleSidebar() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        }

        // Event listeners
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', toggleSidebar);
        }
        
        if (closeSidebar) {
            closeSidebar.addEventListener('click', toggleSidebar);
        }
        
        if (overlay) {
            overlay.addEventListener('click', toggleSidebar);
        }

        // Close sidebar when clicking on a link
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Initialize other components
        annotateIconButtons();
        initMobileMenu();
        initSmoothScroll();
        initBackToTop();
        initLazyMedia();
        registerAnimationObserver();
        hydrateDynamicPosts();
    });
})();
