// EmailJS Configuration
(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init("7DIA1QXYHngdQJuxd");
    }
})();

// Wait for both DOM and EmailJS to be ready
function initializeForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            console.log('Form data:', data);

            // Get button and store original state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            const originalButtonState = submitButton.disabled;

            try {
                // Show loading state
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitButton.disabled = true;

                console.log('Attempting to send email...');

                // Add timeout to prevent hanging
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Request timed out')), 10000); // 10 second timeout
                });

                // Race between email sending and timeout
                const result = await Promise.race([
                    new Promise((resolve, reject) => {
                        if (typeof emailjs === 'undefined') {
                            reject(new Error('EmailJS not initialized'));
                            return;
                        }
                        emailjs.send('service_hhrrtts', 'template_e0mp1qo', data, '7DIA1QXYHngdQJuxd')
                            .then(resolve)
                            .catch(reject);
                    }),
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
                } else if (error.message === 'EmailJS not initialized') {
                    showNotification('Email service not ready. Please refresh the page.', 'error');
                } else if (error.message.includes('message port closed')) {
                    showNotification('Connection error. Please try again.', 'error');
                } else {
                    showNotification('Failed to send message. Please try again.', 'error');
                }
            } finally {
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = originalButtonState;
            }
        });
    } else {
        console.error('Contact form not found');
    }
}

// Try to initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeForm);

// Also try when window loads
window.addEventListener('load', initializeForm);

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
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            // Change icon
            const icon = this.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileNavToggle.contains(event.target)) {
                nav.classList.remove('active');
                const icon = mobileNavToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                const icon = mobileNavToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
});
