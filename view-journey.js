// view-journey.js (Complete Real Version)
document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://ec6s6x4r9i.execute-api.eu-north-1.amazonaws.com/prod';
    const token = localStorage.getItem('idToken'); // Get the token

    if (!token) window.location.href = 'index.html'; // Kick to login

    const titleElement = document.getElementById('journey-title');
    const imageElement = document.getElementById('journey-image');
    const storyElement = document.getElementById('journey-story');

    const urlParams = new URLSearchParams(window.location.search);
    const goalId = urlParams.get('goalId');

    if (!goalId) {
        titleElement.textContent = "Error: Goal Not Found";
        return;
    }

    async function fetchGoalDetails() {
        try {
            const response = await fetch(`${API_URL}/goals/${goalId}`, {// Use correct path
                headers: { 'Authorization': token }
            });
            if (!response.ok) throw new Error("Server error.");
            
            const goal = await response.json();
            titleElement.textContent = goal.title || "Untitled Journey";
            storyElement.textContent = goal.description || "No story added yet.";
            
            if (goal.imageUrl) {
                imageElement.src = goal.imageUrl;
                imageElement.classList.remove('hidden');
            } else {
                imageElement.parentElement.classList.add('hidden'); 
            }
        } catch (error) {
            console.error("Failed to fetch goal details:", error);
            titleElement.textContent = "Error Loading Journey";
        }
    }

    await fetchGoalDetails();
});