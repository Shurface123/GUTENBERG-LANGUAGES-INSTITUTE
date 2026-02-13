// ============================================
// EMAILJS CONFIGURATION
// Handles contact form submission via EmailJS
// ============================================

// ⚠️ IMPORTANT: Replace these with your actual EmailJS credentials
// Get your credentials from: https://www.emailjs.com/

const EMAILJS_CONFIG = {
    serviceID: 'service_bhcb8xr',      // Replace with your EmailJS Service ID
    templateID: 'template_lnojk8p',    // Replace with your EmailJS Template ID
    publicKey: 'KqH-0i9j1T1oN-r_E'       // Replace with your EmailJS Public Key
};

// Initialize EmailJS
(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
})();

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const applicationForm = document.getElementById('applicationForm');

    // ========== CONTACT FORM HANDLER ==========
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Check if EmailJS is loaded
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS is not loaded. Please include the EmailJS SDK.');
                showErrorMessage('formError', 'Email service is not configured. Please contact us directly.');
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            showLoading(submitButton);

            // Prepare template parameters
            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                to_name: 'Gutenberg Languages Institute'
            };

            // Send email using EmailJS
            emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams)
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                    hideLoading(submitButton, originalButtonText);
                    showSuccessMessage('formSuccess');
                    document.getElementById('formError').style.display = 'none';
                    contactForm.reset();
                }, function (error) {
                    console.error('FAILED...', error);
                    hideLoading(submitButton, originalButtonText);
                    showErrorMessage('formError', 'Failed to send message. Please try again or contact us directly.');
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

            // Collect all form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                dateOfBirth: document.getElementById('dateOfBirth').value,
                gender: document.getElementById('gender').value,
                nationality: document.getElementById('nationality').value,
                email: document.getElementById('appEmail').value,
                phone: document.getElementById('appPhone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('appCity').value,
                state: document.getElementById('state').value,
                zipCode: document.getElementById('appZipCode').value,
                course: document.getElementById('appCourse').value,
                language: document.getElementById('appLanguage').value,
                startDate: document.getElementById('preferredStartDate').value,
                educationLevel: document.getElementById('educationLevel').value,
                languageLevel: document.getElementById('languageLevel').value,
                learningGoals: document.getElementById('learningGoals').value,
                previousExperience: document.getElementById('previousExperience').value,
                emergencyName: document.getElementById('emergencyName').value,
                emergencyRelation: document.getElementById('emergencyRelation').value,
                emergencyPhone: document.getElementById('emergencyPhone').value
            };

            // Simulate submission (replace with actual backend integration)
            setTimeout(() => {
                hideLoading(submitButton, originalButtonText);
                showSuccessMessage('appSuccess');
                document.getElementById('appError').style.display = 'none';
                applicationForm.style.display = 'none';

                console.log('Application submitted:', formData);

                // In production, send to your backend:
                // fetch('/api/applications', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(formData)
                // })
                // .then(response => response.json())
                // .then(data => {
                //     showSuccessMessage('appSuccess');
                //     applicationForm.reset();
                // })
                // .catch(error => {
                //     showErrorMessage('appError');
                // });

            }, 2000);
        });
    }
});

// ========== SETUP INSTRUCTIONS ==========
/*
TO SET UP EMAILJS:

1. Go to https://www.emailjs.com/ and create a free account

2. Add an Email Service:
   - Go to "Email Services" in the dashboard
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the setup instructions
   - Copy your Service ID

3. Create an Email Template:
   - Go to "Email Templates" in the dashboard
   - Click "Create New Template"
   - Design your email template using these variables:
     * {{from_name}} - Sender's name
     * {{from_email}} - Sender's email
     * {{phone}} - Sender's phone
     * {{subject}} - Message subject
     * {{message}} - Message content
     * {{to_name}} - Recipient name (Gutenberg Languages Institute)
   - Save and copy your Template ID

4. Get your Public Key:
   - Go to "Account" in the dashboard
   - Find your Public Key under "API Keys"
   - Copy the Public Key

5. Update this file:
   - Replace 'YOUR_SERVICE_ID' with your Service ID
   - Replace 'YOUR_TEMPLATE_ID' with your Template ID
   - Replace 'YOUR_PUBLIC_KEY' with your Public Key

6. Test the contact form to ensure emails are being sent!
*/
