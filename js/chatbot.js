// ============================================
// AI CHATBOT INTEGRATION
// Handles chatbot widget and interactions
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const chatbotTrigger = document.getElementById('chatbotTrigger');

    if (chatbotTrigger) {
        chatbotTrigger.addEventListener('click', function () {
            // Option 1: Open a simple chat interface
            openChatInterface();

            // Option 2: Integrate with third-party chatbot (uncomment to use)
            // integrateThirdPartyChatbot();
        });
    }
});

// ========== SIMPLE CHAT INTERFACE ==========
function openChatInterface() {
    // Check if chat window already exists
    let chatWindow = document.getElementById('chatWindow');

    if (chatWindow) {
        // Toggle visibility
        chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
        return;
    }

    // Create chat window
    chatWindow = document.createElement('div');
    chatWindow.id = 'chatWindow';
    chatWindow.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        z-index: 1000;
        overflow: hidden;
    `;

    // Chat header
    const chatHeader = document.createElement('div');
    chatHeader.style.cssText = `
        background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
        color: #FFD700;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    chatHeader.innerHTML = `
        <div>
            <strong>Gutenberg Assistant</strong>
            <div style="font-size: 0.75rem; color: #f5f5f5;">How can we help you?</div>
        </div>
        <button id="closeChatBtn" style="background: none; border: none; color: #FFD700; font-size: 1.5rem; cursor: pointer;">×</button>
    `;

    // Chat messages container
    const chatMessages = document.createElement('div');
    chatMessages.id = 'chatMessages';
    chatMessages.style.cssText = `
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
        background: #f5f5f5;
    `;

    // Initial welcome message
    chatMessages.innerHTML = `
        <div style="background: white; padding: 0.75rem; border-radius: 12px; margin-bottom: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <strong style="color: #FFD700;">Gutenberg Assistant</strong>
            <p style="margin: 0.5rem 0 0 0; color: #1a1a1a;">
                Welcome to Gutenberg Languages Institute! 👋<br><br>
                I can help you with:
            </p>
            <ul style="margin: 0.5rem 0; padding-left: 1.5rem; color: #1a1a1a;">
                <li>Course information</li>
                <li>Booking sessions</li>
                <li>Payment options</li>
                <li>General inquiries</li>
            </ul>
            <p style="margin: 0.5rem 0 0 0; color: #1a1a1a;">How can I assist you today?</p>
        </div>
    `;

    // Quick action buttons
    const quickActions = document.createElement('div');
    quickActions.style.cssText = `
        padding: 0.75rem;
        background: white;
        border-top: 1px solid #e0e0e0;
    `;
    quickActions.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
            <button class="quick-action-btn" data-action="courses" style="padding: 0.5rem; background: #FFD700; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">📚 View Courses</button>
            <button class="quick-action-btn" data-action="booking" style="padding: 0.5rem; background: #FFD700; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">📅 Book Session</button>
            <button class="quick-action-btn" data-action="payment" style="padding: 0.5rem; background: #FFD700; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">💳 Payment Info</button>
            <button class="quick-action-btn" data-action="contact" style="padding: 0.5rem; background: #FFD700; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">📞 Contact Us</button>
        </div>
    `;

    // Chat input
    const chatInput = document.createElement('div');
    chatInput.style.cssText = `
        padding: 0.75rem;
        background: white;
        border-top: 1px solid #e0e0e0;
        display: flex;
        gap: 0.5rem;
    `;
    chatInput.innerHTML = `
        <input type="text" id="chatInputField" placeholder="Type your message..." style="flex: 1; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px; font-family: inherit;">
        <button id="sendChatBtn" style="padding: 0.75rem 1.5rem; background: #FFD700; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Send</button>
    `;

    // Assemble chat window
    chatWindow.appendChild(chatHeader);
    chatWindow.appendChild(chatMessages);
    chatWindow.appendChild(quickActions);
    chatWindow.appendChild(chatInput);
    document.body.appendChild(chatWindow);

    // Event listeners
    document.getElementById('closeChatBtn').addEventListener('click', function () {
        chatWindow.style.display = 'none';
    });

    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const action = this.getAttribute('data-action');
            handleQuickAction(action);
        });
    });

    // Send message
    const sendBtn = document.getElementById('sendChatBtn');
    const inputField = document.getElementById('chatInputField');

    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Handle quick actions
