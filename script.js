(function() {
    // DOM elements
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const backToTopBtn = document.getElementById('back-to-top');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const particleCanvas = document.getElementById('particle-canvas');
    const ctx = particleCanvas ? particleCanvas.getContext('2d') : null;
    const allNavLinks = document.querySelectorAll('.nav-link');
    const allMobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const allGalleryThumbs = document.querySelectorAll('.gallery-thumb[data-lightbox]');

    // FYP detail elements
    const fypDetail = document.getElementById('fyp-detail');
    const btnFypDetail = document.getElementById('btn-fyp-detail');
    const closeFypDetail = document.getElementById('close-fyp-detail');

    // Mobile menu toggle
    let menuOpen = false;
    hamburgerBtn.addEventListener('click', () => {
        menuOpen = !menuOpen;
        mobileMenu.classList.toggle('open', menuOpen);
        const topLine = document.getElementById('line-top');
        const midLine = document.getElementById('line-mid');
        const botLine = document.getElementById('line-bot');
        if (menuOpen) {
            topLine.style.transform = 'translateY(6px) rotate(45deg)';
            midLine.style.opacity = '0';
            botLine.style.transform = 'translateY(-6px) rotate(-45deg)';
        } else {
            topLine.style.transform = 'translateY(0) rotate(0)';
            midLine.style.opacity = '1';
            botLine.style.transform = 'translateY(0) rotate(0)';
        }
    });

    allMobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuOpen = false;
            mobileMenu.classList.remove('open');
            document.getElementById('line-top').style.transform = 'translateY(0) rotate(0)';
            document.getElementById('line-mid').style.opacity = '1';
            document.getElementById('line-bot').style.transform = 'translateY(0) rotate(0)';
        });
    });

    // Navbar scroll effect & back-to-top
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 60);
        backToTopBtn.classList.toggle('visible', scrollY > 600);
        updateActiveNavLink();
    });

    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Active nav link detection
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + navbar.offsetHeight + 80;
        let current = '';
        sections.forEach(section => {
            if (section.offsetTop <= scrollPos && (section.offsetTop + section.offsetHeight) > scrollPos) {
                current = section.id;
            }
        });
        allNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
        allMobileNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    // Lightbox (unchanged)
    allGalleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const src = thumb.getAttribute('data-lightbox');
            const isVideo = thumb.getAttribute('data-video-placeholder');
            if (isVideo === 'true') {
                const imgEl = thumb.querySelector('img');
                if (imgEl) lightboxImg.src = imgEl.src.replace('w=400','w=1200').replace('h=400','h=800');
            } else if (src && src !== 'video') {
                lightboxImg.src = src;
            }
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox(); });
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => lightboxImg.src = '', 350);
    }

    // Scroll reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // Particle animation (unchanged)
    if (particleCanvas && ctx) {
        let particles = [];
        const maxParticles = window.innerWidth < 768 ? 40 : 80;
        const connectionDist = window.innerWidth < 768 ? 100 : 140;
        function resizeCanvas() {
            const hero = document.getElementById('hero');
            particleCanvas.width = hero.offsetWidth;
            particleCanvas.height = hero.offsetHeight;
        }
        function createParticles() {
            particles = [];
            for (let i=0; i<maxParticles; i++) {
                particles.push({
                    x: Math.random() * particleCanvas.width,
                    y: Math.random() * particleCanvas.height,
                    vx: (Math.random()-0.5)*0.5,
                    vy: (Math.random()-0.5)*0.5,
                    radius: Math.random()*2+1,
                    alpha: Math.random()*0.6+0.2
                });
            }
        }
        function animate() {
            ctx.clearRect(0,0,particleCanvas.width,particleCanvas.height);
            for (let p of particles) {
                p.x += p.vx; p.y += p.vy;
                if (p.x<0||p.x>particleCanvas.width) p.vx*=-1;
                if (p.y<0||p.y>particleCanvas.height) p.vy*=-1;
                p.x = Math.max(0, Math.min(particleCanvas.width, p.x));
                p.y = Math.max(0, Math.min(particleCanvas.height, p.y));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
                ctx.fillStyle = `rgba(0,212,255,${p.alpha})`;
                ctx.fill();
            }
            for (let i=0; i<particles.length; i++) {
                for (let j=i+1; j<particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx+dy*dy);
                    if (dist < connectionDist) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0,212,255,${(1-dist/connectionDist)*0.2})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        resizeCanvas(); createParticles(); animate();
        window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });
    }

    // -------- PROJECT DETAIL TOGGLE (FYP) --------
    function openFypDetail() {
        fypDetail.classList.remove('hidden');
        // Force reflow to trigger transition
        void fypDetail.offsetWidth;
        fypDetail.style.opacity = '1';
        fypDetail.style.transform = 'translateY(0)';
        // Scroll to detail smoothly
        setTimeout(() => {
            fypDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
    function closeFypDetailPanel() {
        fypDetail.style.opacity = '0';
        fypDetail.style.transform = 'translateY(16px)';
        setTimeout(() => {
            fypDetail.classList.add('hidden');
        }, 500);
    }

    btnFypDetail.addEventListener('click', (e) => {
        e.stopPropagation();
        openFypDetail();
    });
    closeFypDetail.addEventListener('click', closeFypDetailPanel);

    // Also allow clicking the card to open details (optional)
    document.getElementById('fyp-card').addEventListener('click', (e) => {
        // Only open if the click wasn't on the button (to avoid double trigger)
        if (!e.target.closest('#btn-fyp-detail')) {
            openFypDetail();
        }
    });

    // Initial active nav update
    updateActiveNavLink();
    console.log('🚀 Portfolio ready — Sarvesh Ram • AI Undergraduate');
})();