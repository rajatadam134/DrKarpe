document.addEventListener('DOMContentLoaded', () => {
    // 1. Shrink header on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    });

    // 2. Mobile navigation toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // 3. Hero Slider logic (for index.html)
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            let next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        function startSlideShow() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function resetSlideShow() {
            clearInterval(slideInterval);
            startSlideShow();
        }

        // Add event listeners to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetSlideShow();
            });
        });

        // Initialize slideshow
        startSlideShow();
    }

    // 4. Animated review milestone counter
    const counterElement = document.getElementById('reviews-counter');
    if (counterElement) {
        const targetValue = parseInt(counterElement.getAttribute('data-target') || '1400', 10);
        let started = false;

        const animateCounter = () => {
            let start = 0;
            const duration = 2000; // 2 seconds
            const stepTime = Math.abs(Math.floor(duration / targetValue));
            
            const timer = setInterval(() => {
                start += 15; // increment rate
                if (start >= targetValue) {
                    counterElement.textContent = targetValue.toLocaleString() + '+';
                    clearInterval(timer);
                } else {
                    counterElement.textContent = start.toLocaleString() + '+';
                }
            }, stepTime * 15);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !started) {
                    animateCounter();
                    started = true;
                }
            });
        }, { threshold: 0.3 });

        observer.observe(document.querySelector('.reviews-section'));
    }

    // 5. Scroll-driven animations (Fade-in effect)
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                    fadeObserver.unobserve(entry.target); // Animates only once
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        fadeElements.forEach(el => fadeObserver.observe(el));
    }

    // 6. Smile Gallery Portfolio Filtering (for gallery.html)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const caseCards = document.querySelectorAll('.case-card');

    if (filterButtons.length > 0 && caseCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Toggle active class on buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                caseCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                        // Add fade-in effect
                        setTimeout(() => card.style.opacity = '1', 50);
                    } else {
                        const categories = card.getAttribute('data-category').split(' ');
                        if (categories.includes(filterValue)) {
                            card.style.display = 'block';
                            setTimeout(() => card.style.opacity = '1', 50);
                        } else {
                            card.style.opacity = '0';
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }

    // 7. Lightbox for Galleries (clinic images & smile gallery)
    const galleryItems = document.querySelectorAll('.gallery-item, .case-card');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (galleryItems.length > 0 && lightbox && lightboxImg) {
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Prevent trigger if clicking details or links
                if (e.target.closest('a')) return;

                const img = item.querySelector('img');
                if (img) {
                    const src = img.getAttribute('src');
                    let title = '';
                    
                    if (item.classList.contains('gallery-item')) {
                        const alt = img.getAttribute('alt') || 'Clinic Interior';
                        title = alt;
                    } else if (item.classList.contains('case-card')) {
                        const titleEl = item.querySelector('.case-title');
                        const tagEl = item.querySelector('.case-tag');
                        title = `${tagEl ? tagEl.textContent : ''} - ${titleEl ? titleEl.textContent : ''}`;
                    }

                    lightboxImg.setAttribute('src', src);
                    lightboxCaption.textContent = title;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Lock scrolling
                }
            });
        });

        // Close Lightbox
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });

        // ESC key close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // 8. Appointment Form Validation & Submission (for contact.html & index.html)
    const bookingForm = document.getElementById('appointment-form');
    const formAlert = document.getElementById('form-alert');
    // Paste your Google Script Web App URL here after deploying (e.g. 'https://script.google.com/macros/s/XXXXX/exec')
    const GOOGLE_SHEET_WEB_APP_URL = '';

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim() || 'N/A';
            const branch = document.getElementById('branch').value;
            const date = document.getElementById('date').value;
            const treatment = document.getElementById('treatment') ? document.getElementById('treatment').value : 'General Checkup';
            const message = document.getElementById('message').value.trim() || 'No message';

            if (!name || !phone || !branch || !date) {
                showFormAlert('Please fill out all required fields.', 'error');
                return;
            }

            // Phone regex validation (Indian numbers: 10 digits)
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(phone.replace(/[-+ ]/g, ''))) {
                showFormAlert('Please enter a valid 10-digit mobile number.', 'error');
                return;
            }

            if (GOOGLE_SHEET_WEB_APP_URL) {
                const submitButton = bookingForm.querySelector('button[type="submit"]');
                const originalBtnText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

                // Send request via POST
                fetch(GOOGLE_SHEET_WEB_APP_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        email: email,
                        branch: branch,
                        date: date,
                        treatment: treatment,
                        message: message
                    })
                })
                .then(() => {
                    showFormAlert('Thank you! Your appointment request has been submitted. We will contact you shortly to confirm your slot.', 'success');
                    bookingForm.reset();
                })
                .catch((error) => {
                    console.error('Error submitting form:', error);
                    showFormAlert('There was an issue sending your request. Please try again or call us directly.', 'error');
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalBtnText;
                });
            } else {
                // Mock submission success (for testing local fallback)
                console.log('Mock Form Data:', { name, phone, email, branch, date, treatment, message });
                showFormAlert('Thank you! [Local Mock Submission] Your appointment request has been submitted successfully.', 'success');
                bookingForm.reset();
            }
        });

        function showFormAlert(msg, type) {
            if (formAlert) {
                formAlert.textContent = msg;
                formAlert.className = `form-alert ${type}`;
                formAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
});
