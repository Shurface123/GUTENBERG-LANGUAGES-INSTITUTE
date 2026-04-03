// ============================================
// BOOKING FORM HANDLER — Mailto (no EmailJS)
// Opens user's email client with pre-filled booking details. Works 100% without configuration.
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Full name: at least 2 words
            const fullNameVal = document.getElementById('fullName').value.trim();
            const nameParts = fullNameVal.split(/\s+/).filter(p => p.length > 0);
            const nameErrorEl = document.getElementById('fullNameError');
            if (nameParts.length < 2) {
                if (nameErrorEl) nameErrorEl.style.display = 'block';
                document.getElementById('fullName').focus();
                return;
            }
            if (nameErrorEl) nameErrorEl.style.display = 'none';

            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();

            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            if (phone) {
                const phoneClean = phone.replace(/[\s()\-]/g, '');
                if (!/^\+?[0-9]{7,15}$/.test(phoneClean)) {
                    alert('Please enter a valid phone number (e.g. +233 50 979 6187).');
                    return;
                }
            }

            const courseType = document.getElementById('courseType').value;
            const language = document.getElementById('language').value;
            const timePreference = document.getElementById('timePreference').value;
            const currentLevel = document.getElementById('currentLevel').value;
            const message = document.getElementById('message').value.trim();
            const referralSource = document.getElementById('referralSource').value;

            const courseLabel = getCourseTypeName(courseType);
            const languageLabel = getLanguageName(language);
            const timeLabel = getTimeName(timePreference);
            const levelLabel = getLevelName(currentLevel);
            const referralLabel = getReferralName(referralSource);

            const bodyLines = [
                'BOOKING REQUEST — Gutenberg Languages Institute',
                '',
                'Full Name: ' + fullNameVal,
                'Email: ' + email,
                'Phone: ' + (phone || 'Not provided'),
                'Course: ' + courseLabel,
                'Language: ' + languageLabel,
                'Time preference: ' + (timeLabel || 'Not specified'),
                'Current level: ' + (levelLabel || 'Not specified'),
                'How they heard about us: ' + (referralLabel || 'Not specified'),
                '',
                'Additional message:',
                message || '(none)'
            ];
            const body = bodyLines.join('\n');
            const subject = 'Booking Request — ' + fullNameVal;

            if (typeof emailjs === 'undefined') {
                const errEl = document.getElementById('errorMessage');
                if (errEl) {
                    errEl.innerHTML = '<strong><i class="fas fa-exclamation-triangle"></i> ERROR</strong><br>Email service not configured. Please contact us directly.';
                    errEl.style.display = 'block';
                }
                return;
            }

            const submitButton = bookingForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton ? submitButton.innerHTML : 'Submit';
            if (typeof showLoading === 'function' && submitButton) showLoading(submitButton);

            const templateParams = {
                from_name: fullNameVal,
                from_email: email,
                subject: subject,
                message: body,
                to_name: 'Gutenberg Languages Institute',
                to_email: 'glicampus05@gmail.com'
            };

            emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.bookingTemplateID, templateParams, EMAILJS_CONFIG.publicKey)
                .then(function (response) {
                    console.log('Booking email sent!', response.status);
                    if (typeof hideLoading === 'function' && submitButton) hideLoading(submitButton, originalButtonText);
                    document.getElementById('errorMessage').style.display = 'none';
                    const successEl = document.getElementById('successMessage');
                    if (successEl) {
                        successEl.innerHTML = '<strong><i class="fas fa-check-circle"></i> Booking Request Submitted!</strong><br>Thank you for choosing Gutenberg Languages Institute. We\'ve received your booking request and will contact you within 24 hours to confirm your session details.';
                        successEl.style.display = 'block';
                        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    bookingForm.reset();
                }, function (error) {
                    console.error('Booking email failed:', error);
                    if (typeof hideLoading === 'function' && submitButton) hideLoading(submitButton, originalButtonText);
                    const errorEl = document.getElementById('errorMessage');
                    if (errorEl) {
                        errorEl.innerHTML = '<strong><i class="fas fa-exclamation-triangle"></i> Submission Error</strong><br>There was an error submitting your booking. Please try again or contact us directly.';
                        errorEl.style.display = 'block';
                        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    const successEl = document.getElementById('successMessage');
                    if (successEl) successEl.style.display = 'none';
                });
        });
    }
});

function getCourseTypeName(val) {
    return { 'super-intensive': 'Super Intensive (6–8 weeks)', 'intensive': 'Intensive (10–12 weeks)', 'normal': 'Normal (16–20 weeks)' }[val] || val;
}
function getLanguageName(val) {
    return { german: 'German', french: 'French', spanish: 'Spanish', dutch: 'Dutch', italian: 'Italian', chinese: 'Chinese', japanese: 'Japanese', finnish: 'Finnish', other: 'Other' }[val] || val;
}
function getTimeName(val) {
    return { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', weekend: 'Weekend', flexible: 'Flexible' }[val] || val || 'Not specified';
}
function getLevelName(val) {
    return { beginner: 'Beginner', elementary: 'Elementary', intermediate: 'Intermediate', advanced: 'Advanced', proficient: 'Proficient' }[val] || val || 'Not specified';
}
function getReferralName(val) {
    return { google: 'Google', 'social-media': 'Social Media', friend: 'Friend/Family', advertisement: 'Advertisement', website: 'Website', other: 'Other' }[val] || val || 'Not specified';
}
