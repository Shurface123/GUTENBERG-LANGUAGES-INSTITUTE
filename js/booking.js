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

            const mailto = 'mailto:glicampus05@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

            document.getElementById('errorMessage').style.display = 'none';
            const successEl = document.getElementById('successMessage');
            if (successEl) {
                successEl.innerHTML = '<strong><i class="fas fa-check-circle"></i> Almost done!</strong><br>Your email client will open with this booking request. Click <strong>Send</strong> to submit. We\'ll confirm within 24 hours.';
                successEl.style.display = 'block';
                successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            bookingForm.reset();
            window.location.href = mailto;
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
