/* payment.js — Gutenberg Languages Institute
   Handles: wizard navigation, course/language selection, payment method switching,
   MoMo network auto-detection, card formatting, bank copy, form submission
   ------------------------------------------------------------------ */

'use strict';

/* ── Ghana MoMo prefix → network key ── */
const MOMO_PREFIX_MAP = {
    '024': 'mtn', '025': 'mtn', '053': 'mtn', '054': 'mtn',
    '055': 'mtn', '059': 'mtn',
    '020': 'telecel', '050': 'telecel',
    '027': 'airteltigo', '057': 'airteltigo',
    '026': 'airteltigo', '056': 'airteltigo',
};

const NET_LABELS = {
    mtn: { name: 'MTN Mobile Money', color: '#FFCB00', text: '#000' },
    telecel: { name: 'Telecel Cash', color: '#E30613', text: '#fff' },
    airteltigo: { name: 'AirtelTigo Money', color: '#003087', text: '#fff' },
};

/* ── Pricing ── */
const COURSES = {
    super: { label: 'Super Intensive Course', price: 3300 },
    intensive: { label: 'Intensive Course', price: 3600 },
    normal: { label: 'Normal Course', price: 4000 },
};

let state = {
    step: 1,
    course: null,
    language: null,
    payMethod: 'card',
    momoNet: 'mtn',
};

