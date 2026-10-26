// ========================================
// MOBILE MENU TOGGLE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnButton = mobileMenuBtn.contains(event.target);

            if (!isClickInsideNav && !isClickOnButton && navLinks.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
});

// ========================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Only prevent default if it's not just "#"
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========================================
// CONTACT FORM HANDLING
// ========================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const statusEl = document.getElementById('formStatus');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const showStatus = function(text, kind) {
        statusEl.textContent = text;
        statusEl.className = 'form-status ' + kind;
    };

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const key = contactForm.querySelector('[name="access_key"]').value;
        if (!key || key.indexOf('PASTE') === 0) {
            showStatus('This form is not connected yet. Please email info@greylockguitars.com.', 'error');
            return;
        }

        submitBtn.disabled = true;
        showStatus('Sending...', '');

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
            });
            const result = await response.json();
            if (response.ok && result.success) {
                showStatus('Thank you. Your message was sent, and we will be in touch.', 'success');
                contactForm.reset();
            } else {
                showStatus('Something went wrong. Please email us at info@greylockguitars.com.', 'error');
            }
        } catch (err) {
            showStatus('Something went wrong. Please email us at info@greylockguitars.com.', 'error');
        } finally {
            submitBtn.disabled = false;
        }
    });
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements that should fade in
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.guitar-card, .blog-card, .feature-card, .bench-topic-card, .bench-feature-grid, .bench-principle');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
});

// ========================================
// NAVBAR BACKGROUND ON SCROLL
// ========================================
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    } else {
        nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ========================================
// ACTIVE NAV LINK HIGHLIGHTING
// ========================================
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Remove active class from all links first
        link.classList.remove('active');

        // Check if current page matches the link
        if (currentPage === href && href !== '#') {
            link.classList.add('active');
        } else if (['saddleback.html','goshawk.html','bascom.html'].includes(currentPage) && href === 'index.html#models') {
            link.classList.add('active');
        } else if (currentPage.startsWith('bench-') && href === 'bench.html') {
            link.classList.add('active');
        } else if (currentPath === '/' && href === 'index.html') {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveNavLink);

// ========================================
// PARALLAX EFFECT FOR HERO
// ========================================
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        heroBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

// ========================================
// UTILITIES
// ========================================

// Email protection (simple obfuscation)
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // Email links work normally, this is just a placeholder for future enhancements
    });
});

// Prevent form resubmission on page reload
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// Add loading class to images for better UX
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
});

// ========================================
// IMAGE GALLERY FUNCTIONS
// ========================================
let currentImageIndex = {};

function initGallery(galleryId) {
    if (!currentImageIndex[galleryId]) {
        currentImageIndex[galleryId] = 0;
    }
}

function changeImage(galleryId, direction) {
    initGallery(galleryId);

    const gallery = document.getElementById(galleryId);
    const images = gallery.querySelectorAll('.gallery-image');
    const dots = document.querySelectorAll(`#${galleryId.replace('Gallery', 'Dots')} .gallery-dot`);

    // Remove active class from current image and dot
    images[currentImageIndex[galleryId]].classList.remove('active');
    if (dots[currentImageIndex[galleryId]]) {
        dots[currentImageIndex[galleryId]].classList.remove('active');
    }

    // Calculate new index
    currentImageIndex[galleryId] += direction;

    // Wrap around
    if (currentImageIndex[galleryId] >= images.length) {
        currentImageIndex[galleryId] = 0;
    } else if (currentImageIndex[galleryId] < 0) {
        currentImageIndex[galleryId] = images.length - 1;
    }

    // Add active class to new image and dot
    images[currentImageIndex[galleryId]].classList.add('active');
    if (dots[currentImageIndex[galleryId]]) {
        dots[currentImageIndex[galleryId]].classList.add('active');
    }
}

function setImage(galleryId, index) {
    initGallery(galleryId);

    const gallery = document.getElementById(galleryId);
    const images = gallery.querySelectorAll('.gallery-image');
    const dots = document.querySelectorAll(`#${galleryId.replace('Gallery', 'Dots')} .gallery-dot`);

    // Remove active class from current image and dot
    images[currentImageIndex[galleryId]].classList.remove('active');
    if (dots[currentImageIndex[galleryId]]) {
        dots[currentImageIndex[galleryId]].classList.remove('active');
    }

    // Set new index
    currentImageIndex[galleryId] = index;

    // Add active class to new image and dot
    images[currentImageIndex[galleryId]].classList.add('active');
    if (dots[currentImageIndex[galleryId]]) {
        dots[currentImageIndex[galleryId]].classList.add('active');
    }
}

// Keyboard navigation for galleries
document.addEventListener('keydown', function(e) {
    const galleries = document.querySelectorAll('.gallery-container');
    if (galleries.length === 0) return;

    galleries.forEach(container => {
        const gallery = container.querySelector('.gallery-images');
        if (!gallery) return;

        const galleryId = gallery.id;

        if (e.key === 'ArrowLeft') {
            changeImage(galleryId, -1);
        } else if (e.key === 'ArrowRight') {
            changeImage(galleryId, 1);
        }
    });
});

// ========================================
// LIGHTBOX MODAL FUNCTIONS
// ========================================
let lightboxImages = [];
let currentLightboxIndex = 0;

function openLightbox(galleryId, imageIndex) {
    const gallery = document.getElementById(galleryId);
    const images = gallery.querySelectorAll('.gallery-image');

    // Store all image sources
    lightboxImages = Array.from(images).map(img => img.src);
    currentLightboxIndex = imageIndex;

    // Show lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');

    lightboxImage.src = lightboxImages[currentLightboxIndex];
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${lightboxImages.length}`;
    lightbox.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function changeLightboxImage(direction) {
    currentLightboxIndex += direction;

    // Wrap around
    if (currentLightboxIndex >= lightboxImages.length) {
        currentLightboxIndex = 0;
    } else if (currentLightboxIndex < 0) {
        currentLightboxIndex = lightboxImages.length - 1;
    }

    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');

    lightboxImage.src = lightboxImages[currentLightboxIndex];
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${lightboxImages.length}`;
}

// Add click handlers to gallery images
document.addEventListener('DOMContentLoaded', function() {
    const galleries = document.querySelectorAll('.gallery-images');

    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('.gallery-image');
        images.forEach((img, index) => {
            img.addEventListener('click', function() {
                openLightbox(gallery.id, index);
            });
        });
    });

    // Close lightbox on background click
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            changeLightboxImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeLightboxImage(1);
        }
    });
});

// Console message for developers
console.log('%c🎸 Greylock Guitars', 'font-size: 20px; font-weight: bold; color: #20242b;');
console.log('%cHandcrafted with precision and care', 'font-size: 12px; color: #6b7280;');
