// Glass Morphism Portfolio - JavaScript
class PortfolioApp {
    constructor() {
        this.currentPage = 'home';
        this.isTransitioning = false;
        this.emailjsInitialized = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeEmailJS();
        this.setupIntersectionObserver();
        this.addScrollEffects();
        console.log('Portfolio app initialized');
    }

    setupEventListeners() {
        // Navigation event listeners
        const navPills = document.querySelectorAll('.nav-pill');
        navPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = pill.getAttribute('data-page');
                this.navigateToPage(targetPage);
            });
        });

        // Button navigation event listeners
        const navigationButtons = document.querySelectorAll('[data-page]');
        navigationButtons.forEach(button => {
            if (!button.classList.contains('nav-pill')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetPage = button.getAttribute('data-page');
                    this.navigateToPage(targetPage);
                });
            }
        });

        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            // Setup real-time email validation
            this.setupEmailValidation();
            contactForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.navigateToPage('home');
            }
        });

        // Browser back/forward buttons and hash changes
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.navigateToPage(page, false);
        });

        // Handle hash changes for file:// protocol compatibility
        window.addEventListener('hashchange', (e) => {
            const hash = window.location.hash.slice(1);
            const page = hash || 'home';
            if (page !== this.currentPage) {
                this.navigateToPage(page, false);
            }
        });
    }

    async navigateToPage(targetPage, pushState = true) {
        if (this.isTransitioning || targetPage === this.currentPage) {
            return;
        }

        this.isTransitioning = true;

        try {
            // Update URL without reloading (with fallback for file:// protocol)
            if (pushState) {
                try {
                    const url = targetPage === 'home' ? '#home' : `#${targetPage}`;
                    history.pushState({ page: targetPage }, '', url);
                } catch (historyError) {
                    // Fallback for file:// protocol - just update hash
                    console.log('Using hash fallback for navigation');
                    window.location.hash = targetPage === 'home' ? '#home' : `#${targetPage}`;
                }
            }

            // Update navigation
            this.updateNavigation(targetPage);

            // Smooth page transition
            await this.performPageTransition(targetPage);

            this.currentPage = targetPage;
            
            // Add entrance animations
            this.addPageAnimations();
            
        } catch (error) {
            console.error('Navigation error:', error);
            this.showNotification('Navigation error occurred', 'error');
        } finally {
            this.isTransitioning = false;
        }
    }


    updateNavigation(targetPage) {
        const navPills = document.querySelectorAll('.nav-pill');
        navPills.forEach(pill => {
            pill.classList.remove('active');
            if (pill.getAttribute('data-page') === targetPage) {
                pill.classList.add('active');
            }
        });
    }

    async performPageTransition(targetPage) {
        const currentPageElement = document.querySelector('.page.active');
        const targetPageElement = document.getElementById(targetPage);

        if (!targetPageElement) {
            throw new Error(`Page ${targetPage} not found`);
        }

        // Fade out current page
        if (currentPageElement) {
            currentPageElement.classList.add('fade-out');
            await this.sleep(250);
            currentPageElement.classList.remove('active', 'fade-out');
        }

        // Small delay for smooth transition
        await this.sleep(100);

        // Fade in target page
        targetPageElement.classList.add('active');
        await this.sleep(50);
        
        // Trigger reflow for smooth animation
        targetPageElement.offsetHeight;
    }

    addPageAnimations() {
        const activePage = document.querySelector('.page.active');
        if (!activePage) return;

        // Animate glass cards
        const cards = activePage.querySelectorAll('.glass-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100 + 200);
        });

        // Animate other elements
        const animateElements = activePage.querySelectorAll('.skill-item, .experience-card, .project-card, .timeline-item, .contact-item');
        animateElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
            }, index * 50 + 300);
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all animatable elements
        document.querySelectorAll('.glass-card, .skill-item, .project-card').forEach(el => {
            observer.observe(el);
        });
    }

    addScrollEffects() {
        // Parallax effect for navigation
        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const nav = document.querySelector('.glass-nav');
            
            if (nav) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    nav.style.transform = 'translateX(-50%) translateY(-100%)';
                } else {
                    nav.style.transform = 'translateX(-50%) translateY(0)';
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }

    // EmailJS Integration
    initializeEmailJS() {
        if (this.emailjsInitialized) {
            console.log("EmailJS already initialized");
            return true;
        }

        if (typeof emailjs !== 'undefined') {
            try {
                emailjs.init("7DIA1QXYHngdQJuxd");
                this.emailjsInitialized = true;
                console.log("EmailJS initialized successfully");
                return true;
            } catch (error) {
                console.error("Error initializing EmailJS:", error);
                return false;
            }
        } else {
            console.error("EmailJS not available");
            // Retry after a delay if EmailJS isn't loaded yet
            setTimeout(() => this.initializeEmailJS(), 1000);
            return false;
        }
    }

    isValidEmail(email) {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    // Function to verify reCAPTCHA
    async verifyRecaptcha() {
        const response = grecaptcha.getResponse();
        if (!response) {
            this.showNotification('Please complete the reCAPTCHA verification', 'error');
            return false;
        }
        return true;
    }

    // Function to reset reCAPTCHA
    resetRecaptcha() {
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
        }
    }

    // Setup real-time email validation
    setupEmailValidation() {
        const emailInput = document.querySelector('input[name="from_email"]');
        if (!emailInput) {
            console.error('Email input field not found');
            return;
        }

        console.log('Setting up email validation for:', emailInput);

        // Create error message element if it doesn't exist
        let errorElement = emailInput.parentNode.querySelector('.email-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'email-error';
            errorElement.style.color = 'var(--error-color)';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '0.25rem';
            errorElement.style.display = 'none';
            emailInput.parentNode.appendChild(errorElement);
        }

        // Add input event listener for real-time validation
        emailInput.addEventListener('input', () => {
            const email = emailInput.value;
            if (email && !this.isValidEmail(email)) {
                errorElement.textContent = 'Please enter a valid email address';
                errorElement.style.display = 'block';
                emailInput.style.borderColor = 'var(--error-color)';
                emailInput.classList.add('error');
            } else {
                errorElement.style.display = 'none';
                emailInput.style.borderColor = '';
                emailInput.classList.remove('error');
            }
        });

        // Also validate on blur (when user leaves the field)
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value;
            if (email && !this.isValidEmail(email)) {
                errorElement.textContent = 'Please enter a valid email address';
                errorElement.style.display = 'block';
                emailInput.style.borderColor = 'var(--error-color)';
                emailInput.classList.add('error');
            } else {
                errorElement.style.display = 'none';
                emailInput.style.borderColor = '';
                emailInput.classList.remove('error');
            }
        });
    }

    async handleFormSubmission(e) {
        e.preventDefault();
        console.log("Form submitted");

        // Verify reCAPTCHA first
        const isRecaptchaValid = await this.verifyRecaptcha();
        if (!isRecaptchaValid) {
            return;
        }

        // Check if EmailJS is ready
        if (!this.emailjsInitialized) {
            this.showNotification('Email service not ready. Please refresh the page.', 'error');
            return;
        }

        const form = e.target;
        const formData = new FormData(form);
        const name = formData.get('from_name');
        const email = formData.get('from_email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        console.log("Form data:", { name, email, subject, message });

        // Validate email
        if (!this.isValidEmail(email)) {
            console.log("Invalid email:", email);
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        const data = {
            to_name: "Aarav Jaichand Maintenance Team",
            from_name: name,
            from_email: email,
            message: message,
            subject: subject
        };

        console.log('Form data being sent:', data);

        // Get button and store original state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        const originalButtonState = submitButton.disabled;

        try {
            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            submitButton.classList.add('loading');

            console.log('Attempting to send email...');
            console.log('EmailJS available:', this.emailjsInitialized);

            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timed out')), 10000);
            });

            // Race between email sending and timeout
            const result = await Promise.race([
                new Promise((resolve, reject) => {
                    if (!this.emailjsInitialized) {
                        reject(new Error('EmailJS not initialized'));
                        return;
                    }

                    emailjs.send('service_hhrrtts', 'template_e0mp1qo', data)
                        .then(response => {
                            console.log('EmailJS response:', response);
                            resolve(response);
                        })
                        .catch(error => {
                            console.error('EmailJS error details:', error);
                            reject(error);
                        });
                }),
                timeoutPromise
            ]);

            console.log('Email sent successfully:', result);

            // Show success message
            this.showNotification('Message sent successfully!', 'success');
            form.reset();
            // Reset reCAPTCHA after successful submission
            this.resetRecaptcha();
        } catch (error) {
            // Show error message
            console.error('Detailed error:', error);
            if (error.message === 'Request timed out') {
                this.showNotification('Request timed out. Please try again.', 'error');
            } else if (error.message === 'EmailJS not initialized') {
                this.showNotification('Email service not ready. Please refresh the page.', 'error');
            } else if (error.message.includes('message port closed')) {
                this.showNotification('Connection error. Please try again.', 'error');
            } else {
                this.showNotification('Failed to send message: ' + error.message, 'error');
            }
            // Reset reCAPTCHA on error
            this.resetRecaptcha();
        } finally {
            // Reset button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = originalButtonState;
            submitButton.classList.remove('loading');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}

// Enhanced smooth scrolling for anchor links
function smoothScrollToElement(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS animation classes
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .glass-nav {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .loading-overlay {
        transition: opacity 0.3s ease;
    }

    /* Enhanced button hover effects */
    .btn-primary, .btn-secondary {
        position: relative;
        overflow: hidden;
    }

    .btn-primary::before, .btn-secondary::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }

    .btn-primary:hover::before, .btn-secondary:hover::before {
        width: 300px;
        height: 300px;
    }

    /* Enhance glass card interactions */
    .glass-card {
        position: relative;
        overflow: hidden;
    }

    .glass-card::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transform: rotate(45deg);
        transition: transform 0.6s;
        pointer-events: none;
    }

    .glass-card:hover::after {
        transform: rotate(45deg) translate(50%, 50%);
    }
`;

document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// We'll only use the load event as a backup if DOMContentLoaded didn't work
window.addEventListener('load', function () {
    console.log('Window Loaded - Checking if already initialized');
    if (!window.portfolioApp) {
        console.log('Portfolio app not initialized yet, initializing now');
        window.portfolioApp = new PortfolioApp();
    } else {
        console.log('Portfolio app already initialized, skipping');
    }
});

// Handle initial page load with hash
window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
        setTimeout(() => {
            const app = window.portfolioApp || new PortfolioApp();
            app.navigateToPage(hash, false);
        }, 100);
    } else if (window.portfolioApp) {
        // Ensure home page is displayed if no hash
        window.portfolioApp.navigateToPage('home', false);
    }
});

// Add enhanced touch support for mobile
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, {passive: true});
}

// Performance optimization - lazy load images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
});

// Observe all images with data-src attribute
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Add preloader for better UX
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 300);
    }
});

// Enhanced error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e);
    // Could implement error reporting here
});

// Add service worker for better performance (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}