// ============================================
// EMAILJS CONFIGURATION
// All email handlers for Gutenberg Languages Institute
// Contact: glicampus05@gmail.com
// ============================================

const EMAILJS_CONFIG = {
    serviceID: 'service_t7a62uo',
    templateID: 'template_msb888i',
    bookingTemplateID: 'template_q5qy4a7',
    publicKey: 'Qaz4Xvzh5itiQ0ZZu'
};

// Initialize EmailJS
(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
})();




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

            const templateParams = {
                from_name: document.getElementById('name').value.trim(),
                from_email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim() || 'Not provided',
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value.trim(),
                to_name: 'Gutenberg Languages Institute',
                to_email: 'glicampus05@gmail.com'
            };

            emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams)
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
