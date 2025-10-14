document.addEventListener('DOMContentLoaded', async () => {
    // --- CONFIGURATION ---
    const API_URL = 'https://x9a2avtgph.execute-api.eu-north-1.amazonaws.com/prod'; 

    let goals = [];
    let currentUser = {};

    // --- DOM ELEMENTS ---
    const personalGoalList = document.getElementById('personal-goal-list');
    const addGoalBtn = document.getElementById('add-goal-btn');
    const newGoalTextInput = document.getElementById('new-goal-text');
    const usernameTitle = document.getElementById('username-title');
    const profileName = document.getElementById('profile-name');

    async function initializePage() {
        const token = localStorage.getItem('idToken');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        try {
            // Decode the token to get user info without needing a separate API call
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUser = { username: payload['cognito:username'], id: payload.sub };
            usernameTitle.textContent = currentUser.username;
            profileName.textContent = currentUser.username; // Use username as name for now
            await fetchMyGoals();
        } catch (error) {
            console.error('Authentication error:', error);
            localStorage.removeItem('idToken'); // Clean up bad token
            window.location.href = 'index.html';
        }
    }

    function renderPersonalGoals() {
        personalGoalList.innerHTML = '';
        if (goals.length > 0) {
           goals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        goals.forEach(goal => {
            const goalItem = document.createElement('div');
            goalItem.className = `goal-item ${goal.completed ? 'completed' : ''}`;
            goalItem.innerHTML = `<input type="checkbox" data-goal-id="${goal.goalId}" ${goal.completed ? 'checked' : ''}><span>${goal.title}</span>`;
            personalGoalList.appendChild(goalItem);
        });
    }

    async function fetchMyGoals() {
        const token = localStorage.getItem('idToken');
        try {
            const response = await fetch(`${API_URL}/goals`, {
                headers: { 'Authorization': token }
            });
            if (!response.ok) throw new Error('Could not fetch goals.');
            goals = await response.json();
            renderPersonalGoals();
        } catch (error) { 
            console.error('Failed to fetch goals:', error);
            // Optionally show an error message to the user on the page
        }
    }

    async function createNewGoal() {
        const title = newGoalTextInput.value.trim();
        if (!title) return;
        const token = localStorage.getItem('idToken');
        try {
            const response = await fetch(`${API_URL}/goals`, {
                method: 'POST',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title, description: "" })
            });
            if (!response.ok) throw new Error('Could not create goal.');
            
            const newGoal = await response.json();
            goals.push(newGoal); // Add the new goal returned from the API
            renderPersonalGoals();
            newGoalTextInput.value = '';
        } catch (error) {
            console.error('Failed to create goal:', error);
            alert('Could not save your goal. Please try again.');
        }
    }

    // --- EVENT LISTENERS ---
    addGoalBtn.addEventListener('click', createNewGoal);

    // Initial page load
    initializePage();
});