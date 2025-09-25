// Replace this with your actual hosted FastAPI backend URL
const API_BASE_URL = 'http://127.0.0.1:8000'; // Example for local development

const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const retypePassword = document.getElementById('retype-password').value;

        if (password !== retypePassword) {
            alert("Passwords do not match!");
            return;
        }

        // This is where you call your backend
        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Display error message from backend if available
                throw new Error(data.detail || 'Sign up failed');
            }

            // On successful signup, you might want to auto-login or redirect
            alert('Sign up successful! Please sign in.');
            window.location.href = 'signin.html';

        } catch (error) {
            console.error('Sign up error:', error);
            alert(`Error: ${error.message}`);
        }
    });
}

if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // FastAPI's OAuth2PasswordRequestForm expects form data, not JSON
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/token`, {
                method: 'POST',
                body: formData, // Sending as form data
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Sign in failed');
            }

            // Store the token (e.g., in localStorage) and redirect
            localStorage.setItem('accessToken', data.access_token);
            window.location.href = 'lifelist.html';

        } catch (error) {
            console.error('Sign in error:', error);
            alert(`Error: ${error.message}`);
        }
    });
}