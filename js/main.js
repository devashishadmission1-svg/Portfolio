/**
 * Devashish Pathak Portfolio - Main JS
 * Functionality for interactions, mobile menu, and scroll animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            // Note: simple implementation since mobile menu overlay was simplified in our rewrite.
            // If it existed, we would toggle an 'active' class on the overlay here.
            alert('Mobile menu clicked! (Expand logic in CSS if needed)');
        });
    }

    // 3. Scroll Animations (Intersection Observer)
    const animateElements = document.querySelectorAll('.fade-in-up, .fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // To trigger animation, we can add a class or just rely on the CSS keyframes firing
                // By default our CSS runs the animation on load if the block is visible.
                // We'll reset the animation when scrolling into view.
                entry.target.style.animationPlayState = 'running';
                
                // If using a specialized visible class approach:
                // entry.target.classList.add('visible');
                
                observer.unobserve(entry.target);
            } else {
                // Optional: pause animation when out of view
                entry.target.style.animationPlayState = 'paused';
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        // Pause by default until scrolled into view
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === "#") return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
