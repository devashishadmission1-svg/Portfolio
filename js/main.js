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
    initCursorResponsiveUI();
    initGalleryLightbox();
    initGitHubStats();

    // --- Scroll Animations (Intersection Observer) ---
    function initScrollAnimations() {
        if (!animatedElements.length) return;

        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
        if (!prefersReducedMotion) {
            animatedElements.forEach((el, i) => {
                // Stagger reveals to feel more modern without changing layout.
                el.style.transitionDelay = `${Math.min(600, i * 80)}ms`;
            });
        }

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

    // --- Cursor Responsive UI ---
    function initCursorResponsiveUI() {
        // Respect reduced-motion and touch devices
        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
        const isCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches;
        const canHover = window.matchMedia?.('(hover: hover)')?.matches;
        if (prefersReducedMotion || isCoarsePointer || !canHover) return;

        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);
        document.body.classList.add('cursor-active');

        let px = -9999, py = -9999;
        let rafPending = false;

        const onPointerMove = (e) => {
            px = e.clientX;
            py = e.clientY;
            if (!rafPending) {
                rafPending = true;
                requestAnimationFrame(() => {
                    rafPending = false;
                    // Center glow on cursor
                    glow.style.transform = `translate3d(${px - 280}px, ${py - 280}px, 0)`;
                });
            }
        };

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerleave', () => {
            glow.style.transform = 'translate3d(-9999px, -9999px, 0)';
        });

        // Tilt + subtle magnetic hover on key UI parts
        const tiltTargets = Array.from(document.querySelectorAll('.project-card, .btn, .btn-res, .link-arrow, .nav-links a, .gallery-item'));
        tiltTargets.forEach((el) => el.classList.add('cursor-tilt'));

        const maxTilt = 8; // degrees
        const maxTranslate = 8; // px

        const bindTilt = (el) => {
            const onMove = (e) => {
                const r = el.getBoundingClientRect();
                const mx = (e.clientX - r.left) / r.width;  // 0..1
                const my = (e.clientY - r.top) / r.height;  // 0..1
                const dx = (mx - 0.5);
                const dy = (my - 0.5);

                const ry = (dx * maxTilt).toFixed(2);
                const rx = (-dy * maxTilt).toFixed(2);
                const tx = (dx * maxTranslate).toFixed(1);
                const ty = (dy * maxTranslate).toFixed(1);

                el.style.setProperty('--rx', `${rx}deg`);
                el.style.setProperty('--ry', `${ry}deg`);
                el.style.setProperty('--tx', `${tx}px`);
                el.style.setProperty('--ty', `${ty}px`);
                el.classList.add('is-tilting');
            };

            const onLeave = () => {
                el.classList.remove('is-tilting');
                el.style.removeProperty('--rx');
                el.style.removeProperty('--ry');
                el.style.removeProperty('--tx');
                el.style.removeProperty('--ty');
            };

            el.addEventListener('pointermove', onMove, { passive: true });
            el.addEventListener('pointerleave', onLeave);
        };

        tiltTargets.forEach(bindTilt);
    }

    // --- Gallery Lightbox (click-to-open) ---
    function initGalleryLightbox() {
        const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
        if (!galleryImages.length) return;

        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.tabIndex = -1;

        overlay.innerHTML = `
            <div class="lightbox-modal">
                <button class="lightbox-close" type="button" aria-label="Close">&times;</button>
                <div class="lightbox-body">
                    <img class="lightbox-image" alt="" />
                    <div class="lightbox-caption">
                        <h3 class="lightbox-title"></h3>
                        <p class="lightbox-desc"></p>
                        <div class="lightbox-hint">Use \u2190 \u2192 to navigate • Esc to close</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const closeBtn = overlay.querySelector('.lightbox-close');
        const lightboxImg = overlay.querySelector('.lightbox-image');
        const titleEl = overlay.querySelector('.lightbox-title');
        const descEl = overlay.querySelector('.lightbox-desc');

        let activeIndex = 0;
        let isOpen = false;

        const getMeta = (imgEl) => {
            const item = imgEl.closest('.gallery-item');
            const metaWrap = item?.querySelector('.gallery-overlay');
            const h4 = metaWrap?.querySelector('h4');
            const p = metaWrap?.querySelector('p');
            return {
                title: (h4?.textContent || '').trim(),
                desc: (p?.textContent || '').trim()
            };
        };

        const render = (index) => {
            activeIndex = (index + galleryImages.length) % galleryImages.length;
            const imgEl = galleryImages[activeIndex];
            const meta = getMeta(imgEl);

            // Use the original image src for maximum visual fidelity.
            lightboxImg.src = imgEl.currentSrc || imgEl.src;
            lightboxImg.alt = imgEl.alt || meta.title || 'Gallery image';
            titleEl.textContent = meta.title || '';
            descEl.textContent = meta.desc || '';
        };

        const open = (index) => {
            render(index);
            isOpen = true;
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        };

        const close = () => {
            isOpen = false;
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        };

        galleryImages.forEach((imgEl, i) => {
            imgEl.style.cursor = 'pointer';
            imgEl.addEventListener('click', () => open(i));
        });

        closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            // Close only when clicking the backdrop.
            if (e.target === overlay) close();
        });

        window.addEventListener('keydown', (e) => {
            if (!isOpen) return;

            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') open(activeIndex - 1);
            if (e.key === 'ArrowRight') open(activeIndex + 1);

            if (e.key === 'Tab') {
                // Simple focus trap: keep focus on the close button.
                e.preventDefault();
                closeBtn.focus();
            }
        });
    }

    // --- GitHub Stats Integration ---
    async function initGitHubStats() {
        const statsCard = document.getElementById('github-stats-card');
        const statsContent = document.getElementById('gh-stats-content');
        if (!statsCard || !statsContent) return;

        try {
            // Fetch User profile (stars, followers)
            const userResponse = await fetch('https://api.github.com/users/devashishadmission1-svg');
            const userData = await userResponse.json();

            // Fetch repos to count total stars (simplified)
            const reposResponse = await fetch('https://api.github.com/users/devashishadmission1-svg/repos?sort=updated&per_page=5');
            const reposData = await reposResponse.json();

            const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
            const latestRepo = reposData[0];

            statsContent.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 0px;">Real-time Stats:</p>
                    <div style="display: flex; gap: 1.5rem;">
                        <div>
                            <span style="display: block; font-size: 1.5rem; font-weight: 800; color: var(--primary);">${userData.public_repos || 0}</span>
                            <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">Repos</span>
                        </div>
                        <div>
                            <span style="display: block; font-size: 1.5rem; font-weight: 800; color: var(--primary);">${totalStars}</span>
                            <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">Stars</span>
                        </div>
                        <div>
                            <span style="display: block; font-size: 1.5rem; font-weight: 800; color: var(--primary);">${userData.followers || 0}</span>
                            <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">Followers</span>
                        </div>
                    </div>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
                        <p style="font-size: 0.85rem; color: var(--text-muted);">
                            <strong>Latest Update:</strong> ${latestRepo ? latestRepo.name : 'N/A'}<br>
                            <span style="font-size: 0.8rem; opacity: 0.7;">${latestRepo ? (latestRepo.description || 'No description provided.') : ''}</span>
                        </p>
                    </div>
                </div>
            `;
            statsCard.style.display = 'block';
        } catch (error) {
            console.error('Error fetching GitHub stats:', error);
            statsContent.innerHTML = '<p style="color: var(--text-dim);">Unable to load activity. Visit GitHub profile for more.</p>';
            statsCard.style.display = 'block';
        }
    }

});
