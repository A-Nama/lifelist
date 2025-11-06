document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://x9a2avtgph.execute-api.eu-north-1.amazonaws.com/prod'; // Your API URL

    const titleElement = document.getElementById('journey-title');
    const imageElement = document.getElementById('journey-image');
    const storyElement = document.getElementById('journey-story');

    // Get the goalId from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const goalId = urlParams.get('goalId');

    if (!goalId) {
        titleElement.textContent = "Error: Goal Not Found";
        storyElement.textContent = "No goal ID was provided in the URL.";
        return;
    }

    // Fetch the specific goal details
    async function fetchGoalDetails() {
        try {
            // Use the simplified API path
            const response = await fetch(`${API_URL}/goalId/${goalId}`);; 
            
            if (!response.ok) {
                 if (response.status === 404) {
                    throw new Error("Goal not found in the database.");
                 } else {
                    throw new Error(`Server error: ${response.status}`);
                 }
            }
            
            const goal = await response.json();
            
            // Display the data
            titleElement.textContent = goal.title || "Untitled Journey";
            storyElement.textContent = goal.description || "No story added yet.";
            
            if (goal.imageUrl) {
                imageElement.src = goal.imageUrl;
                imageElement.classList.remove('hidden');
            } else {
                // Optionally hide the image container if no image exists
                imageElement.parentElement.classList.add('hidden'); 
            }

        } catch (error) {
            console.error("Failed to fetch goal details:", error);
            titleElement.textContent = "Error Loading Journey";
            storyElement.textContent = `Could not load details for this goal. ${error.message}`;
        }
    }

    await fetchGoalDetails();
});