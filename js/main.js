// ============================================
// GUTENBERG LANGUAGES INSTITUTE - MAIN JS
// Core functionality for all pages
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== NAVIGATION ==========
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translateY(8px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-8px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            });
        });
    }
    
    // ========== SMOOTH SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ========== FORM VALIDATION ==========
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#dc3545';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
        
        // Remove error styling on input
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        });
    });
    
    // ========== ANIMATIONS ON SCROLL ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.card, .course-card, .testimonial-card, .feature-box, .gallery-item');
    animatedElements.forEach(el => observer.observe(el));
    
    // ========== LOGO IMAGE ERROR HANDLING ==========
    const logoImage = document.getElementById('logo-image');
    if (logoImage) {
        logoImage.addEventListener('error', function() {
            // If logo fails to load, hide the image and show only text
            this.style.display = 'none';
        });
        
        // Check if placeholder is still present
        if (logoImage.src.includes('PASTE_YOUR_LOGO_URL_HERE')) {
            logoImage.style.display = 'none';
        }
    }
    
    // ========== PARTNER IMAGE ERROR HANDLING ==========
    const partnerBadge = document.getElementById('partner-badge');
    if (partnerBadge) {
        partnerBadge.addEventListener('error', function() {
            // If partner image fails to load, show placeholder text
            const container = this.parentElement;
            container.innerHTML = '<p style="padding: 2rem; color: var(--dark-gray);">Partner Badge Image<br><small>Replace with your image URL</small></p>';
        });
        
        // Check if placeholder is still present
        if (partnerBadge.src.includes('PASTE_PARTNER_IMAGE_URL_HERE')) {
            const container = partnerBadge.parentElement;
            container.innerHTML = '<div style="padding: 3rem; background: var(--white); border: 3px dashed var(--primary-yellow); border-radius: var(--radius-lg);"><p style="color: var(--dark-gray); text-align: center; margin: 0;"><strong>Partner/Accreditation Badge</strong><br><small>Replace PASTE_PARTNER_IMAGE_URL_HERE with your image URL</small></p></div>';
        }
    }
    
    // ========== UTILITY FUNCTIONS ==========
    
    // Email validation
    window.validateEmail = function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    
    // Phone number formatting
    window.formatPhoneNumber = function(input) {
        const phoneInput = input.target || input;
        let value = phoneInput.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        
        phoneInput.value = value;
    };
    
    // Apply phone formatting to phone inputs
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', window.formatPhoneNumber);
    });
    
    // ========== COURSE URL PARAMETERS ==========
    // Pre-select course if coming from course page
    const urlParams = new URLSearchParams(window.location.search);
    const courseParam = urlParams.get('course');
    
    if (courseParam) {
        const courseSelect = document.getElementById('courseType') || document.getElementById('courseSelection');
        if (courseSelect) {
            courseSelect.value = courseParam;
        }
    }
    
    // ========== CONSOLE MESSAGE ==========
    console.log('%c🎓 Gutenberg Languages Institute', 'color: #FFD700; font-size: 20px; font-weight: bold;');
    console.log('%cWebsite loaded successfully!', 'color: #FFD700; font-size: 14px;');
    
});

// ========== EXTERNAL FUNCTIONS ==========

// Show success message
function showSuccessMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        if (message) {
            element.innerHTML = `<strong>✓ Success!</strong><br>${message}`;
        }
        element.style.display = 'block';
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            element.style.display = 'none';
        }, 10000);
    }
}

// Show error message
function showErrorMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        if (message) {
            element.innerHTML = `<strong>⚠ Error</strong><br>${message}`;
        }
        element.style.display = 'block';
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            element.style.display = 'none';
        }, 10000);
    }
}

// Loading spinner
function showLoading(buttonElement) {
    if (buttonElement) {
        buttonElement.disabled = true;
        buttonElement.innerHTML = '<div class="spinner"></div> Processing...';
    }
}

function hideLoading(buttonElement, originalText) {
    if (buttonElement) {
        buttonElement.disabled = false;
        buttonElement.innerHTML = originalText;
    }
}
