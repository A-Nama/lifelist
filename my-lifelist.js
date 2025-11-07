// my-lifelist.js (Complete Real Version)
document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://ec6s6x4r9i.execute-api.eu-north-1.amazonaws.com/prod'; // Your API URL
    let goals = [];
    const token = localStorage.getItem('idToken'); // Get the token

    // --- DOM ELEMENTS ---
    const personalGoalList = document.getElementById('personal-goal-list');
    const addGoalBtn = document.getElementById('add-goal-btn');
    const newGoalTextInput = document.getElementById('new-goal-text');
    const newGoalThemeSelect = document.getElementById('new-goal-theme');
    const usernameTitle = document.getElementById('username-title');
    const profileName = document.getElementById('profile-name');

    async function initializePage() {
        if (!token) {
            window.location.href = 'index.html'; // If no token, kick to login page
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            usernameTitle.textContent = payload.email; // Use email as username
            profileName.textContent = payload.email;

            await fetchMyGoals();
            renderPersonalGoals();
        } catch (error) {
            console.error('Initialization error:', error);
            localStorage.removeItem('idToken');
            window.location.href = 'index.html';
        }
    }

    async function fetchMyGoals() {
        try {
            const response = await fetch(`${API_URL}/goals`, {
                headers: { 'Authorization': token } // Add token to header
            });
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
            goalItem.dataset.goalId = goal.goalId;
            // Link to the journey page
            goalItem.innerHTML = `<a href="journey.html?goalId=${goal.goalId}">
                                    <input type="checkbox" ${goal.completed ? 'checked' : ''}>
                                    <span>${goal.title}</span>
                                  </a>`;
            personalGoalList.appendChild(goalItem);
        });
    }

    async function createNewGoal() {
        const title = newGoalTextInput.value.trim();
        const theme = newGoalThemeSelect.value;
        if (!title || !theme) return alert('Please write your goal and select a theme.');

        try {
            const response = await fetch(`${API_URL}/goals`, {
                method: 'POST',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, theme, description: "" })
            });
            if (!response.ok) throw new Error('Could not create goal.');

            const newGoal = await response.json();
            goals.push(newGoal);
            renderPersonalGoals();
            newGoalTextInput.value = '';
            newGoalThemeSelect.value = '';
        } catch (error) {
            console.error('Failed to create goal:', error);
            alert('Could not save your goal.');
        }
    }

    async function updateGoalStatus(goalId, isCompleted) {
        try {
            // Use the correct API Gateway path you defined
            await fetch(`${API_URL}/goals/${goalId}`, {
                method: 'PUT',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: isCompleted })
            });
            const goalToUpdate = goals.find(g => g.goalId === goalId);
            if(goalToUpdate) goalToUpdate.completed = isCompleted;
        } catch (error) {
            console.error('Failed to update goal:', error);
            alert('Could not update your goal.');
        }
    }

    addGoalBtn.addEventListener('click', createNewGoal);

    personalGoalList.addEventListener('click', (event) => {
        if (event.target.type === 'checkbox') {
            event.preventDefault();
            const goalItem = event.target.closest('.goal-item');
            const goalId = goalItem.dataset.goalId;
            const isCompleted = event.target.checked;
            goalItem.classList.toggle('completed', isCompleted);
            updateGoalStatus(goalId, isCompleted);
        }
    });

    await initializePage();
});