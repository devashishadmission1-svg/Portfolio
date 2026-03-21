/**
 * Advanced UI Logic Script
 * Handles: Scroll Animations, Lazy Loading, Typing Effects
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- Selectors ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const typeText1 = document.getElementById('type-text-1');
    const typeText2 = document.getElementById('type-text-2');

    // --- Initialization ---
    initScrollAnimations();
    initLazyLoading();
    initTypingAnimation();
    initThemeToggle();

    // --- Scroll Animations (Intersection Observer) ---
    function initScrollAnimations() {
        if (!animatedElements.length) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    }

    // --- Lazy Loading ---
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        });
    }

    // --- Typing Animation ---
    function initTypingAnimation() {
        if (!typeText1 || !typeText2) return;

        const words1 = "Hello, I'm";
        const words2 = "Devashish Pathak";
        let charIndex1 = 0;
        let charIndex2 = 0;

        function type1() {
            if (charIndex1 < words1.length) {
                typeText1.textContent += words1.charAt(charIndex1);
                charIndex1++;
                setTimeout(type1, 80);
            } else {
                setTimeout(type2, 400);
            }
        }

        function type2() {
            if (charIndex2 < words2.length) {
                typeText2.textContent += words2.charAt(charIndex2);
                charIndex2++;
                setTimeout(type2, 80);
            }
        }

        // Initialize empty content
        typeText1.textContent = '';
        typeText2.textContent = '';
        type1();
    }

    // --- Theme Toggle ---
    function initThemeToggle() {
        // Simple theme toggle logic if a toggle button exists
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
            });
        }
    }
});
