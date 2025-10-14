document.addEventListener('DOMContentLoaded', () => {
    // --- MOCK DATA (This will come from your AWS services) ---
    const currentUser = {
        username: "USERNAME",
        fullName: "YourName",
        profilePic: "https://images.unsplash.com/photo-1509233632946-334a5218145a?q=80&w=1974",
        id: "user-abc"
    };

    let goals = [
        { id: 'goal-1', title: 'I wanna visit Meghalaya', completed: true },
        { id: 'goal-2', title: 'I wanna go to kashmir', completed: false },
        { id: 'goal-3', title: 'I wanna learn how to make perfect Kerala Poratta', completed: true },
        { id: 'goal-4', title: 'I wanna go to amusement park and do all the crazy rides', completed: false },
        { id: 'goal-5', title: 'I wanna do a solo trip to a foreign country', completed: false },
        { id: 'goal-6', title: 'I wanna learn how to swim', completed: false },
        { id: 'goal-7', title: 'I wanna learn how to built a paper rocket', completed: false },
        { id: 'goal-8', title: 'I wanna explore a abandoned house with my friends', completed: true }
    ];

    // --- DOM ELEMENTS ---
    const usernameTitle = document.getElementById('username-title');
    const profileImage = document.getElementById('profile-image');
    const profileName = document.getElementById('profile-name');
    const personalGoalList = document.getElementById('personal-goal-list');
    const newGoalTextInput = document.getElementById('new-goal-text');
    const addGoalBtn = document.getElementById('add-goal-btn');
    const shareStoryOpenModalBtn = document.getElementById('share-story-open-modal');
    
    // Modal Elements
    const shareJourneyModal = document.getElementById('share-journey-modal');
    const shareModalProfilePic = document.getElementById('share-modal-profile-pic');
    const storyImageInput = document.getElementById('story-image-input');
    const storyImagePreview = document.getElementById('story-image-preview');
    const sharePostBtn = document.getElementById('share-post-btn');
    const closeButtons = document.querySelectorAll('.modal .close-btn, #share-modal-back-btn');

    let currentSharedGoal = null; // To keep track of which goal is being shared

    // --- INITIALIZE UI ---
    usernameTitle.textContent = currentUser.username;
    profileImage.style.backgroundImage = `url('${currentUser.profilePic}')`;
    profileName.textContent = currentUser.fullName;
    shareModalProfilePic.style.backgroundImage = `url('${currentUser.profilePic}')`;

    // --- FUNCTIONS ---

    const renderPersonalGoals = () => {
        personalGoalList.innerHTML = ''; // Clear the list before re-rendering
        goals.forEach(goal => {
            const goalItem = document.createElement('div');
            goalItem.className = `goal-item ${goal.completed ? 'completed' : ''}`;
            goalItem.innerHTML = `
                <input type="checkbox" data-goal-id="${goal.id}" ${goal.completed ? 'checked' : ''}>
                <span data-goal-id="${goal.id}">${goal.title}</span>
            `;
            
            const checkbox = goalItem.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => toggleGoalCompletion(goal.id));
            
            personalGoalList.appendChild(goalItem);
        });
    };

    const toggleGoalCompletion = (goalId) => {
        const goal = goals.find(g => g.id === goalId);
        if (goal) {
            goal.completed = !goal.completed;
            // --- API CALL PLACEHOLDER (Update Goal in DynamoDB) ---
            alert(`(API Placeholder) Toggled "${goal.title}" to ${goal.completed}`);
            
            renderPersonalGoals();

            // If a goal is checked as complete, open the share modal
            if (goal.completed) {
                currentSharedGoal = goal;
                shareJourneyModal.classList.remove('hidden');
            }
        }
    };

    // --- EVENT LISTENERS ---

    addGoalBtn.addEventListener('click', () => {
        const title = newGoalTextInput.value.trim();
        if (!title) return; // Do nothing if input is empty

        const newGoal = {
            id: `goal-${Date.now()}`,
            title: title,
            completed: false
        };

        // --- API CALL PLACEHOLDER (Create Goal in DynamoDB) ---
        alert(`(API Placeholder) Adding new goal: "${title}"`);
        goals.unshift(newGoal); // Add new goal to the top of the list
        renderPersonalGoals();
        newGoalTextInput.value = '';
    });

    shareStoryOpenModalBtn.addEventListener('click', () => {
        // This button could open the modal for the most recently completed goal, for example.
        currentSharedGoal = goals.find(g => g.completed);
        if (currentSharedGoal) {
            shareJourneyModal.classList.remove('hidden');
        } else {
            alert("Complete a goal first to share your story!");
        }
    });
    
    // Listeners to close the modal
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            shareJourneyModal.classList.add('hidden');
        });
    });

    // Share post button inside the modal
    sharePostBtn.addEventListener('click', () => {
        // --- API CALL PLACEHOLDER (Create community post in DynamoDB & upload image to S3) ---
        alert(`(API Placeholder) Sharing story for "${currentSharedGoal.title}"`);
        shareJourneyModal.classList.add('hidden');
        // You would clear the modal form fields here
    });

    // Preview image in the share modal
    storyImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                storyImagePreview.style.backgroundImage = `url(${event.target.result})`;
                storyImagePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    // --- INITIAL RENDER ---
    renderPersonalGoals();
});