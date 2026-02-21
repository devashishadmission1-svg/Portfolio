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
    const themeToggleBtn = document.createElement('button');

    // --- Initialization ---
    initMobileMenu();
    initThemeToggle();
    initScrollToTop();
    initStickyNavbar();
    initFormValidation();

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

    // --- Dark/Light Mode Toggle ---
    function initThemeToggle() {
        themeToggleBtn.className = 'theme-toggle';
        themeToggleBtn.setAttribute('aria-label', 'Toggle Dark Mode');
        themeToggleBtn.innerHTML = '&#127769;'; // Moon icon
        
        // Add to navbar
        navbar.querySelector('.container').insertBefore(themeToggleBtn, menuToggle);

        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            body.classList.add('dark-theme');
            themeToggleBtn.innerHTML = '&#9728;'; // Sun icon
        }

        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            let theme = 'light';
            if (body.classList.contains('dark-theme')) {
                theme = 'dark';
                themeToggleBtn.innerHTML = '&#9728;';
            } else {
                themeToggleBtn.innerHTML = '&#127769;';
            }
            localStorage.setItem('theme', theme);
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
