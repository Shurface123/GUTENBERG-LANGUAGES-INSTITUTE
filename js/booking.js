// ============================================
// BOOKING FORM HANDLER
// Handles session booking form submission
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

            // Get form data
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                courseType: document.getElementById('courseType').value,
                language: document.getElementById('language').value,
                startDate: document.getElementById('startDate').value,
                timePreference: document.getElementById('timePreference').value,
                currentLevel: document.getElementById('currentLevel').value,
                message: document.getElementById('message').value,
                referralSource: document.getElementById('referralSource').value
            };

            // Validate email
            if (!validateEmail(formData.email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Show loading state
            const submitButton = bookingForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            showLoading(submitButton);

            // Simulate API call (replace with actual backend integration)
            setTimeout(() => {
                // Hide loading
                hideLoading(submitButton, originalButtonText);

                // Show success message
                showSuccessMessage('successMessage',
                    `Thank you, ${formData.fullName}! We've received your booking request for the ${getCourseTypeName(formData.courseType)}. We'll contact you at ${formData.email} within 24 hours to confirm your session.`
                );

                // Hide error message if visible
                document.getElementById('errorMessage').style.display = 'none';

                // Reset form
                bookingForm.reset();

                // Log booking (for development)
                console.log('Booking submitted:', formData);

                // In production, you would send this to your backend:
                // fetch('/api/bookings', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(formData)
                // })
                // .then(response => response.json())
                // .then(data => {
                //     showSuccessMessage('successMessage');
                //     bookingForm.reset();
                // })
                // .catch(error => {
                //     showErrorMessage('errorMessage');
                // });

            }, 1500);
        });
    }
});

// Helper function to get course type name
function getCourseTypeName(courseType) {
    const courseNames = {
        'super-intensive': 'Super Intensive Course',
        'intensive': 'Intensive Course',
        'normal': 'Normal Course'
    };
    return courseNames[courseType] || courseType;
}
