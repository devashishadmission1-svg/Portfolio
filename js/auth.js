/**
 * Authentication Module
 * Handles: Login Logic, Session Management
 */

window.login = async function() {
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('error-msg');
    const password = passwordInput.value.trim();

    // Simple password check for the portfolio admin
    // Note: In a real app, this would be a backend request.
    const CORRECT_PASSWORD = 'tylerisreal'; 

    if (password === CORRECT_PASSWORD) {
        localStorage.setItem('isAdmin', 'true');
        // Smooth transition before redirect
        document.querySelector('.login-container').style.opacity = '0';
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 500);
    } else {
        errorMsg.style.opacity = '1';
        passwordInput.value = '';
        passwordInput.style.borderColor = 'var(--primary-color)';
        
        // Shake animation
        const container = document.querySelector('.login-container');
        container.style.animation = 'none';
        void container.offsetWidth; // Trigger reflow
        container.style.animation = 'shake 0.5s ease-in-out';
        
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