function handleQuickAction(action) {
    const responses = {
        courses: {
            message: "We offer three types of courses:<br><br>🔥 <strong>Super Intensive</strong> (6-8 weeks)<br>⚡ <strong>Intensive</strong> (10-12 weeks)<br>📖 <strong>Normal</strong> (16-20 weeks)<br><br>Would you like to view detailed course information?",
            link: "courses.html",
            linkText: "View All Courses"
        },
        booking: {
            message: "Ready to book your session? Click the button below to fill out our booking form. We'll contact you within 24 hours!",
            link: "booking.html",
            linkText: "Book a Session"
        },
        payment: {
            message: "We accept multiple payment methods:<br><br>💳 Online Payment (Credit/Debit)<br>🏦 Bank Transfer<br>💵 Cash Payment<br><br>All payments are secure and encrypted.",
            link: "payment.html",
            linkText: "Payment Options"
        },
        contact: {
            message: "You can reach us at:<br><br>📞 Phone: +1 (XXX) XXX-XXXX<br>📧 Email: info@gutenberglanguages.com<br><br>Or fill out our contact form!",
            link: "contact.html",
            linkText: "Contact Us"
        }
    };

    const response = responses[action];
    if (response) {
        addBotMessage(response.message, response.link, response.linkText);
    }
}

// Send user message
function sendMessage() {
    const inputField = document.getElementById('chatInputField');
    const message = inputField.value.trim();

    if (!message) return;

    // Add user message
    addUserMessage(message);
    inputField.value = '';

    // Simulate bot response
    setTimeout(() => {
        const response = generateBotResponse(message.toLowerCase());
        addBotMessage(response.message, response.link, response.linkText);
    }, 500);
}

// Add user message to chat
function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        background: #FFD700;
        color: #000;
        padding: 0.75rem;
        border-radius: 12px;
        margin-bottom: 0.5rem;
        margin-left: 2rem;
        text-align: right;
    `;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add bot message to chat
function addBotMessage(message, link = null, linkText = null) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        background: white;
        padding: 0.75rem;
        border-radius: 12px;
        margin-bottom: 0.5rem;
        margin-right: 2rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    let content = `<p style="margin: 0; color: #1a1a1a;">${message}</p>`;

    if (link && linkText) {
        content += `<a href="${link}" style="display: inline-block; margin-top: 0.5rem; padding: 0.5rem 1rem; background: #FFD700; color: #000; text-decoration: none; border-radius: 8px; font-weight: 600;">${linkText} →</a>`;
    }

    messageDiv.innerHTML = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate bot response based on user input
function generateBotResponse(message) {
    if (message.includes('course') || message.includes('program') || message.includes('class')) {
        return {
            message: "We offer Super Intensive, Intensive, and Normal courses in over 15 languages. Each program is designed to match different learning paces and schedules.",
            link: "courses.html",
            linkText: "View Courses"
        };
    } else if (message.includes('book') || message.includes('schedule') || message.includes('enroll')) {
        return {
            message: "Great! You can book a session right now. Just fill out our booking form and we'll contact you within 24 hours.",
            link: "booking.html",
            linkText: "Book Now"
        };
    } else if (message.includes('price') || message.includes('cost') || message.includes('payment') || message.includes('pay')) {
        return {
            message: "Our courses range from $1,200 to $2,500 depending on the intensity. We accept online payments, bank transfers, and cash.",
            link: "payment.html",
            linkText: "Payment Info"
        };
    } else if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('location')) {
        return {
            message: "You can reach us at +1 (XXX) XXX-XXXX or info@gutenberglanguages.com. We're here Monday-Friday, 8AM-8PM.",
            link: "contact.html",
            linkText: "Contact Us"
        };
    } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return {
            message: "Hello! 👋 Welcome to Gutenberg Languages Institute. How can I help you today?",
            link: null,
            linkText: null
        };
    } else {
        return {
            message: "I'd be happy to help! You can browse our courses, book a session, or contact us directly. What would you like to know more about?",
            link: null,
            linkText: null
        };
    }
}

// ========== THIRD-PARTY CHATBOT INTEGRATION ==========
// Uncomment and configure if using services like Tidio, Tawk.to, or Drift

function integrateThirdPartyChatbot() {
    /*
    // Example: Tidio Integration
    var tidioScript = document.createElement('script');
    tidioScript.src = '//code.tidio.co/YOUR_TIDIO_KEY.js';
    tidioScript.async = true;
    document.body.appendChild(tidioScript);
    */

    /*
    // Example: Tawk.to Integration
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();
    var s1 = document.createElement("script");
    var s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/YOUR_TAWK_ID/default';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
    */

    console.log('Third-party chatbot integration would be initialized here.');
}
