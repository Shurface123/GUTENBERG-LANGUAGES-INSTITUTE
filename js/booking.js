// ============================================
// BOOKING FORM HANDLER — EmailJS Integration
// Sends booking details to glicampus05@gmail.com
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        // Set minimum date to today
        const startDateInput = document.getElementById('startDate');
        if (startDateInput) {
            const today = new Date().toISOString().split('T')[0];
            startDateInput.setAttribute('min', today);
        }

        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // ── Collect Form Data ──────────────────────────────────────────
            const formData = {
                fullName: document.getElementById('fullName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                courseType: document.getElementById('courseType').value,
                language: document.getElementById('language').value,
                startDate: document.getElementById('startDate').value,
                timePreference: document.getElementById('timePreference').value,
                currentLevel: document.getElementById('currentLevel').value,
                message: document.getElementById('message').value.trim(),
                referralSource: document.getElementById('referralSource').value
            };

            // ── Email Validation ───────────────────────────────────────────
            if (!validateEmail(formData.email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // ── Check EmailJS is available ────────────────────────────────
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS SDK not loaded.');
                showErrorMessage('errorMessage', 'Email service is unavailable. Please contact us directly at glicampus05@gmail.com');
                return;
            }

            // ── Show Loading State ─────────────────────────────────────────
            const submitButton = bookingForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            showLoading(submitButton);

            // ── Build Template Parameters ──────────────────────────────────
            const templateParams = {
                from_name: formData.fullName,
                from_email: formData.email,
                phone: formData.phone || 'Not provided',
                course_type: getCourseTypeName(formData.courseType),
                language: getLanguageName(formData.language),
                start_date: formData.startDate || 'Not specified',
                time_preference: getTimeName(formData.timePreference),
                current_level: getLevelName(formData.currentLevel),
                message: formData.message || 'No additional information provided.',
                referral_source: getReferralName(formData.referralSource),
                to_name: 'Gutenberg Languages Institute'
            };

            // ── Send via EmailJS ───────────────────────────────────────────
            const config = typeof EMAILJS_CONFIG !== 'undefined' ? EMAILJS_CONFIG : {};
            const serviceID = config.serviceID || 'service_bhcb8xr';
            const templateID = config.bookingTemplateID || 'template_booking';

            emailjs.send(serviceID, templateID, templateParams)
                .then(function (response) {
                    console.log('Booking email sent!', response.status, response.text);
                    hideLoading(submitButton, originalButtonText);

                    // Show dynamic success message
                    const successEl = document.getElementById('successMessage');
                    if (successEl) {
                        successEl.innerHTML = `<strong><i class="fas fa-check-circle"></i> Booking Request Submitted!</strong><br>
                            Thank you, <strong>${formData.fullName}</strong>! We've received your booking for the
                            <strong>${getCourseTypeName(formData.courseType)}</strong> in
                            <strong>${getLanguageName(formData.language)}</strong>.
                            We'll contact you at <strong>${formData.email}</strong> within 24 hours to confirm your session.`;
                        successEl.style.display = 'block';
                        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    document.getElementById('errorMessage').style.display = 'none';
                    bookingForm.reset();
                })
                .catch(function (error) {
                    console.error('Booking email failed:', error);
                    hideLoading(submitButton, originalButtonText);
                    showErrorMessage('errorMessage',
                        'There was an error submitting your booking. Please try again, or contact us at glicampus05@gmail.com or call +233 50 979 6187.');
                    document.getElementById('successMessage').style.display = 'none';
                });
        });
    }
});

// ── Helper: Human-readable course name ────────────────────────────────────────
function getCourseTypeName(val) {
    return {
        'super-intensive': 'Super Intensive Course (6–8 weeks)',
        'intensive': 'Intensive Course (10–12 weeks)',
        'normal': 'Normal Course (16–20 weeks)'
    }[val] || val;
}

// ── Helper: Human-readable language name ──────────────────────────────────────
function getLanguageName(val) {
    return {
        'german': 'German (Deutsch)',
        'french': 'French (Français)',
        'spanish': 'Spanish (Español)',
        'dutch': 'Dutch (Nederlands)',
        'italian': 'Italian (Italiano)',
        'finnish': 'Finnish (Suomi)',
        'chinese': 'Chinese (中文)',
        'japanese': 'Japanese (日本語)',
        'other': 'Other (see message)'
    }[val] || val;
}

// ── Helper: Human-readable time preference ────────────────────────────────────
function getTimeName(val) {
    return {
        'morning': 'Morning (8AM – 12PM)',
        'afternoon': 'Afternoon (12PM – 5PM)',
        'evening': 'Evening (5PM – 9PM)',
        'weekend': 'Weekend',
        'flexible': 'Flexible'
    }[val] || val || 'Not specified';
}

// ── Helper: Human-readable level ──────────────────────────────────────────────
function getLevelName(val) {
    return {
        'beginner': 'Beginner (No prior knowledge)',
        'elementary': 'Elementary (Basic phrases)',
        'intermediate': 'Intermediate (Can hold conversations)',
        'advanced': 'Advanced (Fluent with some errors)',
        'proficient': 'Proficient (Near-native)'
    }[val] || val || 'Not specified';
}

// ── Helper: Human-readable referral source ────────────────────────────────────
function getReferralName(val) {
    return {
        'google': 'Google Search',
        'social-media': 'Social Media',
        'friend': 'Friend/Family Referral',
        'advertisement': 'Advertisement',
        'website': 'Website',
        'other': 'Other'
    }[val] || val || 'Not specified';
}
