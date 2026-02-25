// ============================================
// GUTENBERG LANGUAGES INSTITUTE
// Advanced AI Chatbot Assistant v3.0
// Built with: Vanilla JS IIFE, rule-based NLP,
// multi-turn context, quiz wizard, fee calculator,
// WhatsApp/email handoff, session persistence.
// ============================================

(function () {
    'use strict';

    /* ══════════════════════════════════════════
       KNOWLEDGE BASE
    ══════════════════════════════════════════ */
    const KB = {
        courses: {
            super: {
                key: 'super',
                name: 'Super Intensive',
                duration: '6–8 weeks',
                hours: '20–25 hrs/week',
                size: 'Max 8 students',
                schedule: 'Mon–Fri, Full Day',
                ideal: 'Business professionals, exam prep, relocation',
                price: 3300,
            },
            intensive: {
                key: 'intensive',
                name: 'Intensive',
                duration: '10–12 weeks',
                hours: '15 hrs/week',
                size: 'Max 12 students',
                schedule: 'Mon–Fri, Half Day',
                ideal: 'University students, career changers',
                price: 3600,
            },
            normal: {
                key: 'normal',
                name: 'Normal',
                duration: '16–20 weeks',
                hours: '8–10 hrs/week',
                size: 'Max 15 students',
                schedule: 'Evenings & Weekends',
                ideal: 'Working professionals, hobbyists',
                price: 4000,
            },
        },
        languages: [
            { name: 'German', flag: '🇩🇪', code: 'de' },
            { name: 'French', flag: '🇫🇷', code: 'fr' },
            { name: 'Spanish', flag: '🇪🇸', code: 'es' },
            { name: 'Dutch', flag: '🇳🇱', code: 'nl' },
            { name: 'Italian', flag: '🇮🇹', code: 'it' },
            { name: 'Finnish', flag: '🇫🇮', code: 'fi' },
            { name: 'Mandarin Chinese', flag: '🇨🇳', code: 'zh' },
            { name: 'Japanese', flag: '🇯🇵', code: 'ja' },
        ],
        levels: ['Beginner (A1)', 'Elementary (A2)', 'Intermediate (B1)', 'Upper-Intermediate (B2)', 'Advanced (C1)', 'Proficient (C2)'],
        contact: {
            phone1: '+233 50 979 6187',
            phone2: '+233 53 520 3749',
            email: 'glicampus05@gmail.com',
            address: 'Lashibi Com 17 Junction, Accra, Ghana',
            hours: 'Mon–Fri: 8 AM – 8 PM · Sat–Sun: 9 AM – 5 PM',
            whatsapp: '233509796187',
        },
        faq: [
            { q: 'Do I need prior knowledge?', a: 'No! We welcome complete beginners. A free placement test matches you to the right level.' },
            { q: 'Can I study online?', a: 'Yes — all 3 course formats are available online via Zoom/Google Meet with recorded sessions.' },
            { q: 'How do I get my certificate?', a: 'Certificates are awarded at a graduation ceremony upon course completion. They are internationally recognised.' },
            { q: 'What payment methods are accepted?', a: 'Card, Mobile Money (MTN, Telecel, AirtelTigo), bank transfer, and cash at campus. Installment plans available.' },
            { q: 'When do courses start?', a: 'New cohorts begin every month. Flexible start dates are available — contact us to confirm the next intake.' },
            { q: 'Is there a trial class?', a: 'Yes! We offer a free introductory session. Book via our contact form or call us to schedule.' },
            { q: 'Are group discounts available?', a: 'Yes — groups of 3+ receive a 10% discount. Corporate packages available on request.' },
            { q: 'What is the refund policy?', a: 'We offer a full refund within 7 days of enrolment if you\'re not satisfied with the course.' },
        ],
    };

    /* ══════════════════════════════════════════
       STATE
    ══════════════════════════════════════════ */
    const STATE = {
        open: false,
        msgCount: 0,
        fbIndex: 0,
        context: [],          // last N intent ids
        quiz: null,           // active quiz session
        feeCalc: null,        // fee calculator session
        sessionKey: 'gli-chat-session',
    };

    /* ══════════════════════════════════════════
       INTENTS  (order = priority)
    ══════════════════════════════════════════ */
    const INTENTS = [

        /* ─── Greeting ─── */
        {
            id: 'greeting',
            patterns: ['hello', 'hi ', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', "what's up", 'greetings', 'hiya'],
            handler: () => ({
                text: `👋 Hi there! Welcome to **Gutenberg Languages Institute**!\n\nI'm your virtual assistant — powered by GLI's knowledge base. I can help you with:\n\n📚 Course info & pricing\n🌍 Languages we teach\n📅 Booking & enrolment\n💳 Payment options\n📍 Location & hours\n🎓 Certificates & levels\n\nWhat would you like to explore?`,
                chips: ['Browse Courses', 'Languages Offered', 'Calculate Fees', 'Book a Session'],
            }),
        },

        /* ─── Courses overview ─── */
        {
            id: 'courses',
            patterns: ['course', 'program', 'what do you offer', 'study options', 'what can i learn', 'training', 'class'],
            handler: () => ({
                text: `We offer **3 course formats** — choose the pace that fits your life:\n\n🔥 **Super Intensive** · ${KB.courses.super.duration} · GH₵ ${KB.courses.super.price.toLocaleString()}\n ${KB.courses.super.hours} · ${KB.courses.super.size}\n\n⚡ **Intensive** · ${KB.courses.intensive.duration} · GH₵ ${KB.courses.intensive.price.toLocaleString()}\n ${KB.courses.intensive.hours} · ${KB.courses.intensive.size}\n\n📖 **Normal** · ${KB.courses.normal.duration} · GH₵ ${KB.courses.normal.price.toLocaleString()}\n ${KB.courses.normal.hours} · ${KB.courses.normal.size}\n\nAll include a **certificate** upon completion! 🎓`,
                link: 'courses.html',
                linkText: 'View Full Course Details',
                chips: ['Super Intensive', 'Intensive Course', 'Normal Course', 'Find My Course', 'Calculate Fees'],
            }),
        },

        /* ─── Super Intensive ─── */
        {
            id: 'super',
            patterns: ['super intensive', 'super course', 'fast track', 'fastest', 'quick course', 'shortest', '6 week', '8 week'],
            handler: () => courseCard(KB.courses.super),
        },

        /* ─── Intensive ─── */
        {
            id: 'intensive',
            patterns: ['intensive course', 'half day', 'medium course', '10 week', '12 week', 'balanced'],
            handler: () => courseCard(KB.courses.intensive),
        },

        /* ─── Normal ─── */
        {
            id: 'normal',
            patterns: ['normal course', 'part time', 'evening class', 'weekend', 'flexible', '16 week', '20 week'],
            handler: () => courseCard(KB.courses.normal),
        },

        /* ─── Course Quiz ─── */
        {
            id: 'quiz',
            patterns: ['find my course', 'which course', 'recommend', 'help me choose', 'right course', 'best course', 'suit me', 'quiz'],
            handler: () => startQuiz(),
        },

        /* ─── Fee Calculator ─── */
        {
            id: 'fees',
            patterns: ['calculate', 'fee', 'cost', 'price', 'how much', 'afford', 'total fee', 'ghs', 'cedis', 'calculator'],
            handler: () => startFeeCalc(),
        },

        /* ─── Languages ─── */
        {
            id: 'languages',
            patterns: ['language', 'german', 'french', 'spanish', 'dutch', 'italian', 'finnish', 'chinese', 'japanese', 'what language', 'which language', 'available'],
            handler: () => ({
                text: `🌍 **Languages We Teach:**\n\n${KB.languages.map(l => `${l.flag} **${l.name}**`).join('\n')}\n\nAll languages are available in every course format. Don't see yours? Ask us — custom arrangements may be possible.`,
                link: 'courses.html',
                linkText: 'View Language Curriculum',
                chips: ['Browse Courses', 'Book a Session', 'Contact Us'],
            }),
        },

        /* ─── Booking ─── */
        {
            id: 'booking',
            patterns: ['book', 'schedule', 'enroll', 'register', 'reserve', 'sign up', 'start', 'join', 'appointment', 'apply'],
            handler: () => ({
                text: `📅 **Booking Your Session**\n\nHere's how it works:\n1️⃣ Fill out our booking form *(~3 minutes)*\n2️⃣ We confirm within **24 hours** by phone/email\n3️⃣ Take a **free placement test**\n4️⃣ Start learning! 🎉\n\nNew cohorts start **every month** — flexible dates available.`,
                link: 'booking.html',
                linkText: '📅 Book Your Session Now',
                chips: ['Browse Courses', 'Languages Offered', 'Payment Options'],
            }),
        },

        /* ─── Payment ─── */
        {
            id: 'payment',
            patterns: ['pay', 'payment', 'installment', 'plan', 'money', 'transfer', 'card', 'momo', 'mobile money', 'mtn', 'telecel', 'airteltigo', 'cash'],
            handler: () => ({
                text: `💳 **Payment Options at GLI:**\n\n✅ Credit / Debit Card (Visa, Mastercard)\n✅ Mobile Money — MTN · Telecel · AirtelTigo\n✅ Bank Transfer (Fidelity Bank, Account: 2030911236315)\n✅ Cash at Campus\n✅ **Installment Plans** — pay across 2–3 months\n\nAll transactions are completely secure. 🔒`,
                link: 'payment.html',
                linkText: '💳 Proceed to Payment',
                chips: ['Calculate Fees', 'Book a Session', 'Contact for Plan'],
            }),
        },

        /* ─── Certificates ─── */
        {
            id: 'certificate',
            patterns: ['certificate', 'cert', 'diploma', 'accredited', 'recognised', 'qualification', 'proof', 'graduation'],
            handler: () => ({
                text: `🎓 **Certificates at GLI**\n\nEvery student who completes a course receives an **internationally recognised certificate**.\n\nOur certificates:\n• Issued at a **graduation ceremony**\n• Recognised by employers & universities\n• Available for all 6 CEFR levels (A1–C2)\n• Perfect for CVs, job applications & visa applications`,
                link: 'certificates.html',
                linkText: 'View Our Accreditations',
                chips: ['Browse Courses', 'Book a Session', 'Our Levels'],
            }),
        },

        /* ─── Levels ─── */
        {
            id: 'levels',
            patterns: ['level', 'beginner', 'intermediate', 'advanced', 'proficient', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'cefr', 'fluent', 'skill'],
            handler: () => ({
                text: `📊 **Proficiency Levels We Teach:**\n\n🟢 **A1** Beginner — Zero knowledge\n🔵 **A2** Elementary — Basic phrases\n🟡 **B1** Intermediate — Can converse\n🟠 **B2** Upper-Intermediate — Fluent with errors\n🔴 **C1** Advanced — Near-native fluency\n⭐ **C2** Proficient — Mastery\n\nEvery new student gets a **free placement test** to find their starting level!`,
                chips: ['Get Placement Test', 'Browse Courses', 'Book a Session'],
            }),
        },

        /* ─── Placement Test ─── */
        {
            id: 'placement',
            patterns: ['placement test', 'placement', 'assessment', 'evaluate', 'which level', 'know my level', 'test my'],
            handler: () => ({
                text: `📝 **Free Placement Test**\n\nBefore your first class we give you a **free assessment** to determine your current level.\n\n✅ Takes ~20 minutes\n✅ Written + optional oral component\n✅ 100% free of charge\n✅ Scheduled at onboarding\n\nSimply book your session and we'll arrange it!`,
                link: 'booking.html',
                linkText: 'Book & Schedule Assessment',
                chips: ['Our Levels', 'Browse Courses'],
            }),
        },

        /* ─── Contact ─── */
        {
            id: 'contact',
            patterns: ['contact', 'reach', 'call', 'phone', 'email', 'address', 'location', 'where', 'find you', 'office', 'visit'],
            handler: () => ({
                text: `📞 **Contact Gutenberg Languages Institute**\n\n📞 ${KB.contact.phone1} · ${KB.contact.phone2}\n📧 ${KB.contact.email}\n📍 ${KB.contact.address}\n\n🕐 **Hours:** ${KB.contact.hours}`,
                link: 'contact.html',
                linkText: '📍 Directions & Contact Form',
                chips: ['WhatsApp Us', 'Send an Email', 'Book a Session'],
            }),
        },

        /* ─── WhatsApp Handoff ─── */
        {
            id: 'whatsapp',
            patterns: ['whatsapp', 'whats app', 'wa', 'message us'],
            handler: () => ({
                text: `💬 **Chat with us on WhatsApp!**\n\nClick the button below to open a direct WhatsApp conversation with our admissions team. We typically respond within **minutes** during office hours!`,
                link: `https://wa.me/${KB.contact.whatsapp}?text=Hi%20GLI%2C%20I%27d%20like%20to%20know%20more%20about%20your%20courses`,
                linkText: '💬 Open WhatsApp Chat',
                chips: ['Browse Courses', 'Book a Session', 'Contact Info'],
            }),
        },

        /* ─── Email ─── */
        {
            id: 'email_us',
            patterns: ['send email', 'send a message', 'send message', 'email you'],
            handler: () => ({
                text: `📧 **Send us an email!**\n\nYou can reach us at:\n📧 **${KB.contact.email}**\n\nOr use our contact form — we respond within 24 hours. ⚡`,
                link: `mailto:${KB.contact.email}`,
                linkText: '📧 Send Email Now',
                chips: ['Contact Form', 'WhatsApp Us', 'Call Us'],
            }),
        },

        /* ─── Hours ─── */
        {
            id: 'hours',
            patterns: ['open', 'opening hours', 'office hours', 'time', 'when', 'close', 'closing', 'available time'],
            handler: () => ({
                text: `🕐 **Office Hours:**\n\n📅 **Monday – Friday:** 8:00 AM – 8:00 PM\n📅 **Saturday:** 9:00 AM – 5:00 PM\n📅 **Sunday:** 9:00 AM – 5:00 PM\n\nClosed on **Public Holidays**.\n\nYou can reach us by phone, email, or WhatsApp anytime!`,
                chips: ['Contact Info', 'WhatsApp Us', 'Book a Session'],
            }),
        },

        /* ─── Online learning ─── */
        {
            id: 'online',
            patterns: ['online', 'virtual', 'remote', 'zoom', 'video', 'from home', 'distance'],
            handler: () => ({
                text: `💻 **Yes — We Offer Online Classes!**\n\n✅ Live interactive sessions via Zoom / Google Meet\n✅ Same curriculum as in-person classes\n✅ Sessions recorded for revision\n✅ All 3 course formats available online\n✅ Digital learning materials included\n\nJust mention your preference when booking!`,
                link: 'booking.html',
                linkText: 'Book Online Class',
                chips: ['Browse Courses', 'Languages Offered', 'Contact Us'],
            }),
        },

        /* ─── Gallery ─── */
        {
            id: 'gallery',
            patterns: ['gallery', 'photo', 'campus', 'facility', 'classroom', 'picture', 'tour'],
            handler: () => ({
                text: `🖼 **GLI Campus Gallery**\n\nSee our modern facilities, classrooms, graduations, and cultural events!`,
                link: 'gallery.html',
                linkText: 'View Gallery',
                chips: ['Browse Courses', 'Contact Us', 'Book a Visit'],
            }),
        },

        /* ─── Reviews ─── */
        {
            id: 'reviews',
            patterns: ['review', 'testimonial', 'feedback', 'rating', 'opinion', 'what do students say', 'recommend'],
            handler: () => ({
                text: `⭐ **Student Reviews**\n\nDon't just take our word for it! Our graduates have:\n\n✅ Landed international jobs\n✅ Passed CEFR exams\n✅ Relocated abroad successfully\n✅ Advanced in their careers\n\nCheck out our reviews page for real success stories!`,
                link: 'reviews.html',
                linkText: 'Read Student Reviews',
                chips: ['Browse Courses', 'Book a Session'],
            }),
        },

        /* ─── About ─── */
        {
            id: 'about',
            patterns: ['about', 'who are you', 'what is gutenberg', 'history', 'established', 'founded', '2015', 'background'],
            handler: () => ({
                text: `🏫 **About Gutenberg Languages Institute**\n\nFounded in **2015**, GLI is one of Accra's leading language schools.\n\nWe specialise in:\n• Premium language education\n• Cultural immersion\n• Professional language training\n• Internationally recognised certificates\n\n🎯 Mission: **Empowering global communication** through expert language education.`,
                link: 'about.html',
                linkText: 'Learn More About Us',
                chips: ['Browse Courses', 'Our Certificates', 'Book a Session'],
            }),
        },

        /* ─── FAQ ─── */
        {
            id: 'faq',
            patterns: ['faq', 'question', 'common question', 'frequently', 'i want to know', 'tell me', 'explain', 'how does', 'how do'],
            handler: () => ({
                text: `💡 **Frequently Asked Questions**\n\nTap a question below or type your own!\n\n${KB.faq.map((f, i) => `${i + 1}. ${f.q}`).join('\n')}`,
                chips: KB.faq.map(f => f.q).slice(0, 4),
            }),
        },

        /* ─── Embedded FAQ answers ─── */
        {
            id: 'faq_trial',
            patterns: ['trial class', 'free class', 'try before', 'demo class', 'introductory', 'sample class'],
            handler: () => faqAnswer('Is there a trial class?'),
        },
        {
            id: 'faq_discount',
            patterns: ['discount', 'group discount', 'corporate', 'family discount', 'promo', 'offer'],
            handler: () => faqAnswer('Are group discounts available?'),
        },
        {
            id: 'faq_refund',
            patterns: ['refund', 'money back', 'cancel', 'cancellation'],
            handler: () => faqAnswer('What is the refund policy?'),
        },
        {
            id: 'faq_start_date',
            patterns: ['start date', 'when does course start', 'next intake', 'next cohort', 'when can i start'],
            handler: () => faqAnswer('When do courses start?'),
        },

        /* ─── Thanks ─── */
        {
            id: 'thanks',
            patterns: ['thank', 'thanks', 'appreciate', 'helpful', 'great', 'awesome', 'perfect', 'brilliant'],
            handler: () => ({
                text: `You're very welcome! 😊 It's our pleasure to help.\n\nIs there anything else you'd like to know about GLI?`,
                chips: ['Browse Courses', 'Book a Session', 'Contact Us'],
            }),
        },

        /* ─── Goodbye ─── */
        {
            id: 'bye',
            patterns: ['bye', 'goodbye', 'see you', 'ciao', 'take care', 'farewell', 'later', 'quit', 'exit'],
            handler: () => ({
                text: `Goodbye! 👋 Thank you for visiting Gutenberg Languages Institute.\n\nWe hope to see you in class soon! Feel free to chat anytime or visit us in Accra. 🇬🇭\n\n*Powered by GLI Assistant v3*`,
                chips: ['Book a Session', 'Contact Us'],
            }),
        },

        /* ─── Human agent request ─── */
        {
            id: 'human',
            patterns: ['speak to human', 'talk to person', 'agent', 'staff', 'real person', 'live support', 'live chat'],
            handler: () => handoff(),
        },
    ];

    /* ══════════════════════════════════════════
       FALLBACKS
    ══════════════════════════════════════════ */
    const FALLBACKS = [
        {
            text: `Hmm, I'm not quite sure about that. Let me point you in the right direction:`,
            chips: ['Browse Courses', 'Languages Offered', 'Book a Session', 'Contact Us'],
        },
        {
            text: `I may not have a direct answer, but our team definitely does! You can reach us by WhatsApp or phone:`,
            chips: ['WhatsApp Us', 'Contact Info', 'Send an Email'],
        },
        {
            text: `Still stumped! Why not speak directly to our admissions team? They're super helpful. 😊`,
            chips: ['Speak to a Human', 'WhatsApp Us', 'Book a Session'],
        },
    ];

    /* ══════════════════════════════════════════
       HELPERS
    ══════════════════════════════════════════ */
    function courseCard(c) {
        return {
            text: `${c.key === 'super' ? '🔥' : c.key === 'intensive' ? '⚡' : '📖'} **${c.name} Course**\n\n⏱ **Duration:** ${c.duration}\n📖 **Hours/Week:** ${c.hours}\n👥 **Class Size:** ${c.size}\n🗓 **Schedule:** ${c.schedule}\n💳 **Fee:** GH₵ ${c.price.toLocaleString()}\n✅ **Certificate included**\n\n**Best for:** ${c.ideal}`,
            link: `booking.html?course=${c.key}`,
            linkText: `Book ${c.name} Course`,
            chips: ['Calculate Fees', 'Other Courses', 'Languages Offered'],
        };
    }

    function faqAnswer(question) {
        const item = KB.faq.find(f => f.q === question);
        return {
            text: item ? `💡 **${item.q}**\n\n${item.a}` : `I couldn't find that answer — please contact us directly!`,
            chips: ['More FAQs', 'Contact Us', 'Book a Session'],
        };
    }

    function handoff() {
        return {
            text: `👨‍💼 **Talk to Our Team Directly**\n\nI'll connect you to a real person right away!\n\n📞 **Call:** ${KB.contact.phone1}\n📞 **Call:** ${KB.contact.phone2}\n💬 **WhatsApp:** Tap below\n📧 **Email:** ${KB.contact.email}\n\nOffice Hours: ${KB.contact.hours}`,
            link: `https://wa.me/${KB.contact.whatsapp}?text=Hi%20GLI%2C%20I%27d%20like%20to%20speak%20with%20someone`,
            linkText: '💬 Open WhatsApp Chat',
            chips: ['Send an Email', 'Contact Info', 'Book a Session'],
        };
    }

    /* ══════════════════════════════════════════
       QUIZ WIZARD
    ══════════════════════════════════════════ */
    const QUIZ_STEPS = [
        {
            q: '⏳ How much time can you dedicate per week?',
            chips: ['20+ hours (full time)', '10–15 hours', 'Under 10 hours'],
            key: 'time',
        },
        {
            q: '🎯 Why are you learning a new language?',
            chips: ['Career / Business', 'Travel / Relocation', 'Personal interest', 'University / Exam'],
            key: 'goal',
        },
        {
            q: '📅 How quickly do you need results?',
            chips: ['ASAP — within 2 months', '3–4 months', 'No rush — 5+ months'],
            key: 'timeline',
        },
    ];

    function startQuiz() {
        STATE.quiz = { step: 0, answers: {} };
        return {
            text: `🎓 **Course Finder Quiz**\n\nI'll ask you 3 quick questions to recommend the perfect course!\n\n${QUIZ_STEPS[0].q}`,
            chips: QUIZ_STEPS[0].chips,
        };
    }

    function progressQuiz(userText) {
        const q = QUIZ_STEPS[STATE.quiz.step];
        STATE.quiz.answers[q.key] = userText;
        STATE.quiz.step++;

        if (STATE.quiz.step < QUIZ_STEPS.length) {
            const next = QUIZ_STEPS[STATE.quiz.step];
            return {
                text: `Got it! ✅\n\n${next.q}`,
                chips: next.chips,
            };
        }

        // Recommend based on answers
        const a = STATE.quiz.answers;
        let rec;
        if (a.time && a.time.includes('20')) {
            rec = KB.courses.super;
        } else if (a.time && a.time.includes('10')) {
            rec = KB.courses.intensive;
        } else {
            rec = KB.courses.normal;
        }

        STATE.quiz = null;
        return {
            text: `🎉 **Based on your answers, we recommend:**\n\n${rec.key === 'super' ? '🔥' : rec.key === 'intensive' ? '⚡' : '📖'} **${rec.name} Course** (${rec.duration})\n💳 GH₵ ${rec.price.toLocaleString()} · ${rec.hours}\n\n${rec.ideal}`,
            link: `booking.html?course=${rec.key}`,
            linkText: `Book ${rec.name} Now`,
            chips: ['See All Courses', 'Calculate Fees', 'Ask Another Question'],
        };
    }

    /* ══════════════════════════════════════════
       FEE CALCULATOR
    ══════════════════════════════════════════ */
    const FEE_STEPS = [
        {
            q: '💳 **Fee Calculator**\n\nWhich course are you interested in?',
            chips: ['Super Intensive (GH₵ 3,300)', 'Intensive (GH₵ 3,600)', 'Normal (GH₵ 4,000)'],
            key: 'course',
        },
        {
            q: 'How many students? (Group discounts apply for 3+)',
            chips: ['Just me (1)', '2 people', '3+ people (10% off)'],
            key: 'students',
        },
    ];

    function startFeeCalc() {
        STATE.feeCalc = { step: 0, answers: {} };
        return {
            text: FEE_STEPS[0].q,
            chips: FEE_STEPS[0].chips,
        };
    }

    function progressFeeCalc(userText) {
        const step = FEE_STEPS[STATE.feeCalc.step];
        STATE.feeCalc.answers[step.key] = userText;
        STATE.feeCalc.step++;

        if (STATE.feeCalc.step < FEE_STEPS.length) {
            const next = FEE_STEPS[STATE.feeCalc.step];
            return { text: next.q, chips: next.chips };
        }

        // Compute total
        const a = STATE.feeCalc.answers;
        let base = 3300;
        if (a.course && a.course.includes('Intensive (')) base = 3600;
        if (a.course && a.course.includes('Normal')) base = 4000;

        const count = a.students && a.students.includes('3+') ? 3 : (a.students && a.students.includes('2') ? 2 : 1);
        const discount = count >= 3 ? 0.10 : 0;
        const perPerson = Math.round(base * (1 - discount));
        const total = perPerson * count;
        const reg = 50;

        STATE.feeCalc = null;
        return {
            text: `💰 **Fee Estimate:**\n\n📚 Course: GH₵ ${perPerson.toLocaleString()} pp${discount ? ' *(10% group discount applied!)*' : ''}\n📋 Registration: GH₵ ${reg}\n👥 Students: ${count}\n\n💳 **Total: GH₵ ${(total + reg).toLocaleString()}**\n\nInstallment plans available — pay across 2–3 months!`,
            link: 'payment.html',
            linkText: '💳 Proceed to Payment',
            chips: ['Book a Session', 'Contact for Custom Quote', 'Payment Options'],
        };
    }

    /* ══════════════════════════════════════════
       INTENT PROCESSOR
    ══════════════════════════════════════════ */
    function processIntent(raw) {
        const text = raw.toLowerCase().trim();

        // Active quiz
        if (STATE.quiz !== null) return progressQuiz(raw);

        // Active fee calc
        if (STATE.feeCalc !== null) return progressFeeCalc(raw);

        // FAQ shortcut — check chip-triggered FAQ questions
        const faqItem = KB.faq.find(f => text.includes(f.q.toLowerCase().slice(0, 15)));
        if (faqItem) return { text: `💡 **${faqItem.q}**\n\n${faqItem.a}`, chips: ['More FAQs', 'Contact Us'] };

        // Intent matching
        for (const intent of INTENTS) {
            if (intent.patterns.some(p => text.includes(p))) {
                STATE.context.push(intent.id);
                if (STATE.context.length > 5) STATE.context.shift();
                return intent.handler();
            }
        }

        // Fallback with context hint
        const fb = FALLBACKS[STATE.fbIndex % FALLBACKS.length];
        STATE.fbIndex++;
        return fb;
    }

    /* ══════════════════════════════════════════
       STYLES (injected once)
    ══════════════════════════════════════════ */
    function injectStyles() {
        if (document.getElementById('gliChatStyles')) return;
        const s = document.createElement('style');
        s.id = 'gliChatStyles';
        s.textContent = `
            /* Trigger button */
            .chatbot-trigger {
                position: fixed; bottom: 30px; right: 30px;
                width: 62px; height: 62px;
                background: linear-gradient(135deg, #FFD700, #FFC300);
                border: none; border-radius: 50%; cursor: pointer;
                z-index: 1001;
                box-shadow: 0 4px 20px rgba(255,215,0,.5), 0 2px 8px rgba(0,0,0,.2);
                transition: all .3s cubic-bezier(.175,.885,.32,1.275);
                display: flex; align-items: center; justify-content: center;
                font-size: 1.5rem; color: #000;
            }
            .chatbot-trigger:hover { transform: scale(1.12) translateY(-3px); }
            .chatbot-trigger.is-open { background: linear-gradient(135deg,#111,#333); color: #FFD700; }
            /* Badge */
            .chat-badge {
                position: absolute; top: -4px; right: -4px;
                width: 20px; height: 20px; background: #e53935;
                color: #fff; border-radius: 50%; font-size: 11px; font-weight: 700;
                display: flex; align-items: center; justify-content: center;
                border: 2px solid #fff; animation: badgePop .4s ease;
            }
            @keyframes badgePop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
            /* Window */
            #gliChatWindow {
                position: fixed; bottom: 106px; right: 30px;
                width: 390px; max-height: 600px;
                background: #fff; border-radius: 22px;
                box-shadow: 0 16px 56px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.1);
                display: flex; flex-direction: column; z-index: 1000; overflow: hidden;
                transform: scale(.92) translateY(20px); opacity: 0;
                transition: all .3s cubic-bezier(.175,.885,.32,1.275); pointer-events: none;
            }
            #gliChatWindow.is-visible { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
            /* Header */
            .chat-header {
                background: linear-gradient(135deg,#111 0%,#000 100%);
                padding: 14px 18px; display: flex; align-items: center; gap: 12px; flex-shrink: 0;
            }
            .chat-avatar {
                width: 44px; height: 44px; background: linear-gradient(135deg,#FFD700,#FFC300);
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                font-size: 1.3rem; flex-shrink: 0;
            }
            .chat-header-info { flex: 1; overflow: hidden; }
            .chat-header-name { color: #fff; font-weight: 700; font-size: .95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .chat-status { display: flex; align-items: center; gap: 5px; font-size: .7rem; color: rgba(255,255,255,.55); margin-top: 2px; }
            .status-dot { width: 7px; height: 7px; background: #4caf50; border-radius: 50%; animation: blink 2s infinite; }
            @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.35} }
            .chat-header-actions { display: flex; gap: 6px; }
            .chat-icon-btn {
                background: rgba(255,255,255,.1); border: none; color: rgba(255,255,255,.7);
                width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 1rem;
                display: flex; align-items: center; justify-content: center; transition: all .2s;
            }
            .chat-icon-btn:hover { background: rgba(255,255,255,.2); color: #fff; }
            /* Quick topics bar */
            .chat-topics {
                background: #fafafa; border-bottom: 1px solid #f0f0f0;
                padding: 8px 12px; display: flex; gap: 6px; overflow-x: auto; flex-shrink: 0;
                scrollbar-width: none;
            }
            .chat-topics::-webkit-scrollbar { display: none; }
            .topic-chip {
                background: #fff; border: 1.5px solid #e8e8e8; color: #444;
                padding: 4px 11px; border-radius: 20px; font-size: .72rem; font-weight: 600;
                cursor: pointer; transition: all .2s; white-space: nowrap; flex-shrink: 0;
            }
            .topic-chip:hover { border-color: #FFD700; color: #7a5c00; background: rgba(255,215,0,.07); }
            /* Messages */
            #gliChatMessages {
                flex: 1; overflow-y: auto; padding: 14px; background: #f7f7f8;
                display: flex; flex-direction: column; gap: 10px; scroll-behavior: smooth;
            }
            #gliChatMessages::-webkit-scrollbar { width: 4px; }
            #gliChatMessages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
            .msg-bot-wrap { display: flex; align-items: flex-end; gap: 8px; animation: msgIn .3s ease; }
            .msg-user-wrap { display: flex; justify-content: flex-end; animation: msgIn .3s ease; }
            @keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
            .msg-bot-avatar {
                width: 28px; height: 28px; background: linear-gradient(135deg,#FFD700,#FFC300);
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                font-size: .78rem; flex-shrink: 0; margin-bottom: 2px;
            }
            .msg-bot {
                background: #fff; color: #1a1a1a; padding: 11px 14px;
                border-radius: 16px 16px 16px 4px; max-width: 84%;
                font-size: .87rem; line-height: 1.62;
                box-shadow: 0 2px 8px rgba(0,0,0,.06); border: 1px solid rgba(0,0,0,.04);
                white-space: pre-line;
            }
            .msg-bot strong { font-weight: 700; color: #000; }
            .msg-user {
                background: linear-gradient(135deg,#FFD700,#FFC300); color: #000;
                padding: 10px 14px; border-radius: 16px 16px 4px 16px;
                max-width: 80%; font-size: .87rem; line-height: 1.5; font-weight: 500;
                box-shadow: 0 2px 8px rgba(255,215,0,.25);
            }
            /* Typing */
            .typing-indicator { display: flex; align-items: flex-end; gap: 8px; animation: msgIn .3s ease; }
            .typing-dots {
                background: #fff; padding: 12px 16px; border-radius: 16px 16px 16px 4px;
                display: flex; gap: 4px; box-shadow: 0 2px 8px rgba(0,0,0,.06);
            }
            .typing-dots span {
                width: 7px; height: 7px; background: #bbb; border-radius: 50%;
                animation: bounce 1.2s infinite;
            }
            .typing-dots span:nth-child(2){animation-delay:.2s}
            .typing-dots span:nth-child(3){animation-delay:.4s}
            @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-7px)} }
            /* Chips */
            .chips-wrap { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
            .chip {
                background: rgba(255,215,0,.1); border: 1.5px solid rgba(255,215,0,.45);
                color: #7a5c00; padding: 5px 12px; border-radius: 20px;
                font-size: .77rem; font-weight: 600; cursor: pointer; transition: all .2s; white-space: nowrap;
            }
            .chip:hover { background: #FFD700; border-color: #FFD700; color: #000; transform: translateY(-1px); }
            /* Action link */
            .msg-action-btn {
                display: inline-block; margin-top: 10px;
                background: linear-gradient(135deg,#FFD700,#FFC300); color: #000;
                padding: 7px 15px; border-radius: 8px; font-size: .79rem; font-weight: 700;
                text-decoration: none; box-shadow: 0 2px 8px rgba(255,215,0,.3); transition: all .2s;
            }
            .msg-action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(255,215,0,.45); }
            /* Date separator */
            .chat-date-sep {
                text-align: center; font-size: .68rem; color: #aaa; font-weight: 600;
                letter-spacing: .5px; text-transform: uppercase;
            }
            /* Search bar */
            #gliSearchBar {
                width: 100%; padding: 8px 12px; border: 1.5px solid #eee;
                border-radius: 8px; font-size: .84rem; outline: none; margin-bottom: 8px;
                display: none; transition: border-color .2s;
            }
            #gliSearchBar:focus { border-color: #FFD700; }
            /* Input */
            .chat-input-area { background: #fff; border-top: 1px solid #f0f0f0; padding: 10px 13px; flex-shrink: 0; }
            .chat-input-row { display: flex; gap: 8px; align-items: center; }
            #gliChatInput {
                flex: 1; padding: 10px 14px; border: 2px solid #f0f0f0;
                border-radius: 24px; font-family: inherit; font-size: .87rem; outline: none;
                transition: border-color .2s; background: #fafafa; color: #1a1a1a;
            }
            #gliChatInput:focus { border-color: #FFD700; background: #fff; box-shadow: 0 0 0 3px rgba(255,215,0,.1); }
            #gliSendBtn {
                width: 40px; height: 40px;
                background: linear-gradient(135deg,#FFD700,#FFC300); border: none; border-radius: 50%;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: all .2s; box-shadow: 0 2px 8px rgba(255,215,0,.35); flex-shrink: 0; color: #000; font-size: .95rem;
            }
            #gliSendBtn:hover { transform: scale(1.1); }
            #gliSendBtn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
            .chat-footer-note { text-align: center; font-size: .67rem; color: #bbb; margin-top: 5px; }
            /* Responsive */
            @media (max-width: 480px) {
                #gliChatWindow { width: calc(100vw - 20px); right: 10px; bottom: 90px; max-height: 75vh; }
                .chatbot-trigger { right: 14px; bottom: 14px; width: 54px; height: 54px; font-size: 1.3rem; }
            }
            /* Dark-mode aware (chat stays light inside) */
            [data-theme="light"] #gliChatWindow { box-shadow: 0 16px 56px rgba(0,0,0,.12); }
        `;
        document.head.appendChild(s);
    }

    /* ══════════════════════════════════════════
       BUILD UI
    ══════════════════════════════════════════ */
    let chatMessages, chatInput;

    function buildUI() {
        const win = document.createElement('div');
        win.id = 'gliChatWindow';
        win.setAttribute('role', 'dialog');
        win.setAttribute('aria-label', 'GLI Chat Assistant');
        win.innerHTML = `
            <div class="chat-header">
                <div class="chat-avatar">🎓</div>
                <div class="chat-header-info">
                    <div class="chat-header-name">GLI Assistant</div>
                    <div class="chat-status">
                        <div class="status-dot"></div>
                        <span>Online · Gutenberg Languages Institute</span>
                    </div>
                </div>
                <div class="chat-header-actions">
                    <button class="chat-icon-btn" id="gliSearchToggle" title="Search conversation" aria-label="Search">
                        <i class="fas fa-search"></i>
                    </button>
                    <button class="chat-icon-btn" id="gliClearBtn" title="Clear chat" aria-label="Clear chat">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="chat-icon-btn" id="gliCloseBtn" aria-label="Close chat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="chat-topics" id="gliTopics">
                <button class="topic-chip" data-q="Browse Courses">📚 Courses</button>
                <button class="topic-chip" data-q="Calculate Fees">💳 Fees</button>
                <button class="topic-chip" data-q="Find My Course">🎯 Find Course</button>
                <button class="topic-chip" data-q="Languages Offered">🌍 Languages</button>
                <button class="topic-chip" data-q="Book a Session">📅 Book</button>
                <button class="topic-chip" data-q="WhatsApp Us">💬 WhatsApp</button>
                <button class="topic-chip" data-q="Contact Info">📞 Contact</button>
                <button class="topic-chip" data-q="FAQ">❓ FAQ</button>
            </div>
            <div id="gliChatMessages" role="log" aria-live="polite"></div>
            <div class="chat-input-area">
                <input type="text" id="gliSearchBar" placeholder="Search this conversation…" aria-label="Search chat">
                <div class="chat-input-row">
                    <input type="text" id="gliChatInput" placeholder="Ask me anything…" autocomplete="off" maxlength="300" aria-label="Type your message">
                    <button id="gliSendBtn" aria-label="Send message"><i class="fas fa-paper-plane"></i></button>
                </div>
                <div class="chat-footer-note">GLI Assistant v3 · Accra, Ghana 🇬🇭</div>
            </div>
        `;
        document.body.appendChild(win);

        chatMessages = document.getElementById('gliChatMessages');
        chatInput = document.getElementById('gliChatInput');

        document.getElementById('gliCloseBtn').addEventListener('click', toggleChat);
        document.getElementById('gliSendBtn').addEventListener('click', handleSend);
        chatInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });

        document.getElementById('gliClearBtn').addEventListener('click', () => {
            if (confirm('Clear this conversation?')) {
                chatMessages.innerHTML = '';
                STATE.msgCount = 0;
                STATE.context = [];
                STATE.quiz = null;
                STATE.feeCalc = null;
                try { sessionStorage.removeItem(STATE.sessionKey); } catch (e) { }
                sendBotMsg(`Chat cleared! 👋 How can I help you?`, null, null, ['Browse Courses', 'Book a Session', 'Contact Us']);
            }
        });

        const searchBar = document.getElementById('gliSearchBar');
        document.getElementById('gliSearchToggle').addEventListener('click', () => {
            const visible = searchBar.style.display === 'block';
            searchBar.style.display = visible ? 'none' : 'block';
            if (!visible) searchBar.focus();
        });
        searchBar.addEventListener('input', e => highlightSearch(e.target.value));

        // Topic chips
        document.getElementById('gliTopics').querySelectorAll('.topic-chip').forEach(btn => {
            btn.addEventListener('click', () => chipClicked(btn.dataset.q));
        });
    }

    /* ══════════════════════════════════════════
       SEARCH
    ══════════════════════════════════════════ */
    function highlightSearch(term) {
        document.querySelectorAll('.msg-bot, .msg-user').forEach(el => {
            el.style.opacity = (!term || el.textContent.toLowerCase().includes(term.toLowerCase())) ? '1' : '0.25';
        });
    }

    /* ══════════════════════════════════════════
       TOGGLE CHAT
    ══════════════════════════════════════════ */
    function toggleChat() {
        STATE.open = !STATE.open;
        const win = document.getElementById('gliChatWindow');
        const trigger = document.getElementById('chatbotTrigger');
        if (!win || !trigger) return;

        if (STATE.open) {
            win.classList.add('is-visible');
            trigger.classList.add('is-open');
            trigger.innerHTML = '<i class="fas fa-times"></i>';
            trigger.querySelector('.chat-badge')?.remove();
            if (STATE.msgCount === 0) {
                setTimeout(() => {
                    addDateSep('Today');
                    sendBotMsg(
                        `👋 Hi! Welcome to **Gutenberg Languages Institute**!\n\nI'm your virtual assistant — here to help you explore our courses, fees, languages, and more.\n\n*Ask me anything or tap a topic above!*`,
                        null, null,
                        ['Browse Courses', 'Calculate Fees', 'Find My Course', 'Contact Us']
                    );
                }, 350);
            }
            setTimeout(() => chatInput.focus(), 400);
        } else {
            win.classList.remove('is-visible');
            trigger.classList.remove('is-open');
            trigger.innerHTML = '<i class="fas fa-comments"></i>';
        }
    }

    /* ══════════════════════════════════════════
       HANDLE SEND
    ══════════════════════════════════════════ */
    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = '';
        addUserBubble(text);
        showTyping();
        setTimeout(() => {
            removeTyping();
            const r = processIntent(text);
            sendBotMsg(r.text, r.link, r.linkText, r.chips);
        }, 600 + Math.random() * 500);
    }

    const CHIP_QUERIES = {
        'Browse Courses': 'course',
        'Book a Session': 'book',
        'Calculate Fees': 'calculate fees',
        'Find My Course': 'find my course',
        'Languages Offered': 'languages',
        'Super Intensive': 'super intensive',
        'Intensive Course': 'intensive course',
        'Normal Course': 'normal course',
        'Other Courses': 'course',
        'See All Courses': 'course',
        'Payment Options': 'payment',
        'Contact for Plan': 'contact',
        'Contact Info': 'contact',
        'Contact Us': 'contact',
        'Contact for Custom Quote': 'contact',
        'WhatsApp Us': 'whatsapp',
        'Send an Email': 'send email',
        'Book a Visit': 'contact',
        'Our Levels': 'levels',
        'Get Placement Test': 'placement test',
        'More FAQs': 'faq',
        'FAQ': 'faq',
        'Our Certificates': 'certificate',
        'Ask Another Question': '',
        'Speak to a Human': 'speak to human',
        'Call Us': 'contact',
        'Contact Form': 'contact',
    };

    function chipClicked(label) {
        const query = CHIP_QUERIES[label] !== undefined ? CHIP_QUERIES[label] : label.toLowerCase();
        addUserBubble(label);
        showTyping();
        setTimeout(() => {
            removeTyping();
            if (!query) {
                sendBotMsg('Sure, go ahead — what would you like to know?', null, null, ['Browse Courses', 'Contact Us']);
            } else {
                const r = processIntent(query);
                sendBotMsg(r.text, r.link, r.linkText, r.chips);
            }
        }, 400 + Math.random() * 300);
    }

    /* ══════════════════════════════════════════
       DOM HELPERS
    ══════════════════════════════════════════ */
    function addUserBubble(text) {
        STATE.msgCount++;
        const w = document.createElement('div');
        w.className = 'msg-user-wrap';
        w.innerHTML = `<div class="msg-user">${esc(text)}</div>`;
        chatMessages.appendChild(w);
        scrollBot();
    }

    function sendBotMsg(text, link, linkText, chips) {
        STATE.msgCount++;
        const w = document.createElement('div');
        w.className = 'msg-bot-wrap';

        let inner = `<div class="msg-bot">${fmt(text)}`;
        if (link && linkText) {
            const rel = link.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
            inner += `<br><a href="${link}" class="msg-action-btn"${rel}>${esc(linkText)} →</a>`;
        }
        inner += `</div>`;

        w.innerHTML = `<div class="msg-bot-avatar">🎓</div>${inner}`;
        chatMessages.appendChild(w);

        if (chips && chips.length) {
            const cw = document.createElement('div');
            cw.className = 'chips-wrap';
            cw.style.paddingLeft = '36px';
            chips.forEach(chip => {
                const btn = document.createElement('button');
                btn.className = 'chip';
                btn.textContent = chip;
                btn.addEventListener('click', () => chipClicked(chip));
                cw.appendChild(btn);
            });
            chatMessages.appendChild(cw);
        }
        scrollBot();
    }

    function addDateSep(label) {
        const el = document.createElement('div');
        el.className = 'chat-date-sep';
        el.textContent = label;
        chatMessages.appendChild(el);
    }

    function showTyping() {
        const el = document.createElement('div');
        el.className = 'typing-indicator'; el.id = 'gliTyping';
        el.innerHTML = `<div class="msg-bot-avatar">🎓</div><div class="typing-dots"><span></span><span></span><span></span></div>`;
        chatMessages.appendChild(el);
        scrollBot();
    }

    function removeTyping() {
        document.getElementById('gliTyping')?.remove();
    }

    function scrollBot() { chatMessages.scrollTop = chatMessages.scrollHeight; }

    function fmt(text) {
        return esc(text)
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    function esc(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* ══════════════════════════════════════════
       NOTIFICATION BADGE
    ══════════════════════════════════════════ */
    function showProactiveBadge() {
        const trigger = document.getElementById('chatbotTrigger');
        if (!trigger || STATE.open) return;
        const badge = document.createElement('div');
        badge.className = 'chat-badge';
        badge.textContent = '1';
        trigger.appendChild(badge);
    }

    /* ══════════════════════════════════════════
       INIT
    ══════════════════════════════════════════ */
    function init() {
        injectStyles();
        buildUI();

        const trigger = document.getElementById('chatbotTrigger');
        if (trigger) {
            trigger.innerHTML = '<i class="fas fa-comments"></i>';
            trigger.addEventListener('click', toggleChat);
            // Proactive badge after 4 seconds
            setTimeout(showProactiveBadge, 4000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
