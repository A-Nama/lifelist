document.addEventListener('DOMContentLoaded', () => {
    // --- MOCK DATABASE (This will come from your AWS services) ---
    // This object simulates a database of all users and their goals.
    const allUsersData = {
        'user-001': {
            username: "_ro_han",
            fullName: "Rohan",
            profilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974',
            goals: [
                { id: 'rh-1', title: 'I want to see the Northern Lights', completed: true },
                { id: 'rh-2', title: 'I want to learn how to bake sourdough bread', completed: false },
            ]
        },
        'user-002': {
            username: "hanaaaaaan_",
            fullName: "Hanan",
            profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974',
            goals: [
                { id: 'hn-1', title: 'I want to run a marathon', completed: false },
                { id: 'hn-2', title: 'I want to visit every continent', completed: false },
                { id: 'hn-3', title: 'I want to publish a book', completed: true },
            ]
        },
        'user-003': {
            username: "rafa___",
            fullName: "Rafa",
            profilePic: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1974',
            goals: [
                { id: 'rf-1', title: 'I want to learn salsa dancing', completed: true },
            ]
        },
        'user-004': {
            username: "ishaaa__",
            fullName: "Isha",
            profilePic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1974',
            goals: [
                { id: 'is-1', title: 'I want to build a PC from scratch', completed: false },
                { id: 'is-2', title: 'I want to go scuba diving in the Great Barrier Reef', completed: true },
            ]
        }
    };

    // --- DOM ELEMENTS ---
    const usernameTitle = document.getElementById('username-title');
    const profileImage = document.getElementById('profile-image');
    const profileName = document.getElementById('profile-name');
    const personalGoalList = document.getElementById('personal-goal-list');
    const mainContent = document.querySelector('.lifelist-container');

    // --- FUNCTIONS ---

    const renderUserProfile = (user) => {
        // Update the sidebar with the user's information
        usernameTitle.textContent = user.username;
        profileImage.style.backgroundImage = `url('${user.profilePic}')`;
        profileName.textContent = user.fullName;

        // Render the user's goals
        personalGoalList.innerHTML = ''; // Clear any previous content
        if (user.goals.length === 0) {
            personalGoalList.innerHTML = `<p style="font-family: 'Caveat', cursive; font-size: 1.4rem;">This user hasn't added any goals yet.</p>`;
            return;
        }

        user.goals.forEach(goal => {
            const goalItem = document.createElement('div');
            goalItem.className = `goal-item ${goal.completed ? 'completed' : ''}`;
            // NOTE: Checkboxes are 'disabled' because this is a read-only view
            goalItem.innerHTML = `
                <input type="checkbox" ${goal.completed ? 'checked' : ''} disabled>
                <span>${goal.title}</span>
            `;
            personalGoalList.appendChild(goalItem);
        });
    };

    // --- INITIAL PAGE LOAD LOGIC ---

    // Get the user ID from the URL (e.g., view-profile.html?user=user-001)
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('user');

    if (userId && allUsersData[userId]) {
        // If a valid user ID is found, get their data from our mock database
        const userData = allUsersData[userId];
        // Render their profile
        renderUserProfile(userData);
    } else {
        // If no user ID is found or it's invalid, show an error message
        mainContent.innerHTML = `<h2 style="text-align: center; width: 100%; font-family: 'Caveat', cursive;">User not found.</h2>`;
    }
});