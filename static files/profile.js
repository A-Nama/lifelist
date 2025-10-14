document.addEventListener('DOMContentLoaded', () => {
    // --- MOCK DATA (Replace with your AWS Cognito user attributes) ---
    let currentUser = {
        username: "YourName",
        fullName: "Your Full Name",
        profilePic: "https://via.placeholder.com/150/FF6347/FFFFFF?text=P",
        id: "user-abc"
    };

    // --- DOM ELEMENTS ---
    const profileEditorTitle = document.querySelector('.profile-container h2');
    const profileImageEditor = document.querySelector('.profile-image-editor');
    const profilePicUploadInput = document.getElementById('profile-pic-upload');
    const editProfilePicBtn = document.getElementById('edit-profile-pic-btn');
    const editNameBtn = document.getElementById('edit-name-btn');
    const editUsernameBtn = document.getElementById('edit-username-btn');

    // --- FUNCTIONS ---

    const renderProfile = () => {
        profileEditorTitle.innerHTML = `hey <span style="font-family:'Quattrocento Sans', sans-serif;">${currentUser.username}</span> ,`;
        profileImageEditor.style.backgroundImage = `url('${currentUser.profilePic}')`;
    };

    const updateProfile = async (field, newValue) => {
        // --- API CALL PLACEHOLDER (Update Cognito User Attributes) ---
        // Example with AWS Amplify:
        // try {
        //     const user = await Auth.currentAuthenticatedUser();
        //     const attributes = {};
        //     if (field === 'profilePic') attributes['picture'] = newValue; // Or a custom attribute
        //     if (field === 'fullName') attributes['name'] = newValue;
        //     if (field === 'username') attributes['nickname'] = newValue; // Cognito 'nickname' is often used for display username
        //     
        //     await Auth.updateUserAttributes(user, attributes);
        //     currentUser[field] = newValue; // Update local mock data
        //     renderProfile();
        //     alert(`Your ${field} has been updated!`);
        // } catch (error) {
        //     console.error(`Error updating ${field}:`, error);
        //     alert(`Error updating ${field}: ` + error.message);
        // }

        alert(`(API Placeholder) Updating ${field} to: ${newValue}`);
        currentUser[field] = newValue; // Update mock data
        renderProfile();
    };

    // --- EVENT LISTENERS ---

    // Handle profile picture upload
    profilePicUploadInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // --- API CALL PLACEHOLDER (Upload to S3 & Update Profile) ---
        // 1. Upload file to S3.
        // 2. Get the S3 URL.
        // 3. Call Lambda/Cognito to update user's profile picture attribute with the new S3 URL.
        alert(`(API Placeholder) Uploading new profile picture: ${file.name}`);
        
        // Simulate upload:
        const reader = new FileReader();
        reader.onload = (e) => {
            updateProfile('profilePic', e.target.result); // Use Data URL for immediate preview
        };
        reader.readAsDataURL(file);
    });

    editProfilePicBtn.addEventListener('click', () => {
        profilePicUploadInput.click(); // Trigger the hidden file input
    });

    editNameBtn.addEventListener('click', () => {
        const newName = prompt("Enter your new full name:", currentUser.fullName);
        if (newName && newName.trim() !== currentUser.fullName) {
            updateProfile('fullName', newName.trim());
        }
    });

    editUsernameBtn.addEventListener('click', () => {
        const newUsername = prompt("Enter your new username:", currentUser.username);
        if (newUsername && newUsername.trim() !== currentUser.username) {
            updateProfile('username', newUsername.trim());
        }
    });

    // --- INITIAL RENDER ---
    renderProfile();
});