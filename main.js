/* ---------------- Hamburger Menu ---------------- */
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav');
const lineOne = document.querySelector('nav .menu-btn .line--1');
const lineTwo = document.querySelector('nav .menu-btn .line--2');
const lineThree = document.querySelector('nav .menu-btn .line--3');
const navLinks = document.querySelector('nav .nav-links');

function toggleMenu() {
    nav.classList.toggle('nav-open');
    lineOne.classList.toggle('line-cross');
    lineTwo.classList.toggle('line-fade-out');
    lineThree.classList.toggle('line-cross');
    navLinks.classList.toggle('fade-in');
}

menuBtn.addEventListener('click', toggleMenu);

/* Fix Nav Link: Tutup menu & Manual Scroll */
const menuLinks = document.querySelectorAll('nav .nav-links .link');
menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        if (nav.classList.contains('nav-open')) {
            toggleMenu();
        }
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            window.scrollTo({ top: targetSection.offsetTop, behavior: 'auto' });
        }
    });
});

// Scroll-down click (hero)
const scrollDown = document.querySelector('.scroll-down');
if (scrollDown) {
    scrollDown.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector('#Footer');
        if (target) {
            window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        }
    });
}

/* Klik di luar menu untuk menutup */
document.addEventListener('click', (e) => {
    if (nav.classList.contains('nav-open') && !e.target.closest('nav')) {
        toggleMenu();
    }
});

/* ---------------- Smooth Scroll & Effects ---------------- */
const content = document.querySelector('.smooth-scroll-wrapper');
let currentScroll = 0;
let targetScroll = 0;
const ease = 0.02;// Semakin kecil, semakin "berat" efeknya

const textLeft = document.querySelector('.parallax-text.left');
const textRight = document.querySelector('.parallax-text.right');
const scrollCounter = document.querySelector('.scroll p');
const lines = document.querySelectorAll('.about-text .reveal-line span');
const skillsSection = document.querySelector('.skills-section');
const skillsGrid = document.querySelector('.skills-container');
const gallerySection = document.querySelector('.gallery');
const scrollTopBtn = document.querySelector('.scroll-to-top');
const aboutSection = document.querySelector('.about-section');
const scrollLine = document.querySelector('.scroll-line');
const progressSection = document.querySelector('.skills-progress-wrapper');
const progressBars = document.querySelectorAll('.progress-fill');

/* Generic Parallax Items */
const parallaxItems = document.querySelectorAll('.parallax-item');
let parallaxMetrics = [];

function updateParallaxMetrics() {
    parallaxMetrics = Array.from(parallaxItems).map(item => {
        const rect = item.getBoundingClientRect();
        // Hitung posisi absolut elemen relatif terhadap wrapper (kompensasi scroll saat ini)
        const absoluteTop = rect.top + currentScroll;
        return {
            el: item,
            speed: parseFloat(item.dataset.speed) || 0,
            top: absoluteTop,
            height: rect.height
        };
    });
}

// Set tinggi body agar sesuai dengan konten (karena konten di-fix)
function setBodyHeight() {
    if (content) {
        document.body.style.height = `${content.offsetHeight}px`;
    }
}
window.addEventListener('resize', setBodyHeight);
window.addEventListener('load', setBodyHeight);
setBodyHeight();

/* Metrics for Parallax */
let skillsTop = 0;
let skillsHeight = 0;
let winHeight = window.innerHeight;
function updateMetrics() {
    winHeight = window.innerHeight;
    if (skillsSection) {
        skillsTop = skillsSection.offsetTop;
        skillsHeight = skillsSection.offsetHeight;
    }
    updateParallaxMetrics();
}
window.addEventListener('resize', updateMetrics);
window.addEventListener('load', updateMetrics);
updateMetrics();

/* Cursor Logic */
const cursor = document.querySelector('.cursor');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

const hoverElements = document.querySelectorAll('a, .menu-btn, .skill, .gallery figure, .scroll-to-top');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
    if (scrollCounter) {
        scrollCounter.textContent = Math.floor(targetScroll);
    }

    // Show/Hide Scroll Top Button
    if (scrollTopBtn) {
        if (targetScroll > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
});

// Scroll Top Click Event
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

let scrollDirection = 1; // 1 = down, -1 = up

