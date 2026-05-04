/**
 * Authentication Module
 * Handles: Login Logic, Session Management
 */

window.login = async function() {
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('error-msg');
    const password = passwordInput.value.trim();

    try {
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: password })
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('isAdmin', 'true');
            // Smooth transition before redirect
            const card = document.querySelector('.project-card');
            if (card) card.style.opacity = '0';
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        errorMsg.style.opacity = '1';
        passwordInput.value = '';
        
        // Shake animation
        const container = document.querySelector('.project-card');
        if (container) {
            container.style.animation = 'none';
            void container.offsetWidth; // Trigger reflow
            container.style.animation = 'shake 0.5s ease-in-out';
        }
        
        setTimeout(() => {
            errorMsg.style.opacity = '0';
        }, 3000);
    }
}

// Add shake animation to style
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
