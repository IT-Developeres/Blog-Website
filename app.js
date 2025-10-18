// JavaScript for dynamic blog posts and mobile menu
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('block');
        });
    }

    // Sample blog posts data
    const blogPosts = [
        {
            title: "The Future of AI in Web Development",
            excerpt: "Discover how artificial intelligence is revolutionizing the way we build and interact with websites and web applications.",
            date: "October 18, 2025",
            category: "AI & ML",
            readTime: "5 min read",
            image: "img/ai.avif"
        },
        {
            title: "Responsive Design in 2025: Best Practices",
            excerpt: "Explore the latest techniques for creating responsive websites that work flawlessly across all devices and screen sizes.",
            date: "October 15, 2025",
            category: "Web Dev",
            readTime: "7 min read",
            image: "img/responsive.avif",
            author: {
                name: "Mike Chen",
                role: "Frontend Developer",
                avatar: "MC"
            }
        },
        {
            title: "Getting Started with React 19",
            excerpt: "A comprehensive guide to the new features and improvements in React 19 for modern web development.",
            date: "October 10, 2025",
            category: "Web Dev",
            readTime: "8 min read",
            image: "img/react.avif"
        },
        {
            title: "Vue.js 4: What's New",
            excerpt: "Discover the exciting new features and performance improvements in Vue.js 4 and how they can benefit your projects.",
            date: "October 5, 2025",
            category: "Web Dev",
            readTime: "6 min read",
            image: "img/vue-js.avif",
            author: {
                name: "Emily Davis",
                role: "Vue.js Developer",
                avatar: "ED"
            }
        },
        {
            title: "Modern JavaScript: ES2025 Features",
            excerpt: "Stay up-to-date with the latest JavaScript features and syntax improvements in ES2025.",
            date: "September 28, 2025",
            category: "JavaScript",
            readTime: "9 min read",
            image: "img/es6.avif",
            author: {
                name: "David Kim",
                role: "JavaScript Engineer",
                avatar: "DK"
            }
        },
        {
            title: "Building Scalable Web Applications",
            excerpt: "Learn the best practices and architectural patterns for building highly scalable web applications.",
            date: "September 20, 2025",
            category: "Web Dev",
            readTime: "10 min read",
            image: "img/web-app.avif",
            author: {
                name: "Lisa Wong",
                role: "Full Stack Developer",
                avatar: "LW"
            }
        }
    ];

    // Function to generate blog post cards
    function generateBlogPosts() {
        const postsContainer = document.getElementById('posts-container');

        if (!postsContainer) return;

        // Clear any existing content
        postsContainer.innerHTML = '';

        blogPosts.forEach(post => {
            const postCard = document.createElement('article');
            postCard.className = 'group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full';

            postCard.innerHTML = `
                <div class="relative overflow-hidden h-48">
                    <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                        <span class="text-white text-sm font-medium">Read more →</span>
                    </div>
                </div>
                <div class="p-6 flex-1 flex flex-col">
                    <div class="flex items-center space-x-2 mb-3">
                        <span class="px-3 py-1 bg-${post.category === 'AI & ML' ? 'primary' : 'secondary'}-100 text-${post.category === 'AI & ML' ? 'primary' : 'secondary'}-700 text-xs font-medium rounded-full">
                            ${post.category}
                        </span>
                        <span class="text-xs text-gray-500">${post.readTime}</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                        <a href="#" class="hover:underline">${post.title}</a>
                    </h3>
                    <p class="text-gray-600 mb-4 flex-1">${post.excerpt}</p>
                    <div class="flex items-center pt-4 border-t border-gray-100">
                        <span class="text-xs text-gray-500">${post.date}</span>
                    </div>
                </div>
            `;

            postsContainer.appendChild(postCard);
        });
    }

    // Newsletter form submission
    const newsletterForms = document.querySelectorAll('form.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (email && validateEmail(email)) {
                // Here you would typically send this to your server
                console.log('Subscribed with email:', email);

                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'mt-4 p-3 bg-green-100 text-green-700 rounded-md text-sm';
                successMessage.textContent = 'Thank you for subscribing! Please check your email to confirm.';

                // Insert after the form
                this.parentNode.insertBefore(successMessage, this.nextSibling);

                // Clear the input
                emailInput.value = '';

                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            } else {
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm';
                errorMessage.textContent = 'Please enter a valid email address.';

                // Insert after the form
                this.parentNode.insertBefore(errorMessage, this.nextSibling);

                // Remove error message after 3 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 3000);
            }
        });
    });

    // Email validation helper function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenuButton.click();
                }
            }
        });
    });

    // Initialize blog posts when DOM is loaded
    generateBlogPosts();

    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in-up, .fade-in, .slide-in-left, .slide-in-right');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('opacity-100', 'translate-y-0');
            }
        });
    };

    // Run once on load
    animateOnScroll();

    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'fixed bottom-6 right-6 bg-primary-600 text-white p-3 rounded-full shadow-lg opacity-0 invisible transition-all duration-300 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);

    // Show/hide back to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.remove('opacity-100', 'visible');
            backToTopButton.classList.add('opacity-0', 'invisible');
        }
    });

    // Scroll to top on click
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});