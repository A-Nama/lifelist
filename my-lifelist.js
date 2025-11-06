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
    const themeMenuToggle = document.getElementById('theme-menu-toggle');
    const themeSubmenu = document.getElementById('theme-submenu');
    const themeList = document.getElementById('theme-submenu');
    const newGoalThemeSelect = document.getElementById('new-goal-theme');

    if (themeMenuToggle) {
        themeMenuToggle.addEventListener('click', (e) => {
            // Prevent the main link from navigating
            e.preventDefault(); 
            // Stop the click from propagating to other elements
            e.stopPropagation(); 

            // Toggle the class on the parent li to rotate the arrow
            themeMenuToggle.classList.toggle('submenu-open');
            // Toggle the class on the submenu ul to trigger the animation
            themeSubmenu.classList.toggle('open');
        });
    }

    themeList.addEventListener('click', (e) => {
    e.preventDefault(); 

        if (e.target.matches('a.theme-link')) {
            const selectedTheme = e.target.dataset.theme;

            document.querySelectorAll('.theme-link').forEach(link => {
                link.classList.remove('active');
            });
            e.target.classList.add('active');

            renderPersonalGoals(selectedTheme);
        }
    });


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


   function renderPersonalGoals(filterTheme = 'all') {
        personalGoalList.innerHTML = '';

        const filteredGoals = goals.filter(goal => {
            if (filterTheme === 'all') {
                return true; // Show all goals
            }
            // This now correctly checks the 'theme' property of the goal object
            return goal.theme === filterTheme;
        });

        if (filteredGoals.length > 0) {
            filteredGoals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        filteredGoals.forEach(goal => {
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
        const theme = newGoalThemeSelect.value; // <-- Get selected theme

        if (!title || !theme) { // <-- Add validation for theme
            alert('Please write your goal and select a theme.');
            return;
        }
        const token = localStorage.getItem('idToken');
        try {
            const response = await fetch(`${API_URL}/goals`, {
                method: 'POST',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                // --- THIS IS THE KEY CHANGE ---
                // Add the 'theme' to the request body
                body: JSON.stringify({ title: title, theme: theme, description: "" }) 
            });
            if (!response.ok) throw new Error('Could not create goal.');
            
            const newGoal = await response.json();
            goals.push(newGoal);
            renderPersonalGoals(); // Re-render the full list
            newGoalTextInput.value = '';
            newGoalThemeSelect.value = ''; // Reset the dropdown
        } catch (error) {
            console.error('Failed to create goal:', error);
            alert('Could not save your goal. Please try again.');
        }
    }

    // --- EVENT LISTENERS ---
    addGoalBtn.addEventListener('click', createNewGoal);

    themeSubmenu.addEventListener('click', (e) => {
        e.preventDefault(); 

        if (e.target.matches('a.theme-link')) {
            const selectedTheme = e.target.dataset.theme;

            document.querySelectorAll('.theme-link').forEach(link => {
                link.classList.remove('active');
            });
            e.target.classList.add('active');

            renderPersonalGoals(selectedTheme);
        }
    });

    // Initial page load
    initializePage();
});