/* ════════════════════════════════════════
   WIZARD NAVIGATION
═════════════════════════════════════════ */
function goToStep(n) {
    if (n === 2 && !validateStep1()) return;
    if (n === 3 && !validateStep2()) return;
    if (n === 4 && !validateStep3()) return;

    state.step = n;

    document.querySelectorAll('.pay-panel').forEach((p, i) => {
        p.classList.toggle('active', i + 1 === n);
    });
    document.querySelectorAll('.pay-step').forEach((s, i) => {
        s.classList.toggle('active', i + 1 === n);
        s.classList.toggle('completed', i + 1 < n);
    });

    if (n === 4) buildConfirmation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Validation helpers ── */
function validateStep1() {
    if (!state.course) {
        showStepError('Please select a course.');
        return false;
    }
    if (!state.language) {
        showStepError('Please select a language.');
        return false;
    }
    return true;
}

function validateStep2() {
    const fn = g('infFirstName')?.value.trim();
    const ln = g('infLastName')?.value.trim();
    const em = g('infEmail')?.value.trim();
    const ph = g('infPhone')?.value.trim();
    const addr = g('address')?.value.trim();
    const sd = g('startDate')?.value;  // 'YYYY-MM-DD'
    const lv = g('level')?.value;

    if (!fn || !ln) { showStepError('Please enter your full name.'); return false; }
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { showStepError('Enter a valid email address.'); return false; }
    if (!ph) { showStepError('Please enter your phone number.'); return false; }
    if (!addr) { showStepError('Please enter your address.'); return false; }
    if (!sd) { showStepError('Please select a start date.'); return false; }
    if (!lv) { showStepError('Please select a proficiency level.'); return false; }

    // Timezone-safe date comparison: compare YYYY-MM-DD strings.
    // todayStr = today's local date; sd must be strictly after today.
    const todayStr = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD' in local time
    if (sd <= todayStr) {
        const err = g('startDateError');
        if (err) { err.style.display = 'block'; err.style.color = '#c00'; }
        showStepError('Please select a future date (tomorrow or later).');
        return false;
    }
    const err = g('startDateError');
    if (err) err.style.display = 'none';
    return true;
}

function validateStep3() {
    if (state.payMethod === 'momo') {
        const num = g('momoNumber')?.value.trim().replace(/\D/g, '');
        if (!num || num.length < 9) {
            showMomoError('Enter a valid Ghana MoMo number (e.g. 024 XXX XXXX).');
            return false;
        }
    } else if (state.payMethod === 'card') {
        const cn = g('cardNum')?.value.replace(/\s/g, '');
        const exp = g('cardExp')?.value.trim();
        const cvv = g('cardCvv')?.value.trim();
        if (!cn || cn.length < 13) { showStepError('Enter a valid card number.'); return false; }
        if (!exp || !/^\d{2}\s*\/\s*\d{2}$/.test(exp)) { showStepError('Enter a valid expiry date (MM / YY).'); return false; }
        if (!cvv || cvv.length < 3) { showStepError('Enter a valid CVV.'); return false; }
    }
    return true;
}

function showStepError(msg) {
    const el = document.querySelector('#step' + state.step + ' .step-error-msg') ||
        document.querySelector('.pay-panel.active .step-error-msg');
    if (el) { el.textContent = msg; el.style.display = 'block'; setTimeout(() => { el.style.display = 'none'; }, 4000); }
    else { toast(msg, 'error'); }
}

/* ════════════════════════════════════════
   COURSE SELECTION
═════════════════════════════════════════ */
function selectCourse(key) {
    state.course = key;
    document.querySelectorAll('.course-pick').forEach(el => el.classList.remove('selected'));
    const el = g('cp-' + key);
    if (el) el.classList.add('selected');
    updateSummary();
}

function selectLang(el, lang) {
    state.language = lang;
    document.querySelectorAll('.lang-chip').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    updateSummary();
}

/* ════════════════════════════════════════
   PAYMENT METHOD TABS
═════════════════════════════════════════ */
function switchPM(method, tabEl) {
    state.payMethod = method;
    document.querySelectorAll('.pm-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.pm-pane').forEach(p => p.classList.remove('active'));
    if (tabEl) tabEl.classList.add('active');
    const pane = g('pm-' + method);
    if (pane) pane.classList.add('active');
}

/* ════════════════════════════════════════
   MOMO NETWORK DETECTION
═════════════════════════════════════════ */
function detectNetwork(number) {
    const clean = number.replace(/\D/g, '');
    if (clean.length < 3) return null;
    return MOMO_PREFIX_MAP[clean.substring(0, 3)] || null;
}

function selectNetwork(netKey) {
    if (!NET_LABELS[netKey]) return;
    state.momoNet = netKey;
    document.querySelectorAll('[data-net]').forEach(el => {
        el.classList.toggle('selected', el.dataset.net === netKey);
    });
}

function initMomoDetection() {
    const input = g('momoNumber');
    if (!input) return;

    input.addEventListener('input', () => {
        const detected = detectNetwork(input.value);
        if (detected && detected !== state.momoNet) {
            selectNetwork(detected);
            const net = NET_LABELS[detected];
            toast(`Network detected: ${net.name}`, 'info');
        }
        // Clear any error
        const errEl = g('momoError');
        if (errEl) errEl.textContent = '';
    });
}

function showMomoError(msg) {
    const el = g('momoError');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
}

/* ════════════════════════════════════════
   CARD FORMATTING
═════════════════════════════════════════ */
function formatCard(input) {
    let v = input.value.replace(/\D/g, '').substring(0, 16);
    input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function formatExp(input) {
    let v = input.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 3) v = v.substring(0, 2) + ' / ' + v.substring(2);
    input.value = v;
}

/* ════════════════════════════════════════
   SUMMARY PANEL
═════════════════════════════════════════ */
function updateSummary() {
    const course = COURSES[state.course];
    const sumCourse = g('sumCourse');
    const sumLang = g('sumLang');
    const sumTotal = g('sumTotal');

    if (sumCourse) sumCourse.textContent = course ? course.label : '—';
    if (sumLang) sumLang.textContent = state.language || '—';
    if (sumTotal) sumTotal.textContent = course ? 'GH₵ ' + course.price.toLocaleString() : '—';
}

/* ════════════════════════════════════════
   STEP 4 CONFIRMATION BUILD
═════════════════════════════════════════ */
function buildConfirmation() {
    const course = COURSES[state.course] || {};
    const name = ((g('infFirstName')?.value || '') + ' ' + (g('infLastName')?.value || '')).trim();
    const rows = [
        { label: 'Name', value: name || '—' },
        { label: 'Email', value: g('infEmail')?.value?.trim() || '—' },
        { label: 'Phone', value: g('infPhone')?.value?.trim() || '—' },
        { label: 'Course', value: course.label || '—' },
        { label: 'Language', value: state.language || '—' },
        { label: 'Start Date', value: g('startDate')?.value || '—' },
        { label: 'Level', value: g('level')?.value || '—' },
        { label: 'Payment Method', value: methodLabel() || '—' },
        { label: 'Total', value: course.price ? 'GH\u20B5 ' + course.price.toLocaleString() : '—' },
    ];
    const container = g('confirmSummary');
    if (!container) return;
    container.innerHTML = rows.map(r =>
        `<div class="conf-row">
            <span class="conf-label">${r.label}</span>
            <strong class="conf-value">${r.value}</strong>
        </div>`
    ).join('');
}

function methodLabel() {
    if (state.payMethod === 'card') return 'Credit / Debit Card';
    if (state.payMethod === 'momo') return NET_LABELS[state.momoNet]?.name + ' (MoMo)';
    if (state.payMethod === 'bank') return 'Bank Transfer';
    if (state.payMethod === 'cash') return 'Cash Payment';
    return '';
}

/* ════════════════════════════════════════
   SUBMIT PAYMENT
═════════════════════════════════════════ */
/* Called by HTML: onclick="processPayment()" */
function processPayment() {
    const checkbox = g('agreeTerms');
    if (!checkbox || !checkbox.checked) {
        toast('Please agree to the payment terms to continue.', 'error');
        return;
    }
    submitPayment();
}

function submitPayment() {
    const btn = g('finalPayBtn');
    if (!btn) return;

    btn.disabled = true;
    const btnText = g('finalBtnText');
    if (btnText) btnText.textContent = 'Processing…';
    const icon = btn.querySelector('i');
    if (icon) icon.className = 'fas fa-spinner fa-spin';

    // Generate reference number
    const ref = 'GLI-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const refEl = g('successRef');
    if (refEl) refEl.textContent = ref;

    setTimeout(() => {
        btn.disabled = false;
        if (btnText) btnText.textContent = 'Complete Payment';
        if (icon) icon.className = 'fas fa-lock';
        goToStep(5);
    }, 2800);
}

function showSuccess() {
    goToStep(5);
}

/* ════════════════════════════════════════
   BANK COPY
═════════════════════════════════════════ */
function copyText(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => toast('Copied!', 'success'));
    } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        toast('Copied!', 'success');
    }
}

