/**
 * Core Interactivity Script
 * Handles: Hamburger Menu, Dark Mode, Scroll-to-Top, Form Validation, Sticky Navbar
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- Selectors ---
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.createElement('div');
    const scrollToTopBtn = document.createElement('button');
    // --- Initialization ---
    initMobileMenu();
    initScrollToTop();
    initStickyNavbar();
    initFormValidation();
    initScrollProgress();
    initScrollSpy();
    initCopyEmail();

    // --- Mobile Menu Toggle ---
    function initMobileMenu() {
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '&#9776;'; // Hamburger icon
        navbar.querySelector('.container').appendChild(menuToggle);

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') ? '&times;' : '&#9776;';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '&#9776;';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '&#9776;';
            }
        });
    }

    // --- Scroll Progress Bar ---
    function initScrollProgress() {
        const progressBar = document.getElementById('scroll-progress-bar');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        }, { passive: true });
    }

    // --- ScrollSpy (Active Navigation Highlighting) ---
    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id], header[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active-link');
                }
            });
        }, { passive: true });
    }

    // --- Copy Email Tooltip ---
    function initCopyEmail() {
        const emailLinks = document.querySelectorAll('.email-link');
        emailLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const email = link.textContent.trim();
                navigator.clipboard.writeText(email).then(() => {
                    const originalText = link.textContent;
                    link.textContent = 'Email Copied!';
                    link.style.color = 'var(--accent)';
                    setTimeout(() => {
                        link.textContent = originalText;
                        link.style.color = '';
                    }, 2000);
                });
            });
            // Add a visual hint (tooltip concept)
            link.title = 'Click to copy email address';
        });
    }

    // --- Scroll to Top ---
    function initScrollToTop() {
        scrollToTopBtn.id = 'scroll-to-top';
        scrollToTopBtn.innerHTML = '&#8593;';
        body.appendChild(scrollToTopBtn);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Sticky Navbar ---
    function initStickyNavbar() {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Form Validation ---
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const inputs = form.querySelectorAll('input[required], textarea[required]');
                let isValid = true;

                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.style.borderColor = 'red';
                    } else {
                        input.style.borderColor = '';
                        
                        // Email specific validation
                        if (input.type === 'email' && !validateEmail(input.value)) {
                            isValid = false;
                            input.style.borderColor = 'red';
                        }
                    }
                });

                if (!isValid) {
                    e.preventDefault();
                    alert('Please fill in all fields correctly.');
                }
            });
        });
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // --- Debounce Utility ---
    function debounce(func, wait = 20, immediate = true) {
        let timeout;
        return function() {
            let context = this, args = arguments;
            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Resize event with debouncing example
    window.addEventListener('resize', debounce(() => {
        // Handle layout adjustments if necessary
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '&#9776;';
        }
    }));
});
