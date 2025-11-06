// FULLY INTERACTIVE DEMO-READY VERSION
document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://x9a2avtgph.execute-api.eu-north-1.amazonaws.com/prod';
    let goals = [];

    const personalGoalList = document.getElementById('personal-goal-list');
    const addGoalBtn = document.getElementById('add-goal-btn');
    const newGoalTextInput = document.getElementById('new-goal-text');
    const newGoalThemeSelect = document.getElementById('new-goal-theme');
    const usernameTitle = document.getElementById('username-title');
    const profileName = document.getElementById('profile-name');
    
    async function initializePageForDemo() {
        usernameTitle.textContent = "Demo User";
        profileName.textContent = "Demo User";
        await fetchMyGoals();
        renderPersonalGoals();
    }

    async function fetchMyGoals() {
        try {
            const response = await fetch(`${API_URL}/goals`);
            if (!response.ok) throw new Error('Could not fetch goals.');
            goals = await response.json();
        } catch (error) {
            console.error("Failed to fetch goals:", error);
            personalGoalList.innerHTML = "<li>Could not load goals.</li>";
        }
    }

    function renderPersonalGoals() {
    personalGoalList.innerHTML = '';
    goals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    goals.forEach(goal => {
        const goalItem = document.createElement('div');
        goalItem.className = `goal-item ${goal.completed ? 'completed' : ''}`;
        goalItem.dataset.goalId = goal.goalId; // Store goalId on the element

        // This makes the whole item a link to the journey page
        goalItem.innerHTML = `<a href="journey.html?goalId=${goal.goalId}">
                                <input type="checkbox" ${goal.completed ? 'checked' : ''}>
                                <span>${goal.title}</span>
                              </a>`;
        personalGoalList.appendChild(goalItem);
    });
}


// In demo.js, add this new click handler for the checkboxes
    personalGoalList.addEventListener('click', (event) => {
        // This logic makes the checkbox work even though it's inside a link
        if (event.target.type === 'checkbox') {
            event.preventDefault(); // Stop the link from navigating
            
            const goalItem = event.target.closest('.goal-item');
            const goalId = goalItem.dataset.goalId;
            const isCompleted = event.target.checked;
            
            goalItem.classList.toggle('completed', isCompleted);
            updateGoalStatus(goalId, isCompleted);
        }
    });

    async function createNewGoal() {
        const title = newGoalTextInput.value.trim();
        const theme = newGoalThemeSelect.value;
        if (!title || !theme) return alert('Please write your goal and select a theme.');

        try {
            const response = await fetch(`${API_URL}/goals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, theme, description: "" }) 
            });
            if (!response.ok) throw new Error('Could not create goal.');
            
            const newGoal = await response.json();
            goals.push(newGoal);
            renderPersonalGoals(); // Redraw the list with the new goal
            newGoalTextInput.value = '';
            newGoalThemeSelect.value = '';
        } catch (error) {
            console.error('Failed to create goal:', error);
            alert('Could not save your goal.');
        }
    }

    // --- NEW FUNCTION TO UPDATE A GOAL ---
    async function updateGoalStatus(goalId, isCompleted) {
        try {
            await fetch(`${API_URL}/goalId/${goalId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: isCompleted })
            });
            // Also update our local 'goals' array so the list stays correct
            const goalToUpdate = goals.find(g => g.goalId === goalId);
            if(goalToUpdate) goalToUpdate.completed = isCompleted;

        } catch (error) {
            console.error('Failed to update goal:', error);
            alert('Could not update your goal.');
        }
    }

    addGoalBtn.addEventListener('click', createNewGoal);

    // --- NEW EVENT LISTENER FOR CHECKBOXES ---
    personalGoalList.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            const goalItem = event.target.closest('.goal-item');
            const goalId = goalItem.dataset.goalId;
            const isCompleted = event.target.checked;
            
            goalItem.classList.toggle('completed', isCompleted);
            updateGoalStatus(goalId, isCompleted);
        }
    });
    
    // Run the app!
    await initializePageForDemo();
});