/* ════════════════════════════════════════
   TOAST NOTIFICATION
═════════════════════════════════════════ */
function toast(msg, type = 'info') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    const t = document.createElement('div');
    t.className = 'gli-toast gli-toast--' + type;
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    t.innerHTML = `<i class="fas fa-${icon}"></i> <span>${msg}</span>`;
    container.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 3500);
}

function createToastContainer() {
    const el = document.createElement('div');
    el.id = 'toastContainer';
    el.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;pointer-events:none;';
    document.body.appendChild(el);
    return el;
}

/* ════════════════════════════════════════
   UTILITIES
═════════════════════════════════════════ */
function g(id) { return document.getElementById(id); }

/* ════════════════════════════════════════
   INIT
═════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    // Set min date for start date input to TOMORROW (today is NOT allowed)
    const sd = g('startDate');
    if (sd) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        sd.min = tomorrow.toISOString().split('T')[0];
    }

    // Wire up MoMo network buttons (data-net attribute)
    document.querySelectorAll('[data-net]').forEach(el => {
        el.addEventListener('click', () => selectNetwork(el.dataset.net));
    });

    // MoMo auto-detection
    initMomoDetection();

    // CVV restrict to digits
    const cvv = g('cardCvv');
    if (cvv) cvv.addEventListener('input', () => { cvv.value = cvv.value.replace(/\D/g, '').substring(0, 4); });

    // Real-time start date validation
    if (sd) {
        sd.addEventListener('change', () => {
            const err = g('startDateError');
            if (!err) return;
            const todayStr = new Date().toLocaleDateString('en-CA');
            if (sd.value && sd.value <= todayStr) {
                err.style.display = 'block';
                err.style.color = '#c00';
                err.textContent = 'Please select a future date.';
            } else {
                err.style.display = 'none';
            }
        });
    }

    // Final pay button wired via onclick="processPayment()" in HTML
});
