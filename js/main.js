// ============================================
// GUTENBERG LANGUAGES INSTITUTE - MAIN JS
// Core functionality for all pages
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ========== NAVIGATION ==========
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const rootEl = document.documentElement;
    const THEME_STORAGE_KEY = 'gli-theme';

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
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
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            });
        });
    }

    // ========== THEME TOGGLE (Brand vs Accessible Light) ==========
    let themeToggleBtn = null;

    function applyTheme(mode, options = {}) {
        const opts = Object.assign({ persist: true }, options);
        const normalized = (mode === 'accessible-light') ? 'accessible-light' : 'brand';

        if (normalized === 'accessible-light') {
            rootEl.setAttribute('data-theme', 'accessible-light');
        } else {
            rootEl.removeAttribute('data-theme');
        }

        if (opts.persist && window.localStorage) {
            try {
                localStorage.setItem(THEME_STORAGE_KEY, normalized);
            } catch (e) {
                console.warn('Unable to persist theme preference:', e);
            }
        }

        if (themeToggleBtn) {
            const iconEl = themeToggleBtn.querySelector('.theme-toggle-btn-icon');
            const labelEl = themeToggleBtn.querySelector('.theme-toggle-btn-label');
            if (normalized === 'accessible-light') {
                if (iconEl) iconEl.className = 'theme-toggle-btn-icon fas fa-sun';
                if (labelEl) labelEl.textContent = 'Light';
                themeToggleBtn.setAttribute('aria-pressed', 'true');
                themeToggleBtn.setAttribute('aria-label', 'Switch to brand theme (dark)');
            } else {
                if (iconEl) iconEl.className = 'theme-toggle-btn-icon fas fa-moon';
                if (labelEl) labelEl.textContent = 'Dark';
                themeToggleBtn.setAttribute('aria-pressed', 'false');
                themeToggleBtn.setAttribute('aria-label', 'Switch to accessible light theme');
            }
        }
    }

    function getInitialTheme() {
        try {
            const stored = window.localStorage ? localStorage.getItem(THEME_STORAGE_KEY) : null;
            if (stored === 'brand' || stored === 'accessible-light') {
                return stored;
            }
        } catch (e) {
            console.warn('Unable to read stored theme preference:', e);
        }

        // Fallback: prefer system preference; if system is light, default to accessible-light
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'accessible-light';
        }
        return 'brand';
    }

    // Floating theme toggle (bottom-left, like chatbot but opposite side)
    const themeFloat = document.createElement('button');
    themeFloat.type = 'button';
    themeFloat.id = 'themeToggle';
    themeFloat.className = 'theme-toggle-float';
    themeFloat.innerHTML = '<span class="theme-toggle-btn-icon fas fa-moon"></span><span class="theme-toggle-btn-label">Dark</span>';
    themeFloat.setAttribute('aria-pressed', 'false');
    themeFloat.setAttribute('aria-label', 'Switch to accessible light theme');
    document.body.appendChild(themeFloat);
    themeToggleBtn = themeFloat;

    themeToggleBtn.addEventListener('click', function () {
        const current = rootEl.getAttribute('data-theme') === 'accessible-light' ? 'accessible-light' : 'brand';
        const next = current === 'accessible-light' ? 'brand' : 'accessible-light';
        applyTheme(next);
    });

    applyTheme(getInitialTheme(), { persist: false });

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
        form.addEventListener('submit', function (e) {
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
            input.addEventListener('input', function () {
                this.style.borderColor = '';
            });
        });
    });

    // ========== ANIMATIONS ON SCROLL ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
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
        logoImage.addEventListener('error', function () {
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
        partnerBadge.addEventListener('error', function () {
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
    window.validateEmail = function (email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

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

    // ========== PAYMENT PAGE: Set start date min = today ==========
    const startDateInput = document.getElementById('startDate');
    if (startDateInput) {
        const todayStr = new Date().toISOString().split('T')[0];
        startDateInput.setAttribute('min', todayStr);
        // Validate that any selected date is in the future
        startDateInput.addEventListener('change', function () {
            const chosen = new Date(this.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const errEl = document.getElementById('startDateError');
            if (chosen < today) {
                if (errEl) errEl.style.display = 'block';
                this.value = '';
                this.focus();
            } else {
                if (errEl) errEl.style.display = 'none';
            }
        });
    }

});



// ========== FORM HELPER FALLBACKS ==========
// These only bind if emailjs-config.js hasn't already defined them.
// emailjs-config.js definitions always take precedence.

if (typeof showSuccessMessage === 'undefined') {
    window.showSuccessMessage = function (elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            if (message) element.innerHTML = `<strong>&#10003; Success!</strong><br>${message}`;
            element.style.display = 'block';
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            setTimeout(() => { element.style.display = 'none'; }, 10000);
        }
    };
}

if (typeof showErrorMessage === 'undefined') {
    window.showErrorMessage = function (elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            if (message) element.innerHTML = `<strong>&#9888; Error</strong><br>${message}`;
            element.style.display = 'block';
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            setTimeout(() => { element.style.display = 'none'; }, 10000);
        }
    };
}

if (typeof showLoading === 'undefined') {
    window.showLoading = function (btn) {
        if (btn) { btn.disabled = true; btn.dataset.originalText = btn.innerHTML; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'; }
    };
}

if (typeof hideLoading === 'undefined') {
    window.hideLoading = function (btn, originalText) {
        if (btn) { btn.disabled = false; btn.innerHTML = originalText || btn.dataset.originalText || 'Submit'; }
    };
}

