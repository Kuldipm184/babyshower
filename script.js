/* =========================================
   MASTERING MOTHERHOOD — RSVP WEBSITE
   JavaScript: Particles, Countdown, RSVP
   ========================================= */

// ---- CONFIG ----
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1Vg5gLLGnO8jWtnf9M5PQvWIiMq-kZHs7P0KYKsyPk8_jWR1p9YQybDwk_SimcPqV/exec';
const EVENT_DATE = new Date('2026-05-17T14:00:00-07:00'); // May 17, 2026 at 2:00 PM PT

// =========================================
// PARTICLES BACKGROUND
// =========================================
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        const isGold = Math.random() > 0.4;
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.8 + 0.4,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            color: isGold
                ? `rgba(201, 169, 110, ${Math.random() * 0.25 + 0.08})`
                : `rgba(232, 196, 184, ${Math.random() * 0.15 + 0.05})`
        };
    }

    function init() {
        resize();
        const count = Math.min(Math.floor(canvas.width * canvas.height / 14000), 100);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(createParticle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
        animId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animId);
        init();
        animate();
    });

    init();
    animate();
})();

// =========================================
// COUNTDOWN TIMER
// =========================================
(function initCountdown() {
    function update() {
        const now = new Date();
        const diff = EVENT_DATE - now;

        if (diff <= 0) {
            document.querySelectorAll('.countdown-value').forEach(el => el.textContent = '🎉');
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(d).padStart(2, '0');
        document.getElementById('hours').textContent = String(h).padStart(2, '0');
        document.getElementById('minutes').textContent = String(m).padStart(2, '0');
        document.getElementById('seconds').textContent = String(s).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
})();

// =========================================
// NAVBAR — Scroll & Mobile Menu
// =========================================
(function initNav() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
        });
    });
})();

// =========================================
// SCROLL REVEAL — Intersection Observer
// =========================================
(function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    // Timeline items
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 150);
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.timeline-item').forEach(el => timelineObserver.observe(el));
})();

// =========================================
// RSVP FORM SUBMISSION
// =========================================
(function initForm() {
    const form = document.getElementById('rsvp-form');
    const btn = document.getElementById('submit-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    const statusMsg = document.getElementById('status-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Toggle button state
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        btn.disabled = true;
        statusMsg.className = 'status-message hidden';

        const formData = new FormData(form);
        const urlParams = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            urlParams.append(key, value);
        }

        // Simulation mode if URL is not set
        if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
            await new Promise(r => setTimeout(r, 1500));
            console.log('[Simulation] RSVP Data:', Object.fromEntries(formData));
            statusMsg.textContent = "🎉 Simulation Mode — Set your Google Apps Script URL in script.js to go live!";
            statusMsg.className = 'status-message status-success';
            resetBtn();
            form.reset();
            return;
        }

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: urlParams,
                mode: 'no-cors'
            });
            statusMsg.textContent = "🎉 You're in! Your RSVP has been confirmed. We'll send you the details soon!";
            statusMsg.className = 'status-message status-success';
            form.reset();
        } catch (err) {
            statusMsg.textContent = "Something went wrong: " + err.message + ". Please try again.";
            statusMsg.className = 'status-message status-error';
        } finally {
            resetBtn();
        }
    });

    function resetBtn() {
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        btn.disabled = false;
    }
})();
