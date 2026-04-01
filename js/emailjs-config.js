// ============================================
// EMAILJS CONFIGURATION
// All email handlers for Gutenberg Languages Institute
// Contact: glicampus05@gmail.com
// ============================================

const EMAILJS_CONFIG = {
    serviceID: 'service_cp2oa4u',
    templateID: 'template_tg3ncmc',
    bookingTemplateID: 'template_tg3ncmc',
    publicKey: 'gROi2f3Rk7txdGvvS'
};

// Ensure config is available globally for all scripts
window.EMAILJS_CONFIG = EMAILJS_CONFIG;

// Initialize EmailJS (safe-guarded)
(function () {
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS SDK not loaded; email sending will be disabled until it loads.');
        return;
    }
    try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS initialised successfully with provided public key.');
    } catch (err) {
        console.error('EmailJS init error:', err);
    }
})();


// ============================================
// SHARED HELPERS (used by contact & booking)
// ============================================
function showLoading(btn) {
    if (!btn) return;
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
}

function hideLoading(btn, original) {
    if (!btn) return;
    btn.disabled = false;
    btn.innerHTML = original || btn.dataset.originalText || 'Submit';
}

function showSuccessMessage(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
}

function showErrorMessage(id, msg) {
    const el = document.getElementById(id);
    if (el) {
        if (msg) el.innerHTML = `<strong><i class="fas fa-exclamation-triangle"></i> ERROR</strong><br>${msg}`;
        el.style.display = 'block';
    }
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// ============================================
// CONTACT FORM HANDLER
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const applicationForm = document.getElementById('applicationForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (typeof emailjs === 'undefined') {
                console.error('EmailJS is not loaded.');
                showErrorMessage('formError', 'Email service is not configured. Please contact us directly at glicampus05@gmail.com');
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            showLoading(submitButton);

            const phoneVal = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';

            const templateParams = {
                from_name: document.getElementById('name').value.trim(),
                from_email: document.getElementById('email').value.trim(),
                phone: phoneVal || 'Not provided',
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value.trim(),
                to_name: 'Gutenberg Languages Institute',
                to_email: 'glicampus05@gmail.com'
            };

            // Pass publicKey as 4th argument so send() still works even if init() is skipped
            emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams, EMAILJS_CONFIG.publicKey)
                .then(function (response) {
                    console.log('Contact email sent!', response.status);
                    hideLoading(submitButton, originalButtonText);
                    showSuccessMessage('formSuccess');
                    document.getElementById('formError').style.display = 'none';
                    contactForm.reset();
                }, function (error) {
                    console.error('Contact email failed:', error);
                    hideLoading(submitButton, originalButtonText);
                    showErrorMessage('formError', 'Failed to send message. Please try again or email us directly at glicampus05@gmail.com');
                    document.getElementById('formSuccess').style.display = 'none';
                });
        });
    }

    // ========== APPLICATION FORM HANDLER ==========
    if (applicationForm) {
        applicationForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitButton = applicationForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            showLoading(submitButton);
            setTimeout(() => {
                hideLoading(submitButton, originalButtonText);
                showSuccessMessage('appSuccess');
                document.getElementById('appError').style.display = 'none';
                applicationForm.style.display = 'none';
            }, 2000);
        });
    }
});
