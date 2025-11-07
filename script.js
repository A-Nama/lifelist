document.addEventListener('DOMContentLoaded', () => {
    // --- AWS SDK Configuration ---
    const cognitoRegion = 'eu-north-1';        
    const userPoolId = 'eu-north-1_15V5xX4sK'; 
    const userPoolWebClientId = '5k7nh6jc5gs7qcv3r6sm1dbsig';

    AWS.config.region = cognitoRegion;
    const cognito = new AWS.CognitoIdentityServiceProvider();

    // --- DOM Elements ---
    const signupBtn = document.getElementById('signup-btn');
    const loginBtn = document.getElementById('login-btn');
    const signupModal = document.getElementById('signup-modal');
    const loginModal = document.getElementById('login-modal');
    const verificationModal = document.getElementById('verification-modal');
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const verificationForm = document.getElementById('verification-form');
    const closeButtons = document.querySelectorAll('.close-btn');

    signupBtn.addEventListener('click', () => signupModal.classList.remove('hidden'));
    loginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
    closeButtons.forEach(button => {
        button.addEventListener('click', () => button.closest('.modal').classList.add('hidden'));
    });

    // --- Handle Signup Form ---
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.elements[0].value;
        const password = e.target.elements[1].value;
        const confirmPassword = e.target.elements[2].value;

        // Password confirmation check
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return; // Stop the function
        }

        const params = {
            ClientId: userPoolWebClientId,
            Username: email,
            Password: password,
        };

        cognito.signUp(params, function(err, data) {
            if (err) {
                alert('Error signing up: ' + err.message);
            } else {
                // On success, hide signup and show verification modal
                alert('Sign up successful! Please check your email for a verification code.');
                signupModal.classList.add('hidden');
                verificationModal.classList.remove('hidden');
            }
        });
    });

    // --- Handle Verification Form ---
    verificationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Get email from the original signup form as it's needed for verification
        const email = signupForm.elements[0].value;
        const code = e.target.elements[0].value;

        if (!email) {
            alert("Could not find the email to verify. Please try signing up again.");
            return;
        }

        const params = {
            ClientId: userPoolWebClientId,
            Username: email,
            ConfirmationCode: code,
        };

        cognito.confirmSignUp(params, function(err, data) {
            if (err) {
                alert('Verification failed: ' + err.message);
            } else {
                alert('Account verified successfully! You can now log in.');
                verificationModal.classList.add('hidden');
                loginModal.classList.remove('hidden'); // Show login modal for convenience
            }
        });
    });

    // --- Handle Login Form ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.elements[0].value;
        const password = e.target.elements[1].value;

        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: userPoolWebClientId,
            AuthParameters: { 'USERNAME': email, 'PASSWORD': password },
        };

        cognito.initiateAuth(params, function(err, data) {
            if (err) {
                alert('Error logging in: ' + err.message);
            } else {
                const idToken = data.AuthenticationResult.IdToken;
                localStorage.setItem('idToken', idToken);
                window.location.href = 'my-lifelist.html';
            }
        });
    });
});