function animate() {
    currentScroll += (targetScroll - currentScroll) * ease;

    // Cursor Animation (Lerp)
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    if (cursor) {
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
    }

    // Gerakkan wrapper konten (Smooth Scroll)
    if (content) {
        content.style.transform = `translateY(-${currentScroll}px)`;
    }

    // Enhanced 3D Parallax (vertical + Z + subtle rotation from mouse)
    parallaxMetrics.forEach(item => {
        const centerScreen = currentScroll + winHeight / 2;
        const centerElement = item.top + item.height / 2;
        const depth = (centerScreen - centerElement) * item.speed; // base vertical offset
        const offsetY = depth;
        const offsetZ = -depth * 0.12; // push forward/backwards based on speed and position
        // Normalized mouse (-1 .. 1)
        const normX = (mouseX - window.innerWidth / 2) / (window.innerWidth / 2 || 1);
        const normY = (mouseY - window.innerHeight / 2) / (window.innerHeight / 2 || 1);
        const rotateY = normX * 8 * item.speed; // deg
        const rotateX = -normY * 6 * item.speed; // deg
        item.el.style.transformOrigin = 'center center';
        item.el.style.transform = `translate3d(0, ${offsetY}px, ${offsetZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    // Parallax Text (add subtle Z for depth)
    if (textLeft) textLeft.style.transform = `translateX(-${currentScroll * 0.5}px) translateZ(${currentScroll * 0.02}px)`;
    if (textRight) textRight.style.transform = `translateX(${currentScroll * 0.5}px) translateZ(${currentScroll * 0.02}px)`;


    // Gallery Effect (Trigger saat melewati Skills)
    // Logika dari snippet: if(wScroll > $('.skills').offset().top)
    if (gallerySection && skillsSection) {
        if (currentScroll > skillsTop) {
            gallerySection.style.opacity = '1';
            gallerySection.classList.add('bounceInUp');
        }
    }

    // About Line Animation (Garis Memanjang)
    if (aboutSection && scrollLine) {
        const rect = aboutSection.getBoundingClientRect();
        const winH = window.innerHeight;
        const triggerPoint = winH * 0.85; // Mulai bergerak saat section masuk 85% layar
        const finishPoint = winH * 0.4;   // Lebar penuh saat di 40% layar

        let progress = (triggerPoint - rect.top) / (triggerPoint - finishPoint);
        progress = Math.max(0, Math.min(1, progress)); // Batasi antara 0 dan 1
        scrollLine.style.width = `${progress * 500}px`; // Max lebar 500px
    }

    // Progress Bar Animation
    if (progressSection) {
        const rect = progressSection.getBoundingClientRect();
        // Trigger saat section masuk 85% viewport
        if (rect.top < window.innerHeight * 0.85 && !progressSection.classList.contains('started')) {
            progressSection.classList.add('started');

            progressBars.forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });

            // Animate Numbers
            const percentTexts = document.querySelectorAll('.skill-percent');
            percentTexts.forEach(text => {
                const target = parseInt(text.innerText);
                let current = 0;
                const duration = 1500;
                const stepTime = Math.abs(Math.floor(duration / target));
                const timer = setInterval(() => {
                    current += 1;
                    text.innerText = current + "%";
                    if (current >= target) clearInterval(timer);
                }, stepTime);
            });
        }
    }

    // Skills Background Moving Effect (Grid Parallax)
    if (skillsSection) {
        const move = currentScroll * 0.1; // Kecepatan gerak background
        skillsSection.style.backgroundPosition = `${move}px ${move}px, ${move}px ${move}px, 0 0`;
    }

    // Deteksi arah scroll untuk efek teks
    if (Math.abs(targetScroll - currentScroll) > 0.5) {
        scrollDirection = targetScroll > currentScroll ? 1 : -1;
    }

    // Text Reveal Logic
    lines.forEach((line) => {
        const rect = line.getBoundingClientRect();
        const midScreen = window.innerHeight / 2;

        if (rect.top < midScreen && rect.bottom > 0) {
            // In viewport: mark as visible and adjust tone
            line.classList.add('in-view');
            if (scrollDirection === 1) {
                line.style.color = '#111'; // Scroll ke bawah -> cerah
            } else {
                line.style.color = '#444'; // Scroll ke atas -> agak gelap
            }
        } else {
            // Outside viewport
            line.classList.remove('in-view');
            line.style.color = '#CCC'; // Di luar area -> lembut
        }
    });

    requestAnimationFrame(animate);
}

animate();

/* Secret Box Logic */
const secretBtn = document.getElementById('secret-btn');
const secretBox = document.getElementById('secret-box');
const closeSecret = document.getElementById('close-secret');

if (secretBtn && secretBox && closeSecret) {
    secretBtn.addEventListener('click', () => {
        secretBox.classList.add('active');
    });

    closeSecret.addEventListener('click', () => {
        secretBox.classList.remove('active');
    });

    // Close when clicking outside the content
    secretBox.addEventListener('click', (e) => {
        if (e.target === secretBox) {
            secretBox.classList.remove('active');
        }
    });
}

/* Intro Animation Logic */
const preloader = document.querySelector('.preloader');
const loaderLine = document.querySelector('.loader-line');
const loaderCounter = document.querySelector('.loader-counter');
const introText = document.querySelector('.intro-text');
const introSubtext = document.querySelector('.intro-subtext');
const heroContent = document.querySelector('.hero-content');

if (preloader) {
    // Disable scroll saat loading
    document.body.style.overflow = 'hidden';

    let loadProgress = 0;
    const interval = setInterval(() => {
        loadProgress += 1;

        if (loaderLine) loaderLine.style.width = `${loadProgress}%`;
        if (loaderCounter) loaderCounter.textContent = `${loadProgress}%`;

        if (loadProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('hide-preloader');
                document.body.style.overflow = ''; // Enable scroll kembali
                if (heroContent) heroContent.classList.add('visible');
            }, 500); // Sedikit delay sebelum naik
        }
    }, 30); // Kecepatan loading (semakin kecil semakin cepat)
}
