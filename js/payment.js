// ============================================
// PAYMENT FORM HANDLER
// Handles payment processing and method selection
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ========== PAYMENT METHOD SELECTION ==========
    const paymentMethods = document.querySelectorAll('.payment-method');
    const onlinePaymentForm = document.getElementById('onlinePaymentForm');
    const bankTransferInfo = document.getElementById('bankTransferInfo');
    const cashPaymentInfo = document.getElementById('cashPaymentInfo');

    paymentMethods.forEach(method => {
        method.addEventListener('click', function () {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));

            // Add active class to clicked method
            this.classList.add('active');

            // Hide all payment sections
            if (onlinePaymentForm) onlinePaymentForm.style.display = 'none';
            if (bankTransferInfo) bankTransferInfo.style.display = 'none';
            if (cashPaymentInfo) cashPaymentInfo.style.display = 'none';

            // Show relevant section
            if (this.id === 'onlinePayment' && onlinePaymentForm) {
                onlinePaymentForm.style.display = 'block';
                onlinePaymentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (this.id === 'bankTransfer' && bankTransferInfo) {
                bankTransferInfo.style.display = 'block';
                bankTransferInfo.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (this.id === 'cashPayment' && cashPaymentInfo) {
                cashPaymentInfo.style.display = 'block';
                cashPaymentInfo.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========== COURSE SELECTION & PRICE UPDATE ==========
    const courseSelection = document.getElementById('courseSelection');
    const totalAmount = document.getElementById('totalAmount');

    if (courseSelection && totalAmount) {
        courseSelection.addEventListener('change', function () {
            const prices = {
                'super-intensive': '$2,500.00',
                'intensive': '$1,800.00',
                'normal': '$1,200.00'
            };

            totalAmount.textContent = prices[this.value] || '$0.00';
        });
    }

    // ========== CARD NUMBER FORMATTING ==========
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // ========== EXPIRY DATE FORMATTING ==========
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // ========== CVV INPUT RESTRICTION ==========
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function (e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // ========== PAYMENT FORM SUBMISSION ==========
    const paymentForm = document.getElementById('paymentForm');

    if (paymentForm) {
        paymentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = {
                course: document.getElementById('courseSelection').value,
                studentName: document.getElementById('studentName').value,
                email: document.getElementById('studentEmail').value,
                phone: document.getElementById('studentPhone').value,
                cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
                expiryDate: document.getElementById('expiryDate').value,
                cvv: document.getElementById('cvv').value,
                billingAddress: document.getElementById('billingAddress').value,
                city: document.getElementById('city').value,
                zipCode: document.getElementById('zipCode').value
            };

            // Validate course selection
            if (!formData.course) {
                alert('Please select a course.');
                return;
            }

            // Validate email
            if (!validateEmail(formData.email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Validate card number (basic check)
            if (formData.cardNumber.length < 13 || formData.cardNumber.length > 19) {
                alert('Please enter a valid card number.');
                return;
            }

            // Validate expiry date
            const expiryParts = formData.expiryDate.split('/');
            if (expiryParts.length !== 2) {
                alert('Please enter a valid expiry date (MM/YY).');
                return;
            }

            const month = parseInt(expiryParts[0]);
            const year = parseInt('20' + expiryParts[1]);
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            if (month < 1 || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) {
                alert('Please enter a valid expiry date.');
                return;
            }

            // Validate CVV
            if (formData.cvv.length < 3 || formData.cvv.length > 4) {
                alert('Please enter a valid CVV.');
                return;
            }

            // Show loading state
            const submitButton = paymentForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            showLoading(submitButton);

            // Simulate payment processing (replace with actual payment gateway integration)
            setTimeout(() => {
                // Hide loading
                hideLoading(submitButton, originalButtonText);

                // Show success message
                showSuccessMessage('paymentSuccess');

                // Hide error message if visible
                document.getElementById('paymentError').style.display = 'none';

                // Hide form
                paymentForm.style.display = 'none';

                // Log payment (for development - NEVER log real payment data in production!)
                console.log('Payment processed for:', formData.studentName);

                // In production, integrate with payment gateway

            }, 2000);
        });
    }
});

// Helper function to get course amount
function getAmount(courseType) {
    const amounts = {
        'super-intensive': 250000, // in cents
        'intensive': 180000,
        'normal': 120000
    };
    return amounts[courseType] || 0;
}
