// Custom Cursor - Desktop Only
// Check if device is desktop (has fine pointer and hover capability)
const isDesktop = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)').matches;

if (isDesktop) {
    const cursor = document.querySelector('.cursor');
    const corners = {
        topLeft: document.querySelector('.cursor-corner.top-left'),
        topRight: document.querySelector('.cursor-corner.top-right'),
        bottomLeft: document.querySelector('.cursor-corner.bottom-left'),
        bottomRight: document.querySelector('.cursor-corner.bottom-right')
    };

    let mouseX = 0;
    let mouseY = 0;
    let currentCard = null;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!currentCard) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }
    });

    // Set default cursor position (small crosshair)
    function setDefaultCursor() {
        const offset = 7.5; // Half of corner size

        corners.topLeft.style.left = -offset + 'px';
        corners.topLeft.style.top = -offset + 'px';

        corners.topRight.style.left = offset + 'px';
        corners.topRight.style.top = -offset + 'px';

        corners.bottomLeft.style.left = -offset + 'px';
        corners.bottomLeft.style.top = offset + 'px';

        corners.bottomRight.style.left = offset + 'px';
        corners.bottomRight.style.top = offset + 'px';
    }

    // Expand cursor to match card
    function expandToCard(card) {
        const rect = card.getBoundingClientRect();

        // Calculate positions relative to cursor center
        const leftOffset = rect.left - mouseX;
        const rightOffset = rect.right - mouseX;
        const topOffset = rect.top - mouseY;
        const bottomOffset = rect.bottom - mouseY;

        corners.topLeft.style.left = leftOffset + 'px';
        corners.topLeft.style.top = topOffset + 'px';

        corners.topRight.style.left = (rightOffset - 15) + 'px'; // Subtract corner width
        corners.topRight.style.top = topOffset + 'px';

        corners.bottomLeft.style.left = leftOffset + 'px';
        corners.bottomLeft.style.top = (bottomOffset - 15) + 'px'; // Subtract corner height

        corners.bottomRight.style.left = (rightOffset - 15) + 'px';
        corners.bottomRight.style.top = (bottomOffset - 15) + 'px';

        // Position cursor at mouse
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    }

    // Initialize default cursor
    setDefaultCursor();

    // Add hover listeners to all cards and links
    const interactiveElements = document.querySelectorAll('.card, .github-link, .linkedin-link, .visit-button, .form-submit, .form-input, .form-textarea');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            currentCard = element;
            expandToCard(element);
        });

        element.addEventListener('mouseleave', () => {
            currentCard = null;
            setDefaultCursor();
        });

        // Update cursor position on mouse move over card
        element.addEventListener('mousemove', () => {
            if (currentCard === element) {
                expandToCard(element);
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (currentCard) {
            expandToCard(currentCard);
        }
    });
}

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
    const emailInput = document.querySelector('input[name="from_email"]');
    if (!emailInput) {
        console.error('Email input field not found');
        return;
    }

    console.log('Setting up email validation for:', emailInput);

    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'email-error';
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.display = 'none';
    emailInput.parentNode.appendChild(errorElement);

    // Add input event listener for real-time validation
    emailInput.addEventListener('input', function () {
        const email = this.value;
        if (email && !isValidEmail(email)) {
            errorElement.textContent = 'Please enter a valid email address';
            errorElement.style.display = 'block';
            this.style.borderColor = '#ef4444';
        } else {
            errorElement.style.display = 'none';
            this.style.borderColor = '';
        }
    });

    // Also validate on blur (when user leaves the field)
    emailInput.addEventListener('blur', function () {
        const email = this.value;
        if (email && !isValidEmail(email)) {
            errorElement.textContent = 'Please enter a valid email address';
            errorElement.style.display = 'block';
            this.style.borderColor = '#ef4444';
        } else {
            errorElement.style.display = 'none';
            this.style.borderColor = '';
        }
    });
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
    `;

    notification.style.position = 'fixed';
    notification.style.bottom = '2rem';
    notification.style.right = '2rem';
    notification.style.padding = '1rem 2rem';
    notification.style.borderRadius = '6px';
    notification.style.background = type === 'success' ? '#10b981' : '#ef4444';
    notification.style.color = '#ffffff';
    notification.style.fontSize = '0.95rem';
    notification.style.zIndex = '10000';
    notification.style.animation = 'slideIn 0.3s ease-out';

    // Add to page
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded - Initializing');
    initializeEmailJS();
    initializeForm();
});

// Backup initialization
window.addEventListener('load', function () {
    console.log('Window Loaded - Checking if already initialized');
    if (!formInitialized) {
        console.log('Form not initialized yet, initializing now');
        initializeEmailJS();
        initializeForm();
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

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log("Form submitted");

            // Check if EmailJS is ready
            if (!isEmailJSReady()) {
                showNotification('Email service not ready. Please refresh the page.', 'error');
                return;
            }

            // Get form data
            const formData = new FormData(contactForm);
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
                to_name: "Aarav Jaichand",
                from_name: name,
                from_email: email,
                message: message,
                subject: subject
            };

            console.log('Form data being sent:', data);

            // Get button and store original state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonHTML = submitButton.innerHTML;
            const originalButtonState = submitButton.disabled;

            try {
                // Show loading state
                submitButton.innerHTML = '<span>Sending...</span>';
                submitButton.disabled = true;

                console.log('Attempting to send email...');

                // Add timeout to prevent hanging
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Request timed out')), 10000);
                });

                // Race between email sending and timeout
                const result = await Promise.race([
                    emailjs.send('service_hhrrtts', 'template_e0mp1qo', data),
                    timeoutPromise
                ]);

                console.log('Email sent successfully:', result);

                // Show success message
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } catch (error) {
                // Show error message
                console.error('Detailed error:', error);
                if (error.message === 'Request timed out') {
                    showNotification('Request timed out. Please try again.', 'error');
                } else {
                    showNotification('Failed to send message. Please try again.', 'error');
                }
            } finally {
                // Reset button state
                submitButton.innerHTML = originalButtonHTML;
                submitButton.disabled = originalButtonState;
            }
        });

        formInitialized = true;
        console.log("Form initialization complete");
    } else {
        console.error('Contact form not found');
    }
}
