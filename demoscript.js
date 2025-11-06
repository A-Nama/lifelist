// This is the complete code for demo-script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const signupBtn = document.getElementById('signup-btn');
    const loginBtn = document.getElementById('login-btn');
    const signupModal = document.getElementById('signup-modal');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const closeButtons = document.querySelectorAll('.close-btn');

    // --- Modal Logic (unchanged) ---
    signupBtn.addEventListener('click', () => signupModal.classList.remove('hidden'));
    loginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
    closeButtons.forEach(button => {
        button.addEventListener('click', () => button.closest('.modal').classList.add('hidden'));
    });

    // --- Simulated Login Form ---
    loginForm.addEventListener('submit', (e) => {
        // Prevent the form from actually submitting
        e.preventDefault();

        // THIS IS THE KEY CHANGE:
        // Instead of calling AWS Cognito, we just redirect to the demo page.
        // This simulates a successful login for your demo.
        console.log("Simulating successful login...");
        window.location.href = 'demo.html';
    });

    // --- Disable other forms for the demo ---
    const signupForm = document.getElementById('signup-form');
    const verificationForm = document.getElementById('verification-form');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Sign up is disabled for this demo. Please use the Sign In button.');
    });
    
    verificationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Verification is disabled for this demo.');
    });
});