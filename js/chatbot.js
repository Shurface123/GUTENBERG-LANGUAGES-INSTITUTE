// ============================================
// GUTENBERG LANGUAGES INSTITUTE
// Advanced AI Chatbot Assistant v2.0
// ============================================

(function () {
    'use strict';

    // ── Knowledge Base ────────────────────────────────────────────────────────
    const KB = {
        courses: {
            superIntensive: {
                name: 'Super Intensive Course',
                duration: '6–8 weeks',
                hours: '20–25 hours/week',
                classSize: 'Max 8 students',
                schedule: 'Monday–Friday, Full Day',
                ideal: 'Business professionals, exam prep, relocation'
            },
            intensive: {
                name: 'Intensive Course',
                duration: '10–12 weeks',
                hours: '15 hours/week',
                classSize: 'Max 12 students',
                schedule: 'Monday–Friday, Half Day',
                ideal: 'University students, career development'
            },
            normal: {
                name: 'Normal Course',
                duration: '16–20 weeks',
                hours: '8–10 hours/week',
                classSize: 'Max 15 students',
                schedule: 'Evenings & Weekends',
                ideal: 'Working professionals, hobbyists'
            }
        },
        languages: ['German (Deutsch)', 'French (Français)', 'Spanish (Español)', 'Dutch (Nederlands)', 'Italian (Italiano)', 'Finnish (Suomi)', 'Chinese (中文)', 'Japanese (日本語)'],
        levels: ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Proficient'],
        contact: {
            phone: '+233 50 979 6187 / +233 53 520 3749',
            email: 'glicampus05@gmail.com',
            address: 'Lashibi Com 17 Junction, Accra, Ghana',
            hours: 'Mon–Fri: 8AM–8PM | Sat–Sun: 9AM–5PM'
        }
    };

    // ── Intent Patterns ───────────────────────────────────────────────────────
    const INTENTS = [
        {
            id: 'greeting',
            patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'whatsapp', 'what\'s up'],
            response: () => ({
                text: `Hello! 👋 Welcome to **Gutenberg Languages Institute**!\n\nI'm your virtual assistant. I can help you with:\n- 📚 Course information\n- 🌍 Languages we offer\n- 📅 Booking a session\n- 💳 Payment & fees\n- 📍 Location & hours\n- 🎓 Certificates & levels\n\nWhat would you like to know?`,
                chips: ['View Courses', 'Book a Session', 'Languages Offered', 'Contact Info']
            })
        },
        {
            id: 'courses',
            patterns: ['course', 'program', 'class', 'what do you offer', 'study', 'learn', 'training'],
            response: () => ({
                text: `We offer **3 course formats** to fit every schedule:\n\n🔥 **Super Intensive** (6–8 wks)\n${KB.courses.superIntensive.hours} · ${KB.courses.superIntensive.classSize}\n\n⚡ **Intensive** (10–12 wks)\n${KB.courses.intensive.hours} · ${KB.courses.intensive.classSize}\n\n📖 **Normal** (16–20 wks)\n${KB.courses.normal.hours} · ${KB.courses.normal.classSize}\n\nAll courses include a certificate upon completion! 🎓`,
                link: 'courses.html',
                linkText: 'View Full Course Details',
                chips: ['Super Intensive', 'Intensive Course', 'Normal Course', 'Book Now']
            })
        },
        {
            id: 'super-intensive',
            patterns: ['super intensive', 'super', 'fast track', 'fastest', 'quick course', 'urgency', 'shortest'],
            response: () => ({
                text: `🔥 **Super Intensive Course**\n\n⏱ **Duration:** ${KB.courses.superIntensive.duration}\n📖 **Hours/Week:** ${KB.courses.superIntensive.hours}\n👥 **Class Size:** ${KB.courses.superIntensive.classSize}\n🗓 **Schedule:** ${KB.courses.superIntensive.schedule}\n✅ **Certificate:** Included\n\n**Ideal for:** ${KB.courses.superIntensive.ideal}\n\nThis is our flagship program for those who need results fast!`,
                link: 'booking.html?course=super-intensive',
                linkText: 'Book Super Intensive',
                chips: ['Intensive Course', 'Normal Course', 'Languages Offered']
            })
        },
        {
            id: 'intensive',
            patterns: ['intensive course', 'medium course', 'balanced', 'half day', '10 week', '12 week'],
            response: () => ({
                text: `⚡ **Intensive Course**\n\n⏱ **Duration:** ${KB.courses.intensive.duration}\n📖 **Hours/Week:** ${KB.courses.intensive.hours}\n👥 **Class Size:** ${KB.courses.intensive.classSize}\n🗓 **Schedule:** ${KB.courses.intensive.schedule}\n✅ **Certificate:** Included\n\n**Ideal for:** ${KB.courses.intensive.ideal}\n\nThe perfect balance of structured learning and self-study time.`,
                link: 'booking.html?course=intensive',
                linkText: 'Book Intensive Course',
                chips: ['Super Intensive', 'Normal Course', 'Languages Offered']
            })
        },
        {
            id: 'normal',
            patterns: ['normal course', 'part time', 'evening', 'weekend course', 'flexible', 'slow', 'relaxed', '16 week', '20 week'],
            response: () => ({
                text: `📖 **Normal Course**\n\n⏱ **Duration:** ${KB.courses.normal.duration}\n📖 **Hours/Week:** ${KB.courses.normal.hours}\n👥 **Class Size:** ${KB.courses.normal.classSize}\n🗓 **Schedule:** ${KB.courses.normal.schedule}\n✅ **Certificate:** Included\n\n**Ideal for:** ${KB.courses.normal.ideal}\n\nLearn at your own pace without disrupting your lifestyle.`,
                link: 'booking.html?course=normal',
                linkText: 'Book Normal Course',
                chips: ['Super Intensive', 'Intensive Course', 'Book a Session']
            })
        },
        {
            id: 'languages',
            patterns: ['language', 'german', 'french', 'spanish', 'dutch', 'italian', 'finnish', 'chinese', 'japanese', 'what language', 'which language', 'available language'],
            response: () => ({
                text: `🌍 **Languages We Offer:**\n\n${KB.languages.map(l => `• ${l}`).join('\n')}\n\nAll languages are available in every course format. Don't see yours? Contact us to ask about custom arrangements!`,
                link: 'courses.html#languages',
                linkText: 'View Language Details',
                chips: ['View Courses', 'Book a Session', 'Contact Us']
            })
        },
        {
            id: 'booking',
            patterns: ['book', 'schedule', 'enroll', 'register', 'reserve', 'sign up', 'start', 'join', 'appointment'],
            response: () => ({
                text: `📅 **Booking a Session is Easy!**\n\n1. Fill out our booking form *(takes ~3 mins)*\n2. We confirm within **24 hours** via email/call\n3. Complete a short placement test\n4. Start learning! 🎉\n\nNew courses begin **every month** — flexible start dates available.`,
                link: 'booking.html',
                linkText: '📅 Book Your Session Now',
                chips: ['View Courses', 'Languages Offered', 'Payment Info']
            })
        },
        {
            id: 'payment',
            patterns: ['pay', 'payment', 'price', 'cost', 'fee', 'how much', 'afford', 'installment', 'plan', 'money', 'ghs', 'cedis'],
            response: () => ({
                text: `💳 **Payment Options at GLI:**\n\n✅ Credit / Debit Cards\n✅ Mobile Money (MTN, Vodafone, AirtelTigo)\n✅ Bank Transfer\n✅ Cash at Campus\n✅ Flexible **Installment Plans** available\n\nAll transactions are safe and secure. Contact us for specific fee details for your chosen course and language.`,
                link: 'payment.html',
                linkText: '💳 Payment Details',
                chips: ['Book a Session', 'Contact for Fees']
            })
        },
        {
            id: 'certificate',
            patterns: ['certificate', 'certification', 'cert', 'qualification', 'accredited', 'recognized', 'diploma', 'proof'],
            response: () => ({
                text: `🎓 **Certificates at GLI:**\n\nAll our courses include an **internationally recognized certificate** upon completion.\n\nOur certificates are:\n• Issued by Gutenberg Languages Institute\n• Recognized by employers & institutions\n• Available for all 5 proficiency levels\n• Presented at a **graduation ceremony**\n\nPerfect for CVs, job applications, and university admissions!`,
                chips: ['View Courses', 'Book a Session']
            })
        },
        {
            id: 'levels',
            patterns: ['level', 'beginner', 'intermediate', 'advanced', 'proficient', 'fluent', 'proficiency', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'skill', 'experience'],
            response: () => ({
                text: `📊 **Proficiency Levels We Teach:**\n\n🟢 **Beginner** — No prior knowledge\n🔵 **Elementary** — Basic phrases\n🟡 **Intermediate** — Can hold conversations\n🟠 **Advanced** — Fluent with some errors\n🔴 **Proficient** — Near-native mastery\n\nAll new students take a **free placement test** so we can match you to the right class!`,
                chips: ['View Courses', 'Book a Session', 'Get Placement Test']
            })
        },
        {
            id: 'placement',
            patterns: ['placement', 'placement test', 'assessment', 'test', 'evaluate', 'which level am i', 'know my level'],
            response: () => ({
                text: `📝 **Free Placement Test**\n\nEvery new student gets a **free placement assessment** to determine their level.\n\nThe test is:\n• Short (~20 mins)\n• Written + optional oral component\n• Conducted before your first class\n• Completely free of charge\n\nBook your session first, and we'll schedule the test during your onboarding!`,
                link: 'booking.html',
                linkText: 'Book & Get Your Assessment',
                chips: ['View Levels', 'Book a Session']
            })
        },
        {
            id: 'contact',
            patterns: ['contact', 'reach', 'call', 'phone', 'email', 'address', 'location', 'where', 'find you', 'office', 'visit'],
            response: () => ({
                text: `📞 **Contact Gutenberg Languages Institute:**\n\n📞 **Phone:** ${KB.contact.phone}\n📧 **Email:** ${KB.contact.email}\n📍 **Address:** ${KB.contact.address}\n\n🕐 **Office Hours:**\n${KB.contact.hours}`,
                link: 'contact.html',
                linkText: '📍 Get Directions & Contact Form',
                chips: ['View on Map', 'Book a Session', 'Send a Message']
            })
        },
        {
            id: 'hours',
            patterns: ['open', 'opening', 'hours', 'time', 'when', 'office hours', 'available', 'close', 'closing'],
            response: () => ({
                text: `🕐 **Office Hours:**\n\n📅 **Monday – Friday:** 8:00 AM – 8:00 PM\n📅 **Saturday:** 9:00 AM – 5:00 PM\n📅 **Sunday:** 9:00 AM – 5:00 PM\n\nWe are **closed on Public Holidays**.\n\nYou can reach us by phone, email, or through our online booking form anytime!`,
                chips: ['Contact Info', 'Book a Session']
            })
        },
        {
            id: 'online',
            patterns: ['online', 'virtual', 'remote', 'zoom', 'video', 'distance', 'at home', 'from home'],
            response: () => ({
                text: `💻 **Online Learning Available!**\n\nYes! We offer both **in-person** and **online** classes:\n\n✅ Live interactive sessions via Zoom/Google Meet\n✅ Same curriculum as in-person\n✅ Recorded sessions for revision\n✅ Digital learning materials\n✅ All 3 course formats available online\n\nMention your preference when booking and we'll arrange it!`,
                link: 'booking.html',
                linkText: 'Book Online Class',
                chips: ['View Courses', 'Languages Offered', 'Contact Us']
            })
        },
        {
            id: 'gallery',
            patterns: ['gallery', 'photo', 'picture', 'image', 'campus', 'facility', 'classroom', 'see'],
            response: () => ({
                text: `🖼️ **Our Campus Gallery**\n\nWant to see our modern learning facilities, classrooms, and events? Check out our gallery for photos of:\n• State-of-the-art classrooms\n• Cultural events & workshops\n• Student graduations\n• Our friendly teaching staff`,
                link: 'gallery.html',
                linkText: 'View Gallery',
                chips: ['Book a Visit', 'Contact Us']
            })
        },
        {
            id: 'reviews',
            patterns: ['review', 'testimonial', 'feedback', 'rating', 'opinion', 'student say', 'experience', 'recommend'],
            response: () => ({
                text: `⭐ **What Our Students Say**\n\nDon't just take our word for it — our students love GLI! We have hundreds of positive reviews from graduates who have:\n• Landed jobs abroad\n• Passed language exams\n• Moved to new countries\n• Advanced in their careers\n\nCheck out our reviews page to read their stories!`,
                link: 'reviews.html',
                linkText: 'Read Student Reviews',
                chips: ['View Courses', 'Book a Session']
            })
        },
        {
            id: 'about',
            patterns: ['about', 'who are you', 'what is gutenberg', 'history', 'founded', 'background', 'established', 'since', '2015'],
            response: () => ({
                text: `🏫 **About Gutenberg Languages Institute**\n\nFounded in **2015**, GLI is one of Ghana's leading language schools based in **Accra**.\n\nWe specialise in:\n• Premium language education\n• Cultural immersion programs\n• Professional language training\n• Internationally recognised certifications\n\nOur mission: **Empowering global communication** through expert language education.`,
                link: 'about.html',
                linkText: 'Learn More About Us',
                chips: ['View Courses', 'Our Languages', 'Book a Session']
            })
        },
        {
            id: 'thanks',
            patterns: ['thank', 'thanks', 'thank you', 'appreciate', 'helpful', 'great', 'awesome', 'perfect'],
            response: () => ({
                text: `You're very welcome! 😊 It's our pleasure to help.\n\nIs there anything else I can assist you with? Whether it's booking a session, course details, or any other question — I'm here for you! 🌟`,
                chips: ['View Courses', 'Book a Session', 'Contact Us']
            })
        },
        {
            id: 'bye',
            patterns: ['bye', 'goodbye', 'see you', 'later', 'ciao', 'take care', 'farewell'],
            response: () => ({
                text: `Goodbye! 👋 Thank you for visiting Gutenberg Languages Institute.\n\nWe hope to see you in class soon! Feel free to chat with us anytime or visit us at our campus in Accra. 🇬🇭`,
                chips: ['Book a Session', 'Contact Us']
            })
        }
    ];

    const FALLBACK_RESPONSES = [
        {
            text: `I'm not quite sure about that, but I'd love to help! Here are some things I can assist with:`,
            chips: ['View Courses', 'Languages Offered', 'Book a Session', 'Contact Us']
        },
        {
            text: `Hmm, let me point you in the right direction! Try asking about our courses, languages, booking process, or contact details. 😊`,
            chips: ['Course Info', 'Payment Options', 'Location & Hours']
        },
        {
            text: `I may not have an answer for that, but our team definitely does! You can reach us directly:`,
            chips: ['Contact Us', 'Book a Session']
        }
    ];

    // ── State ─────────────────────────────────────────────────────────────────
    let isOpen = false;
    let messageCount = 0;
    let fallbackIndex = 0;
    let conversationHistory = [];

    // ── DOM Refs ──────────────────────────────────────────────────────────────
    let chatWindow, chatMessages, chatInputField, notificationBadge;

    // ── Styles injected into <head> ───────────────────────────────────────────
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* ── Chatbot Trigger Button ── */
            .chatbot-trigger {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #FFD700 0%, #FFC300 100%);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                z-index: 1001;
                box-shadow: 0 4px 20px rgba(255, 215, 0, 0.45), 0 2px 8px rgba(0,0,0,0.2);
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.4rem;
                color: #000;
            }
            .chatbot-trigger:hover {
                transform: scale(1.12) translateY(-3px);
                box-shadow: 0 8px 28px rgba(255, 215, 0, 0.55), 0 4px 12px rgba(0,0,0,0.2);
            }
            .chatbot-trigger.is-open {
                background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
                color: #FFD700;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }
            /* ── Notification Badge ── */
            .chat-badge {
                position: absolute;
                top: -4px;
                right: -4px;
                width: 20px;
                height: 20px;
                background: #e53935;
                color: white;
                border-radius: 50%;
                font-size: 11px;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid white;
                animation: badgePop 0.4s ease;
            }
            @keyframes badgePop {
                0% { transform: scale(0); }
                70% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            /* ── Chat Window ── */
            #gliChatWindow {
                position: fixed;
                bottom: 104px;
                right: 30px;
                width: 380px;
                max-height: 580px;
                background: #fff;
                border-radius: 20px;
                box-shadow: 0 12px 48px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
                z-index: 1000;
                overflow: hidden;
                transform: scale(0.92) translateY(20px);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                pointer-events: none;
            }
            #gliChatWindow.is-visible {
                transform: scale(1) translateY(0);
                opacity: 1;
                pointer-events: all;
            }
            /* ── Chat Header ── */
            .chat-header {
                background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
                padding: 16px 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                flex-shrink: 0;
            }
            .chat-avatar {
                width: 42px;
                height: 42px;
                background: linear-gradient(135deg, #FFD700, #FFC300);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                flex-shrink: 0;
            }
            .chat-header-info { flex: 1; }
            .chat-header-name { color: #fff; font-weight: 700; font-size: 0.95rem; }
            .chat-status {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 0.72rem;
                color: rgba(255,255,255,0.6);
                margin-top: 2px;
            }
            .status-dot {
                width: 7px; height: 7px;
                background: #4caf50;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }
            .chat-close-btn {
                background: rgba(255,255,255,0.1);
                border: none;
                color: rgba(255,255,255,0.7);
                width: 30px; height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .chat-close-btn:hover {
                background: rgba(255,255,255,0.2);
                color: #fff;
            }
            /* ── Messages Area ── */
            #gliChatMessages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background: #f7f7f8;
                display: flex;
                flex-direction: column;
                gap: 10px;
                scroll-behavior: smooth;
            }
            #gliChatMessages::-webkit-scrollbar { width: 4px; }
            #gliChatMessages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
            /* ── Message Bubbles ── */
            .msg-bot-wrap { display: flex; align-items: flex-end; gap: 8px; animation: msgIn 0.3s ease; }
            .msg-user-wrap { display: flex; justify-content: flex-end; animation: msgIn 0.3s ease; }
            @keyframes msgIn {
                from { opacity: 0; transform: translateY(8px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            .msg-bot-avatar {
                width: 28px; height: 28px;
                background: linear-gradient(135deg, #FFD700, #FFC300);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                flex-shrink: 0;
                margin-bottom: 2px;
            }
            .msg-bot {
                background: #fff;
                color: #1a1a1a;
                padding: 12px 14px;
                border-radius: 16px 16px 16px 4px;
                max-width: 82%;
                font-size: 0.88rem;
                line-height: 1.6;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                border: 1px solid rgba(0,0,0,0.04);
                white-space: pre-line;
            }
            .msg-bot strong { font-weight: 700; color: #000; }
            .msg-user {
                background: linear-gradient(135deg, #FFD700, #FFC300);
                color: #000;
                padding: 10px 14px;
                border-radius: 16px 16px 4px 16px;
                max-width: 78%;
                font-size: 0.88rem;
                line-height: 1.5;
                font-weight: 500;
                box-shadow: 0 2px 8px rgba(255,215,0,0.25);
            }
            /* ── Typing Indicator ── */
            .typing-indicator {
                display: flex;
                align-items: flex-end;
                gap: 8px;
                animation: msgIn 0.3s ease;
            }
            .typing-dots {
                background: #fff;
                padding: 12px 16px;
                border-radius: 16px 16px 16px 4px;
                display: flex;
                gap: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            }
            .typing-dots span {
                width: 7px; height: 7px;
                background: #bbb;
                border-radius: 50%;
                animation: typingBounce 1.2s infinite;
            }
            .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
            .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typingBounce {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-6px); }
            }
            /* ── Quick Chips ── */
            .chips-wrap {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-top: 8px;
            }
            .chip {
                background: rgba(255,215,0,0.12);
                border: 1.5px solid rgba(255,215,0,0.5);
                color: #7a5c00;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.78rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
            }
            .chip:hover {
                background: #FFD700;
                border-color: #FFD700;
                color: #000;
                transform: translateY(-1px);
            }
            /* ── Action Link Button ── */
            .msg-action-btn {
                display: inline-block;
                margin-top: 10px;
                background: linear-gradient(135deg, #FFD700, #FFC300);
                color: #000;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 0.8rem;
                font-weight: 700;
                text-decoration: none;
                box-shadow: 0 2px 8px rgba(255,215,0,0.3);
                transition: all 0.2s;
            }
            .msg-action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 14px rgba(255,215,0,0.4);
            }
            /* ── Input Area ── */
            .chat-input-area {
                background: #fff;
                border-top: 1px solid #f0f0f0;
                padding: 12px 14px;
                flex-shrink: 0;
            }
            .chat-input-row {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            #gliChatInput {
                flex: 1;
                padding: 10px 14px;
                border: 2px solid #f0f0f0;
                border-radius: 24px;
                font-family: inherit;
                font-size: 0.88rem;
                outline: none;
                transition: border-color 0.2s;
                background: #fafafa;
                color: #1a1a1a;
            }
            #gliChatInput:focus {
                border-color: #FFD700;
                background: #fff;
                box-shadow: 0 0 0 3px rgba(255,215,0,0.12);
            }
            #gliSendBtn {
                width: 40px; height: 40px;
                background: linear-gradient(135deg, #FFD700, #FFC300);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                box-shadow: 0 2px 8px rgba(255,215,0,0.35);
                flex-shrink: 0;
                color: #000;
                font-size: 1rem;
            }
            #gliSendBtn:hover { transform: scale(1.1); }
            #gliSendBtn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
            .chat-footer-note {
                text-align: center;
                font-size: 0.68rem;
                color: #bbb;
                margin-top: 6px;
            }
            /* ── Responsive ── */
            @media (max-width: 480px) {
                #gliChatWindow {
                    width: calc(100vw - 20px);
                    right: 10px;
                    bottom: 90px;
                    max-height: 70vh;
                }
                .chatbot-trigger { right: 16px; bottom: 16px; }
            }
        `;
        document.head.appendChild(style);
    }

    // ── Build UI ──────────────────────────────────────────────────────────────
    function buildChatWindow() {
        chatWindow = document.createElement('div');
        chatWindow.id = 'gliChatWindow';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <div class="chat-avatar">🎓</div>
                <div class="chat-header-info">
                    <div class="chat-header-name">GLI Assistant</div>
                    <div class="chat-status">
                        <div class="status-dot"></div>
                        <span>Online · Gutenberg Languages Institute</span>
                    </div>
                </div>
                <button class="chat-close-btn" id="gliCloseBtn" aria-label="Close chat">✕</button>
            </div>
            <div id="gliChatMessages"></div>
            <div class="chat-input-area">
                <div class="chat-input-row">
                    <input type="text" id="gliChatInput" placeholder="Ask me anything…" autocomplete="off" maxlength="300">
                    <button id="gliSendBtn" aria-label="Send message">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="chat-footer-note">Gutenberg Languages Institute · Accra, Ghana</div>
            </div>
        `;
        document.body.appendChild(chatWindow);
        chatMessages = document.getElementById('gliChatMessages');
        chatInputField = document.getElementById('gliChatInput');

        document.getElementById('gliCloseBtn').addEventListener('click', toggleChat);
        document.getElementById('gliSendBtn').addEventListener('click', handleSend);
        chatInputField.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });
    }

    // ── Toggle Chat ───────────────────────────────────────────────────────────
    function toggleChat() {
        isOpen = !isOpen;
        const trigger = document.getElementById('chatbotTrigger');
        if (isOpen) {
            chatWindow.classList.add('is-visible');
            trigger.classList.add('is-open');
            trigger.innerHTML = '<i class="fas fa-times"></i>';
            // Remove notification badge
            const badge = trigger.querySelector('.chat-badge');
            if (badge) badge.remove();
            // Send welcome message on first open
            if (messageCount === 0) {
                setTimeout(() => sendBotMessage(
                    `👋 Hello! Welcome to **Gutenberg Languages Institute**!\n\nI'm your virtual assistant. How can I help you today?`,
                    null, null,
                    ['View Courses', 'Book a Session', 'Languages Offered', 'Contact Info', 'About GLI']
                ), 400);
            }
            setTimeout(() => chatInputField.focus(), 350);
        } else {
            chatWindow.classList.remove('is-visible');
            trigger.classList.remove('is-open');
            trigger.innerHTML = '<i class="fas fa-comments"></i>';
        }
    }

    // ── Send Messages ─────────────────────────────────────────────────────────
    function handleSend() {
        const text = chatInputField.value.trim();
        if (!text) return;
        chatInputField.value = '';
        addUserBubble(text);
        conversationHistory.push({ role: 'user', text });
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            const reply = processIntent(text.toLowerCase());
            sendBotMessage(reply.text, reply.link, reply.linkText, reply.chips);
        }, 700 + Math.random() * 500);
    }

    function handleChipClick(chipText) {
        const chipMap = {
            'View Courses': 'courses',
            'Course Info': 'courses',
            'Book a Session': 'booking',
            'Book Now': 'booking',
            'Languages Offered': 'languages',
            'Our Languages': 'languages',
            'Contact Us': 'contact',
            'Contact Info': 'contact',
            'Contact for Fees': 'contact',
            'Payment Info': 'payment',
            'Payment Options': 'payment',
            'Super Intensive': 'super intensive',
            'Intensive Course': 'intensive course',
            'Normal Course': 'normal course',
            'About GLI': 'about gutenberg',
            'View on Map': 'location',
            'Location & Hours': 'office hours',
            'View Levels': 'proficiency levels',
            'Get Placement Test': 'placement test',
            'Book a Visit': 'visit campus',
            'Send a Message': 'send message contact',
        };
        const query = chipMap[chipText] || chipText.toLowerCase();
        addUserBubble(chipText);
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            const reply = processIntent(query);
            sendBotMessage(reply.text, reply.link, reply.linkText, reply.chips);
        }, 500 + Math.random() * 400);
    }

    // ── Intent Processor ──────────────────────────────────────────────────────
    function processIntent(text) {
        for (const intent of INTENTS) {
            if (intent.patterns.some(p => text.includes(p))) {
                return intent.response();
            }
        }
        const fb = FALLBACK_RESPONSES[fallbackIndex % FALLBACK_RESPONSES.length];
        fallbackIndex++;
        return fb;
    }

    // ── DOM Helpers ───────────────────────────────────────────────────────────
    function addUserBubble(text) {
        messageCount++;
        const wrap = document.createElement('div');
        wrap.className = 'msg-user-wrap';
        wrap.innerHTML = `<div class="msg-user">${escapeHTML(text)}</div>`;
        chatMessages.appendChild(wrap);
        scrollToBottom();
    }

    function sendBotMessage(text, link = null, linkText = null, chips = []) {
        messageCount++;
        conversationHistory.push({ role: 'bot', text });

        const wrap = document.createElement('div');
        wrap.className = 'msg-bot-wrap';

        // Format **bold** markdown
        const formatted = formatText(text);

        let inner = `<div class="msg-bot">${formatted}`;
        if (link && linkText) {
            inner += `<br><a href="${link}" class="msg-action-btn">${linkText} →</a>`;
        }
        inner += `</div>`;

        wrap.innerHTML = `<div class="msg-bot-avatar">🎓</div>${inner}`;
        chatMessages.appendChild(wrap);

        // Append chips
        if (chips && chips.length) {
            const chipsWrap = document.createElement('div');
            chipsWrap.className = 'chips-wrap';
            chipsWrap.style.paddingLeft = '36px';
            chips.forEach(chip => {
                const btn = document.createElement('button');
                btn.className = 'chip';
                btn.textContent = chip;
                btn.addEventListener('click', () => handleChipClick(chip));
                chipsWrap.appendChild(btn);
            });
            chatMessages.appendChild(chipsWrap);
        }

        scrollToBottom();
    }

    function showTypingIndicator() {
        const el = document.createElement('div');
        el.className = 'typing-indicator';
        el.id = 'typingIndicator';
        el.innerHTML = `
            <div class="msg-bot-avatar">🎓</div>
            <div class="typing-dots"><span></span><span></span><span></span></div>
        `;
        chatMessages.appendChild(el);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatText(text) {
        return escapeHTML(text)
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // ── Init ──────────────────────────────────────────────────────────────────
    function init() {
        injectStyles();
        buildChatWindow();

        const trigger = document.getElementById('chatbotTrigger');
        if (trigger) {
            // Style the trigger button icon
            trigger.innerHTML = '<i class="fas fa-comments"></i>';
            trigger.addEventListener('click', toggleChat);

            // Show notification badge after 3 seconds
            setTimeout(() => {
                if (!isOpen) {
                    const badge = document.createElement('div');
                    badge.className = 'chat-badge';
                    badge.textContent = '1';
                    trigger.appendChild(badge);
                }
            }, 3000);
        }
    }

    // ── Boot ──────────────────────────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
