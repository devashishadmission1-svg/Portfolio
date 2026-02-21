/**
 * Advanced UI Logic Script
 * Handles: Scroll Animations, Lazy Loading, Typing Effects, Dynamic Blog Rendering
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- Selectors ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const typeText1 = document.getElementById('type-text-1');
    const typeText2 = document.getElementById('type-text-2');
    const blogList = document.getElementById('blog-list');
    const galleryGrid = document.getElementById('gallery-grid');

    // --- Initialization ---
    initScrollAnimations();
    initLazyLoading();
    initTypingAnimation();
    if (blogList) initBlogSystem();
    if (galleryGrid) initGallerySystem();

    // --- ... existing methods ... ---

    // --- Gallery System ---
    function initGallerySystem() {
        const storedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
        if (storedImages.length > 0) {
            storedImages.forEach(img => {
                const div = document.createElement('div');
                div.className = 'gallery-item animate-on-scroll';
                div.innerHTML = `<img src="${img.url}" alt="${img.caption || 'Gallery Image'}" loading="lazy">`;
                galleryGrid.prepend(div);
            });
        }
    }

    // --- Scroll Animations (Intersection Observer) ---
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Once visible, we can stop observing
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    }

    // --- Lazy Loading Images ---
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        if (images.length === 0) return;

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('fade-in');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
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
                setTimeout(type1, 100);
            } else {
                setTimeout(type2, 500);
            }
        }

        function type2() {
            if (charIndex2 < words2.length) {
                typeText2.textContent += words2.charAt(charIndex2);
                charIndex2++;
                setTimeout(type2, 100);
            }
        }

        type1();
    }

    // --- Blog & Comment System ---
    function initBlogSystem() {
        const storedPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];

        // If there are no stored posts, we might want to keep the static one
        // or add a default. The user's inline script had some logic here.
        if (storedPosts.length > 0) {
            // Note: We don't clear the list necessarily to keep static posts as "featured"
            storedPosts.forEach(post => {
                const article = createBlogElement(post);
                blogList.prepend(article);
                loadComments(post.id);
            });
        }
    }

    function createBlogElement(post) {
        const article = document.createElement('article');
        article.className = 'blog-card animate-on-scroll';
        article.innerHTML = `
            <span class="date">${post.date}</span>
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <div class="comments-section" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <h4 style="font-size: 1rem; margin-bottom: 0.5rem;">Comments</h4>
                <div id="comments-${post.id}" class="comments-list" style="margin-bottom: 1rem;"></div>
                <form onsubmit="handleCommentSubmit(event, '${post.id}')" style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <input type="text" name="name" class="minimal-input" placeholder="Your Name" required>
                    <textarea name="text" class="minimal-input" placeholder="Add a comment..." required rows="2"></textarea>
                    <button type="submit" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8rem; align-self: flex-start;">Post</button>
                </form>
            </div>
        `;
        return article;
    }

    // Exporting these to window so inline oncsubmit works or replace them with listeners
    window.handleCommentSubmit = function (e, postId) {
        e.preventDefault();
        if (!postId || postId === 'undefined') {
            alert('Cannot comment on legacy posts.');
            return;
        }

        const form = e.target;
        const name = form.name.value;
        const text = form.text.value;
        const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const newComment = { name, text, date };
        const commentsMap = JSON.parse(localStorage.getItem('blogComments')) || {};
        if (!commentsMap[postId]) commentsMap[postId] = [];

        commentsMap[postId].push(newComment);
        localStorage.setItem('blogComments', JSON.stringify(commentsMap));

        loadComments(postId);
        form.reset();
    };

    function loadComments(postId) {
        const listEl = document.getElementById(`comments-${postId}`);
        if (!listEl) return;

        const commentsMap = JSON.parse(localStorage.getItem('blogComments')) || {};
        const postComments = commentsMap[postId] || [];

        listEl.innerHTML = '';
        if (postComments.length === 0) {
            listEl.innerHTML = '<p style="font-size: 0.8rem; opacity: 0.5; font-style: italic;">No comments yet.</p>';
            return;
        }

        postComments.forEach(c => {
            const cDiv = document.createElement('div');
            cDiv.style.marginBottom = '0.75rem';
            cDiv.style.paddingLeft = '0.5rem';
            cDiv.style.borderLeft = '2px solid var(--border-color)';
            cDiv.innerHTML = `
                <div style="font-size: 0.8rem; font-weight: bold; color: var(--primary-color);">${c.name} <span style="font-weight: normal; opacity: 0.5; font-size: 0.7rem;">• ${c.date}</span></div>
                <div style="font-size: 0.9rem;">${c.text}</div>
            `;
            listEl.appendChild(cDiv);
        });
    }
});
