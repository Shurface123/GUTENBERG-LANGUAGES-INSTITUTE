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

// Initialize EmailJS — retries until SDK is ready
function initEmailJS() {
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS SDK not yet available, retrying in 300ms...');
        setTimeout(initEmailJS, 300);
        return;
    }
    try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS initialised successfully.');
    } catch (err) {
        console.error('EmailJS init error:', err);
    }
}
initEmailJS();


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
                showErrorMessage('formError', 'Email service is not configured. Please contact us directly at glicampus05@gmail.com');
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            showLoading(submitButton);

            const phoneVal = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';

            const senderName  = document.getElementById('name').value.trim();
            const senderEmail = document.getElementById('email').value.trim();

            const contactMessageBlock = [
                '👤 Name:    ' + senderName,
                '📧 Email:   ' + senderEmail,
                '📞 Phone:   ' + (phoneVal || 'Not provided'),
                '📌 Subject: ' + document.getElementById('subject').value,
                '',
                '💬 Message:',
                document.getElementById('message').value.trim()
            ].join('\n');

            const templateParams = {
                name:       senderName,   // matches {{name}} in EmailJS From Name field
                from_name:  senderName,
                from_email: senderEmail,
                reply_to:   senderEmail,  // matches {{from_email}} in Reply To field
                subject:    document.getElementById('subject').value,  // matches {{subject}}
                message:    contactMessageBlock   // matches {{message}} in template body
            };

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

            if (typeof emailjs === 'undefined') {
                showErrorMessage('appError', 'Email service not configured. Please contact us directly at glicampus05@gmail.com');
                return;
            }

            const submitButton = applicationForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            showLoading(submitButton);

            const appEmail    = document.getElementById('email')     ? document.getElementById('email').value.trim()     : '';
            const appFirst    = document.getElementById('firstName') ? document.getElementById('firstName').value.trim() : '';
            const appLast     = document.getElementById('lastName')  ? document.getElementById('lastName').value.trim()  : '';
            const appFullName = (appFirst + ' ' + appLast).trim();
            const appPhone    = document.getElementById('phone')     ? document.getElementById('phone').value.trim()     : 'Not provided';

            const appMessageBlock = [
                '👤 Full Name: ' + appFullName,
                '📧 Email:     ' + appEmail,
                '📞 Phone:     ' + (appPhone || 'Not provided'),
                '',
                'Full application details submitted via the website application form.'
            ].join('\n');

            const templateParams = {
                name:       appFullName,
                from_name:  appFullName,
                from_email: appEmail,
                reply_to:   appEmail,
                subject:    'New Application — Gutenberg Languages Institute',
                message:    appMessageBlock
            };

            emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams, EMAILJS_CONFIG.publicKey)
                .then(function () {
                    hideLoading(submitButton, originalButtonText);
                    showSuccessMessage('appSuccess');
                    document.getElementById('appError').style.display = 'none';
                    applicationForm.style.display = 'none';
                }, function (error) {
                    console.error('Application email failed:', error);
                    hideLoading(submitButton, originalButtonText);
                    showErrorMessage('appError', 'There was an error submitting your application. Please try again or contact us at glicampus05@gmail.com');
                });
        });
    }
});
