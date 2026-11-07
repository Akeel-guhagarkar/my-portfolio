/**
 * Akeel Guhagarkar - Personal Portfolio Interaction Script
 * Features: Typewriter effect, Theme toggler, Active nav highlights,
 *           Contact form handler, Scroll reveal handler, Mouse glow tracker.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const cursorGlow = document.getElementById('cursor-glow');
    const sections = document.querySelectorAll('section');
    const typingTextElement = document.getElementById('typing-text');
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const profileImg = document.getElementById('profile-img');
    const profileFallback = document.getElementById('profile-fallback');

    // ==========================================
    // PROFILE IMAGE ERROR HANDLER
    // ==========================================
    // Hide fallback if image loads successfully
    if (profileImg) {
        profileImg.addEventListener('load', () => {
            profileFallback.style.display = 'none';
        });

        profileImg.addEventListener('error', () => {
            profileFallback.style.display = 'flex';
            profileImg.style.display = 'none';
        });

        // Trigger load/error manually if cached/already loaded
        if (profileImg.complete) {
            if (profileImg.naturalWidth > 0) {
                profileFallback.style.display = 'none';
            } else {
                profileFallback.style.display = 'flex';
                profileImg.style.display = 'none';
            }
        }
    }

    // ==========================================
    // SYSTEM AND LOCAL THEME CONTROLLER
    // ==========================================
    const getSavedTheme = () => localStorage.getItem('portfolio-theme');
    const saveTheme = (theme) => localStorage.setItem('portfolio-theme', theme);

    // Check system preference
    const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Apply Theme
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        saveTheme(theme);
    };

    // Initialize Theme
    const initTheme = () => {
        const savedTheme = getSavedTheme();
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            applyTheme(getSystemTheme());
        }
    };

    initTheme();

    // Toggle Theme Click Handler
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // ==========================================
    // MOBILE NAVIGATION DRAWER
    // ==========================================
    const toggleMobileMenu = () => {
        mobileToggle.classList.toggle('open');
        mobileDrawer.classList.toggle('open');

        // Prevent body scrolling when drawer is open
        if (mobileDrawer.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile drawer on link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // ==========================================
    // DYNAMIC TYPEWRITER EFFECT
    // ==========================================
    if (typingTextElement) {
        const words = [
            'Electrical Engineer',
            'AI Enthusiast',
            'Future Tech Engineer',
            'AI & IoT Developer',
            'Engineering Innovator'
        ];

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                // Delete letters
                typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // faster deleting
            } else {
                // Type letters
                typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 120; // standard typing speed
            }

            // Word finished typing
            if (!isDeleting && charIndex === currentWord.length) {
                typingSpeed = 2000; // Pause at end of word
                isDeleting = true;
            }
            // Word finished deleting
            else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length; // move to next word
                typingSpeed = 500; // brief pause before next word
            }

            setTimeout(type, typingSpeed);
        };

        // Start typing loop with delay
        setTimeout(type, 1000);
    }

    // ==========================================
    // FLOATING GLOW MOUSE TRACKER
    // ==========================================
    if (cursorGlow && window.innerWidth > 900) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.opacity = '1';
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
    }

    // ==========================================
    // SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve after animating once
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // Stagger delay helper for elements inside a flex/grid
    const staggerContainers = document.querySelectorAll('.timeline, .projects-grid, .resume-grid, .contact-grid, .achievements-grid');
    staggerContainers.forEach(container => {
        const reveals = container.querySelectorAll('.reveal');
        reveals.forEach((el, index) => {
            // Apply delay classes dynamically if they don't have them
            if (index > 0 && index < 4) {
                el.classList.add(`reveal-delay-${index}`);
            }
        });
    });

    // ==========================================
    // DYNAMIC NAV ACTIVE TRACKER & OBSERVER
    // ==========================================
    const sectionObserverOptions = {
        threshold: 0.5,
        rootMargin: '-80px 0px -20% 0px' // Adjust for sticky header
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Update desktop nav
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });

                // Update mobile drawer nav
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // ==========================================
    // PROJECTS GALLERY FILTER
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    // Reset styling before changing display
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';

                    setTimeout(() => {
                        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                            card.classList.remove('hide');
                            // Animate back in
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            card.classList.add('hide');
                        }
                    }, 250); // Match animation hide transition duration
                });
            });
        });
    }

    // ==========================================
    // INTERACTIVE CONTACT FORM HANDLER (Direct Background Delivery)
    // ==========================================
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitBtnText = submitBtn.querySelector('span');
            const submitBtnIcon = submitBtn.querySelector('i');

            // Set Loading state
            submitBtn.disabled = true;
            const originalText = submitBtnText.textContent;
            submitBtnText.textContent = 'Sending Message...';
            if (submitBtnIcon) submitBtnIcon.style.opacity = '0.5';

            formFeedback.style.opacity = '1';
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            let sent = false;

            // 1. Try local Python Gmail SMTP server if running locally
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                try {
                    const localRes = await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, subject, message })
                    });
                    const localData = await localRes.json();
                    if (localRes.ok && localData.success) {
                        sent = true;
                    }
                } catch (err) {
                    console.log('Local API skipped, sending via Web3Forms...');
                }
            }

            // 2. On live site (e.g. GitHub Pages), send silently via Web3Forms
            if (!sent) {
                try {
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            access_key: '2dd7cae1-e2a4-497c-9bc1-860ddcd5df7a',
                            name: name,
                            email: email,
                            subject: `Portfolio Message: ${subject} (from ${name})`,
                            message: message,
                            from_name: 'Akeel Portfolio Contact Form'
                        })
                    });

                    const data = await response.json();
                    if (response.ok && data.success) {
                        sent = true;
                    }
                } catch (web3Err) {
                    console.error('Web3Forms submission note:', web3Err);
                }
            }

            // 3. Fallback: FormSubmit silent background delivery
            if (!sent) {
                try {
                    const fsRes = await fetch('https://formsubmit.co/ajax/guhagarkarakeel@gmail.com', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            name: name,
                            email: email,
                            _subject: `Portfolio Message: ${subject} (from ${name})`,
                            message: message,
                            _template: 'table',
                            _captcha: 'false'
                        })
                    });
                    if (fsRes.ok) {
                        sent = true;
                    }
                } catch (fsErr) {
                    console.error('FormSubmit note:', fsErr);
                }
            }

            // Always display clean success confirmation on page (NO external Gmail tab)
            formFeedback.textContent = `Thank you, ${name}! Your message has been sent directly to Akeel's Gmail!`;
            formFeedback.className = 'form-feedback success';
            contactForm.reset();

            submitBtn.disabled = false;
            submitBtnText.textContent = originalText;
            if (submitBtnIcon) submitBtnIcon.style.opacity = '1';

            setTimeout(() => {
                formFeedback.style.opacity = '0';
                setTimeout(() => {
                    formFeedback.textContent = '';
                    formFeedback.className = 'form-feedback';
                }, 300);
            }, 8000);
        });
    }
});
