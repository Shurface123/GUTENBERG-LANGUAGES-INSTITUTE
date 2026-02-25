// ============================================
// GUTENBERG LANGUAGES INSTITUTE — MAIN JS
// Theme: dark (default) / light (toggled)
// Security: Honeypot, sanitization, rate-limit
// ============================================

(function () {
    'use strict';

    // ── FOUC Prevention (theme applied BEFORE paint) ──
    const THEME_KEY = 'gli-theme';
    const root = document.documentElement;

    function getStoredTheme() {
        try {
            const s = localStorage.getItem(THEME_KEY);
            if (s === 'light' || s === 'dark') return s;
            // Map legacy keys
            if (s === 'accessible-light') return 'light';
            if (s === 'brand') return 'dark';
        } catch (e) { }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
        return 'dark';
    }

    function applyTheme(mode, persist) {
        const m = (mode === 'light') ? 'light' : 'dark';
        if (m === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }
        if (persist !== false) {
            try { localStorage.setItem(THEME_KEY, m); } catch (e) { }
        }
        updateToggleBtn(m);
    }

    let toggleBtn = null;
    function updateToggleBtn(mode) {
        if (!toggleBtn) return;
        const iconEl = toggleBtn.querySelector('.ttb-icon');
        const labelEl = toggleBtn.querySelector('.ttb-label');
        if (mode === 'light') {
            if (iconEl) iconEl.className = 'ttb-icon fas fa-moon';
            if (labelEl) labelEl.textContent = 'Dark';
            toggleBtn.setAttribute('aria-pressed', 'false');
            toggleBtn.setAttribute('aria-label', 'Switch to dark theme');
        } else {
            if (iconEl) iconEl.className = 'ttb-icon fas fa-sun';
            if (labelEl) labelEl.textContent = 'Light';
            toggleBtn.setAttribute('aria-pressed', 'true');
            toggleBtn.setAttribute('aria-label', 'Switch to light theme');
        }
    }

    // Apply theme immediately (prevents FOUC)
    applyTheme(getStoredTheme(), false);

    // ── DOM Ready ──
    document.addEventListener('DOMContentLoaded', function () {

        // ── NAVBAR elements ──
        const navbar = document.getElementById('navbar');
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');

        // ── NAVBAR SCROLL ──
        if (navbar) {
            window.addEventListener('scroll', function () {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            }, { passive: true });
        }

        // ── MOBILE NAV — overlay backdrop, scroll lock, slide-from-right ──
        let overlay = document.getElementById('navOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'navOverlay';
            overlay.className = 'nav-overlay';
            document.body.appendChild(overlay);
        }

        function openNav() {
            if (!navMenu) return;
            navMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('nav-open');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'true');
                const spans = menuToggle.querySelectorAll('span');
                if (spans[0]) spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                if (spans[1]) spans[1].style.opacity = '0';
                if (spans[2]) spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            }
        }

        function closeNav() {
            if (!navMenu) return;
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('nav-open');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.querySelectorAll('span').forEach(function (s) {
                    s.style.transform = '';
                    s.style.opacity = '';
                });
            }
        }

        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', function () {
                navMenu.classList.contains('active') ? closeNav() : openNav();
            });

            // Close on nav link / CTA click
            navMenu.querySelectorAll('.nav-link, .nav-cta').forEach(function (link) {
                link.addEventListener('click', closeNav);
            });

            // Close on overlay click
            overlay.addEventListener('click', closeNav);

            // Close on Escape key
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') closeNav();
            });
        }

        // ── THEME TOGGLE — desktop: inside nav-container; mobile: inside drawer ──
        const navContainer = document.querySelector('.nav-container');

        // Build the shared toggle button
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'themeToggle';
        btn.className = 'theme-toggle-nav';
        btn.innerHTML = '<i class="ttb-icon fas fa-sun"></i><span class="ttb-label">Light</span>';
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', 'Switch to light theme');
        toggleBtn = btn;

        btn.addEventListener('click', function () {
            const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            applyTheme(current === 'light' ? 'dark' : 'light', true);
        });

        // Always append to desktop nav-container (CSS hides it on mobile)
        if (navContainer) {
            navContainer.appendChild(btn);
        }

        // Build a mirrored button for the mobile drawer .nav-theme-slot
        if (navMenu) {
            const mobileSlot = document.createElement('li');
            mobileSlot.className = 'nav-theme-slot';

            const mobileBtn = document.createElement('button');
            mobileBtn.type = 'button';
            mobileBtn.className = 'theme-toggle-nav';
            mobileBtn.innerHTML = '<i class="ttb-icon-m fas fa-sun"></i><span class="ttb-label-m">Light Mode</span>';
            mobileBtn.setAttribute('aria-label', 'Toggle theme');
            mobileSlot.appendChild(mobileBtn);
            navMenu.appendChild(mobileSlot);

            // Sync mobile button label
            function syncMobileBtn(mode) {
                const icon = mobileBtn.querySelector('.ttb-icon-m');
                const label = mobileBtn.querySelector('.ttb-label-m');
                if (mode === 'light') {
                    if (icon) icon.className = 'ttb-icon-m fas fa-moon';
                    if (label) label.textContent = 'Dark Mode';
                } else {
                    if (icon) icon.className = 'ttb-icon-m fas fa-sun';
                    if (label) label.textContent = 'Light Mode';
                }
            }

            mobileBtn.addEventListener('click', function () {
                const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
                const next = current === 'light' ? 'dark' : 'light';
                applyTheme(next, true);
                syncMobileBtn(next);
            });

            syncMobileBtn(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
        }

        // Sync desktop toggle label with current theme
        updateToggleBtn(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

        // ── SECURITY: noopener for external links ──
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            const rel = (link.getAttribute('rel') || '').split(' ').filter(Boolean);
            if (!rel.includes('noopener')) rel.push('noopener');
            if (!rel.includes('noreferrer')) rel.push('noreferrer');
            link.setAttribute('rel', rel.join(' '));
        });

        // ── SMOOTH SCROLLING ──
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
                        window.scrollTo({ top: offset, behavior: 'smooth' });
                    }
                }
            });
        });

        // ── INPUT SANITIZATION ──
        function sanitize(str) {
            if (typeof str !== 'string') return '';
            return str
                .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
                .replace(/<[^>]+>/g, '')
                .replace(/javascript\s*:/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .trim();
        }

        // ── HONEYPOT INJECTION ──
        function injectHoneypot(form) {
            if (form.querySelector('.hp-wrap')) return;
            const wrap = document.createElement('div');
            wrap.className = 'hp-wrap hp-field';
            wrap.setAttribute('aria-hidden', 'true');
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.name = 'website_url';   // bots fill this
            inp.tabIndex = -1;
            inp.autocomplete = 'off';
            wrap.appendChild(inp);
            form.appendChild(wrap);
        }

        // ── FORM SECURITY & VALIDATION ──
        const cooldownMap = new WeakMap();

        document.querySelectorAll('form').forEach(form => {
            injectHoneypot(form);

            form.addEventListener('submit', function (e) {
                // Honeypot check
                const hp = form.querySelector('input[name="website_url"]');
                if (hp && hp.value.trim() !== '') {
                    e.preventDefault();
                    return; // Silently drop — bots don't get feedback
                }

                // Rate limit: 10 s
                const submitBtn = form.querySelector('[type="submit"]');
                if (submitBtn) {
                    const lastClick = cooldownMap.get(submitBtn) || 0;
                    if (Date.now() - lastClick < 10000) {
                        e.preventDefault();
                        const remaining = Math.ceil((10000 - (Date.now() - lastClick)) / 1000);
                        showToast(`Please wait ${remaining}s before resubmitting.`, 'warn');
                        return;
                    }
                }

                // Required field check
                let isValid = true;
                form.querySelectorAll('[required]').forEach(field => {
                    const val = field.value.trim();
                    if (!val) {
                        isValid = false;
                        field.classList.add('input-error');
                        field.setAttribute('aria-invalid', 'true');
                    } else {
                        field.classList.remove('input-error');
                        field.removeAttribute('aria-invalid');
                    }
                });

                // Sanitize inputs (XSS prevention)
                form.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(field => {
                    if (field.name === 'website_url') return;
                    const clean = sanitize(field.value);
                    if (clean !== field.value) field.value = clean;
                });

                if (!isValid) {
                    e.preventDefault();
                    const firstError = form.querySelector('.input-error');
                    if (firstError) firstError.focus();
                    showToast('Please fill in all required fields.', 'error');
                    return;
                }

                // Start cooldown
                if (submitBtn) {
                    cooldownMap.set(submitBtn, Date.now());
                    submitBtn.disabled = true;
                    submitBtn._origText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…';
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = submitBtn._origText || 'Submit';
                    }, 10000);
                }
            });

            // Remove error style on input
            form.querySelectorAll('input, select, textarea').forEach(field => {
                field.addEventListener('input', () => {
                    field.classList.remove('input-error');
                    field.removeAttribute('aria-invalid');
                });
            });
        });

        // ── INTERNATIONAL PHONE INPUT ──
        const COUNTRIES = [
            { code: '+233', iso: 'GH', flag: '🇬🇭', name: 'Ghana' },
            { code: '+234', iso: 'NG', flag: '🇳🇬', name: 'Nigeria' },
            { code: '+44', iso: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
            { code: '+1', iso: 'US', flag: '🇺🇸', name: 'USA / Canada' },
            { code: '+49', iso: 'DE', flag: '🇩🇪', name: 'Germany' },
            { code: '+33', iso: 'FR', flag: '🇫🇷', name: 'France' },
            { code: '+34', iso: 'ES', flag: '🇪🇸', name: 'Spain' },
            { code: '+39', iso: 'IT', flag: '🇮🇹', name: 'Italy' },
            { code: '+31', iso: 'NL', flag: '🇳🇱', name: 'Netherlands' },
            { code: '+32', iso: 'BE', flag: '🇧🇪', name: 'Belgium' },
            { code: '+41', iso: 'CH', flag: '🇨🇭', name: 'Switzerland' },
            { code: '+43', iso: 'AT', flag: '🇦🇹', name: 'Austria' },
            { code: '+46', iso: 'SE', flag: '🇸🇪', name: 'Sweden' },
            { code: '+47', iso: 'NO', flag: '🇳🇴', name: 'Norway' },
            { code: '+45', iso: 'DK', flag: '🇩🇰', name: 'Denmark' },
            { code: '+358', iso: 'FI', flag: '🇫🇮', name: 'Finland' },
            { code: '+27', iso: 'ZA', flag: '🇿🇦', name: 'South Africa' },
            { code: '+254', iso: 'KE', flag: '🇰🇪', name: 'Kenya' },
            { code: '+256', iso: 'UG', flag: '🇺🇬', name: 'Uganda' },
            { code: '+255', iso: 'TZ', flag: '🇹🇿', name: 'Tanzania' },
            { code: '+221', iso: 'SN', flag: '🇸🇳', name: 'Senegal' },
            { code: '+225', iso: 'CI', flag: '🇨🇮', name: "Côte d'Ivoire" },
            { code: '+237', iso: 'CM', flag: '🇨🇲', name: 'Cameroon' },
            { code: '+213', iso: 'DZ', flag: '🇩🇿', name: 'Algeria' },
            { code: '+20', iso: 'EG', flag: '🇪🇬', name: 'Egypt' },
            { code: '+212', iso: 'MA', flag: '🇲🇦', name: 'Morocco' },
            { code: '+91', iso: 'IN', flag: '🇮🇳', name: 'India' },
            { code: '+86', iso: 'CN', flag: '🇨🇳', name: 'China' },
            { code: '+81', iso: 'JP', flag: '🇯🇵', name: 'Japan' },
            { code: '+82', iso: 'KR', flag: '🇰🇷', name: 'South Korea' },
            { code: '+55', iso: 'BR', flag: '🇧🇷', name: 'Brazil' },
            { code: '+52', iso: 'MX', flag: '🇲🇽', name: 'Mexico' },
            { code: '+61', iso: 'AU', flag: '🇦🇺', name: 'Australia' },
            { code: '+64', iso: 'NZ', flag: '🇳🇿', name: 'New Zealand' },
            { code: '+971', iso: 'AE', flag: '🇦🇪', name: 'UAE' },
            { code: '+966', iso: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
        ];

        function buildPhoneSelect(defaultCode) {
            const sel = document.createElement('select');
            sel.className = 'phone-country-select';
            sel.setAttribute('aria-label', 'Country dial code');
            COUNTRIES.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.code;
                opt.textContent = `${c.flag} ${c.code}`;
                opt.title = c.name;
                if (c.code === (defaultCode || '+233')) opt.selected = true;
                sel.appendChild(opt);
            });
            return sel;
        }

        document.querySelectorAll('[data-phone-group]').forEach(group => {
            if (group.dataset.phoneEnhanced === 'true') return;
            const input = group.querySelector('input[type="tel"]');
            if (!input) return;

            const row = document.createElement('div');
            row.className = 'phone-input-row';
            const sel = buildPhoneSelect('+233');

            input.placeholder = 'e.g. 50 979 6187';
            input.parentNode.insertBefore(row, input);
            row.appendChild(sel);
            row.appendChild(input);

            // Strip any old dial-code prefix from the value on change so we don't double-apply
            sel.addEventListener('change', () => {
                let raw = input.value.replace(/^\+\d{1,4}\s*/, '').trim();
                input.value = raw;
            });

            group.dataset.phoneEnhanced = 'true';
        });

        // ── ANIMATIONS ON SCROLL ──
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in', 'visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.card,.course-card,.testimonial-card,.feature-box,.gallery-item,.reveal').forEach(el => {
            observer.observe(el);
        });

        // ── IMAGE ERROR HANDLING ──
        const logoImg = document.getElementById('logo-image');
        if (logoImg) logoImg.addEventListener('error', () => { logoImg.style.display = 'none'; });

        const partnerBadge = document.getElementById('partner-badge');
        if (partnerBadge) {
            partnerBadge.addEventListener('error', () => {
                const c = partnerBadge.parentElement;
                if (c) c.innerHTML = '<p style="padding:2rem;color:var(--text-muted);">Partner Badge</p>';
            });
        }

        // ── COURSE URL PARAMETER PRE-SELECT ──
        const courseParam = new URLSearchParams(window.location.search).get('course');
        if (courseParam) {
            const sel = document.getElementById('courseType') || document.getElementById('courseSelection');
            if (sel) sel.value = courseParam;
        }

        console.log('%c🎓 Gutenberg Languages Institute', 'color:#FFD700;font-size:20px;font-weight:bold;');
    });

    // ── GLOBAL TOAST NOTIFICATION ──
    window.showToast = function (msg, type) {
        let toast = document.getElementById('gli-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'gli-toast';
            toast.style.cssText =
                'position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(20px);' +
                'background:#111;color:#FFD700;border:1px solid rgba(255,215,0,.35);' +
                'padding:.7rem 1.5rem;border-radius:999px;font-size:.85rem;font-weight:600;' +
                'z-index:9999;opacity:0;pointer-events:none;transition:opacity .3s,transform .3s;' +
                'white-space:nowrap;max-width:90vw;text-align:center;';
            document.body.appendChild(toast);
        }
        if (type === 'error') toast.style.color = '#fc8181';
        else if (type === 'warn') toast.style.color = '#f6c90e';
        else toast.style.color = '#FFD700';

        toast.textContent = msg;
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
        }, 3500);
    };

    // ── FORM HELPER FALLBACKS ──
    if (typeof showSuccessMessage === 'undefined') {
        window.showSuccessMessage = function (id, msg) {
            const el = document.getElementById(id);
            if (el) {
                if (msg) el.innerHTML = `<strong>&#10003; Success!</strong><br>${msg}`;
                el.style.display = 'block';
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                setTimeout(() => { el.style.display = 'none'; }, 10000);
            }
        };
    }

    if (typeof showErrorMessage === 'undefined') {
        window.showErrorMessage = function (id, msg) {
            const el = document.getElementById(id);
            if (el) {
                if (msg) el.innerHTML = `<strong>&#9888; Error</strong><br>${msg}`;
                el.style.display = 'block';
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                setTimeout(() => { el.style.display = 'none'; }, 10000);
            }
        };
    }

    if (typeof showLoading === 'undefined') {
        window.showLoading = function (btn) {
            if (btn) { btn.disabled = true; btn._orig = btn.innerHTML; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…'; }
        };
    }

    if (typeof hideLoading === 'undefined') {
        window.hideLoading = function (btn, orig) {
            if (btn) { btn.disabled = false; btn.innerHTML = orig || btn._orig || 'Submit'; }
        };
    }

    // ── GLOBAL EMAIL VALIDATION ──
    window.validateEmail = function (email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

})();
