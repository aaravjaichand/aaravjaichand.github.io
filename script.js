// EmailJS Configuration
let emailjsInitialized = false;
let formInitialized = false;

// Function to check if EmailJS is ready
function isEmailJSReady() {
    return typeof emailjs !== 'undefined' && emailjsInitialized;
}

// Initialize EmailJS
function initializeEmailJS() {
    if (emailjsInitialized) {
        console.log("EmailJS already initialized");
        return true;
    }

    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init("7DIA1QXYHngdQJuxd");
            emailjsInitialized = true;
            console.log("EmailJS initialized successfully");
            return true;
        } catch (error) {
            console.error("Error initializing EmailJS:", error);
            return false;
        }
    } else {
        console.error("EmailJS not available");
        return false;
    }
}

// Email validation function
function isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

// Setup real-time email validation
function setupEmailValidation() {
    // Find the email input by name attribute instead of ID
    const emailInput = document.querySelector('input[name="from_email"]');
    if (!emailInput) {
        console.error('Email input field not found');
        return;
    }

    console.log('Setting up email validation for:', emailInput);

    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'email-error';
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.display = 'none';
    emailInput.parentNode.appendChild(errorElement);

    // Add input event listener for real-time validation
    emailInput.addEventListener('input', function () {
        const email = this.value;
        console.log('Email input changed:', email);
        if (email && !isValidEmail(email)) {
            errorElement.textContent = 'Please enter a valid email address';
            errorElement.style.display = 'block';
            this.style.borderColor = 'red';
        } else {
            errorElement.style.display = 'none';
            this.style.borderColor = '';
        }
    });

    // Also validate on blur (when user leaves the field)
    emailInput.addEventListener('blur', function () {
        const email = this.value;
        console.log('Email input blur:', email);
        if (email && !isValidEmail(email)) {
            errorElement.textContent = 'Please enter a valid email address';
            errorElement.style.display = 'block';
            this.style.borderColor = 'red';
        } else {
            errorElement.style.display = 'none';
            this.style.borderColor = '';
        }
    });
}

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded - Initializing');
    // Initialize EmailJS first
    initializeEmailJS();
    // Then initialize the form
    initializeForm();
});

// We'll only use the load event as a backup if DOMContentLoaded didn't work
window.addEventListener('load', function () {
    console.log('Window Loaded - Checking if already initialized');
    if (!formInitialized) {
        console.log('Form not initialized yet, initializing now');
        // Initialize EmailJS first
        initializeEmailJS();
        // Then initialize the form
        initializeForm();
    } else {
        console.log('Form already initialized, skipping');
    }
});

// Function to verify reCAPTCHA
async function verifyRecaptcha() {
    const response = grecaptcha.getResponse();
    if (!response) {
        showNotification('Please complete the reCAPTCHA verification', 'error');
        return false;
    }
    return true;
}

// Function to reset reCAPTCHA
function resetRecaptcha() {
    grecaptcha.reset();
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 2rem;
        border-radius: 12px;
        background: var(--background-light);
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }

    .notification.success {
        border-left: 4px solid var(--success-color);
    }

    .notification.error {
        border-left: 4px solid #ef4444;
    }

    .notification.fade-out {
        animation: slideOut 0.3s ease-out forwards;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav');
    const body = document.body;
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            nav.classList.toggle('active');
            body.classList.toggle('menu-open');

            // Change icon with smooth transition
            const icon = this.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                    icon.style.transform = 'rotate(0)';
                }, 150);
            } else {
                icon.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    icon.style.transform = 'rotate(0)';
                }, 150);
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (nav.classList.contains('active') &&
                !nav.contains(event.target) &&
                !mobileNavToggle.contains(event.target)) {
                nav.classList.remove('active');
                body.classList.remove('menu-open');
                const icon = mobileNavToggle.querySelector('i');
                icon.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    icon.style.transform = 'rotate(0)';
                }, 150);
            }
        });

        // Close mobile menu when clicking a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                body.classList.remove('menu-open');
                const icon = mobileNavToggle.querySelector('i');
                icon.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    icon.style.transform = 'rotate(0)';
                }, 150);
            });
        });

        // Handle touch events for better mobile interaction
        let touchStartX = 0;
        let touchEndX = 0;

        nav.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        nav.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        function handleSwipe() {
            const swipeThreshold = 100;
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0 && nav.classList.contains('active')) {
                    // Swipe right - close menu
                    nav.classList.remove('active');
                    body.classList.remove('menu-open');
                    const icon = mobileNavToggle.querySelector('i');
                    icon.style.transform = 'rotate(180deg)';
                    setTimeout(() => {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                        icon.style.transform = 'rotate(0)';
                    }, 150);
                }
            }
        }
    }
});

// Update the form submission handler
function initializeForm() {
    if (formInitialized) {
        console.log("Form already initialized, skipping");
        return;
    }

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        console.log("Setting up form submission handler");

        // Setup real-time email validation
        setupEmailValidation();

        // Remove any existing event listeners to prevent duplicates
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);

        // Setup email validation again for the new form
        setupEmailValidation();

        newForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log("Form submitted");

            // Verify reCAPTCHA first
            const isRecaptchaValid = await verifyRecaptcha();
            if (!isRecaptchaValid) {
                return;
            }

            // Check if EmailJS is ready
            if (!isEmailJSReady()) {
                showNotification('Email service not ready. Please refresh the page.', 'error');
                return;
            }

            // Get form data
            const formData = new FormData(newForm);
            const name = formData.get('from_name');
            const email = formData.get('from_email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            console.log("Form data:", { name, email, subject, message });

            // Validate email
            if (!isValidEmail(email)) {
                console.log("Invalid email:", email);
                showNotification('Please enter a valid email address', 'error');
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
            const submitButton = newForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            const originalButtonState = submitButton.disabled;

            try {
                // Show loading state
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitButton.disabled = true;

                console.log('Attempting to send email...');
                console.log('EmailJS available:', isEmailJSReady());

                // Add timeout to prevent hanging
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Request timed out')), 10000);
                });

                // Race between email sending and timeout
                const result = await Promise.race([
                    new Promise((resolve, reject) => {
                        if (!isEmailJSReady()) {
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
                showNotification('Message sent successfully!', 'success');
                newForm.reset();
                // Reset reCAPTCHA after successful submission
                resetRecaptcha();
            } catch (error) {
                // Show error message
                console.error('Detailed error:', error);
                if (error.message === 'Request timed out') {
                    showNotification('Request timed out. Please try again.', 'error');
                } else if (error.message === 'EmailJS not initialized') {
                    showNotification('Email service not ready. Please refresh the page.', 'error');
                } else if (error.message.includes('message port closed')) {
                    showNotification('Connection error. Please try again.', 'error');
                } else {
                    showNotification('Failed to send message: ' + error.message, 'error');
                }
                // Reset reCAPTCHA on error
                resetRecaptcha();
            } finally {
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = originalButtonState;
            }
        });

        formInitialized = true;
        console.log("Form initialization complete");
    } else {
        console.error('Contact form not found');
    }
}
