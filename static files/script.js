document.addEventListener('DOMContentLoaded', () => {

    const signupBtn = document.getElementById('signup-btn');
    const loginBtn = document.getElementById('login-btn');
    const signupModal = document.getElementById('signup-modal');
    const loginModal = document.getElementById('login-modal');
    const closeButtons = document.querySelectorAll('.close-btn');
    
    // Event listeners to open modals
    signupBtn.addEventListener('click', () => signupModal.classList.remove('hidden'));
    loginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));

    // Event listeners to close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById(button.getAttribute('data-target')).classList.add('hidden');
        });
    });

    // Handle Signup Form (Image 4)
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = e.target.elements[0].value;
        const dob = e.target.elements[1].value;
        const email = e.target.elements[2].value;
        const password = e.target.elements[3].value;
        const confirmPassword = e.target.elements[4].value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        // --- API CALL PLACEHOLDER (Cognito Signup) ---
        // Example with AWS Amplify:
        // try {
        //     await Auth.signUp({ username: email, password, attributes: { nickname: username, 'custom:dob': dob } });
        //     alert('Signup successful! Please check your email for verification.');
        //     signupModal.classList.add('hidden');
        //     loginModal.classList.remove('hidden'); // Suggest logging in after signup
        // } catch (error) {
        //     console.error('Error signing up:', error);
        //     alert('Error signing up: ' + error.message);
        // }

        alert(`(API Placeholder) User "${username}" signed up with email "${email}"!`);
        signupModal.classList.add('hidden');
        // Optionally redirect to a verification page or show login modal
        loginModal.classList.remove('hidden');
    });

    // Handle Login Form (Image 3)
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameOrEmail = e.target.elements[0].value; // Cognito typically uses username or email
        const password = e.target.elements[1].value;

        // --- API CALL PLACEHOLDER (Cognito Login) ---
        // Example with AWS Amplify:
        // try {
        //     await Auth.signIn(usernameOrEmail, password);
        //     alert('Login successful! Redirecting to dashboard...');
        //     window.location.href = 'dashboard.html';
        // } catch (error) {
        //     console.error('Error logging in:', error);
        //     alert('Error logging in: ' + error.message);
        // }

        alert('Login successful! Redirecting to dashboard...');
        window.location.href = 'dashboard.html'; // Redirect to dashboard on successful login
    });
});