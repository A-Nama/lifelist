document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://ec6s6x4r9i.execute-api.eu-north-1.amazonaws.com/prod';
    const token = localStorage.getItem('idToken'); // Get the token

    if (!token) window.location.href = 'index.html'; // Kick to login

    const titleElement = document.getElementById('journey-title');
    const imageList = document.getElementById('image-list'); // changed: container for multiple images
    const storyElement = document.getElementById('journey-story');
    const imageContainer = document.querySelector('.journey-image-container');

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

            // build array of image URLs (support both imageUrl and imageUrls)
            const urls = [];
            if (Array.isArray(goal.imageUrls) && goal.imageUrls.length) {
                urls.push(...goal.imageUrls);
            } else if (goal.imageUrl) {
                // support a single string or comma-separated list
                if (typeof goal.imageUrl === 'string' && goal.imageUrl.includes(',')) {
                    goal.imageUrl.split(',').map(s => s.trim()).filter(Boolean).forEach(u => urls.push(u));
                } else {
                    urls.push(goal.imageUrl);
                }
            }

            // render thumbs or hide container if none
            imageList.innerHTML = '';
            if (urls.length === 0) {
                imageContainer.classList.add('hidden');
            } else {
                imageContainer.classList.remove('hidden');
                urls.forEach((u, i) => {
                    const img = document.createElement('img');
                    img.src = u;
                    img.alt = `journey-${i}`;
                    img.className = 'view-thumb';
                    imageList.appendChild(img);
                });
            }
        } catch (error) {
            console.error("Failed to fetch goal details:", error);
            titleElement.textContent = "Error Loading Journey";
        }
    }

    await fetchGoalDetails();
});
