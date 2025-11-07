// journey.js (Complete Real Version - CORRECTED)
document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. MAKE SURE THIS IS YOUR API GATEWAY URL
    const API_URL = 'https://ec6s6x4r9i.execute-api.eu-north-1.amazonaws.com/prod'; 
    const token = localStorage.getItem('idToken'); 

    if (!token) window.location.href = 'index.html'; 

    // --- Get HTML Elements ---
    const titleInput = document.getElementById('title-input');
    const storyInput = document.getElementById('story-input');
    const saveBtn = document.getElementById('save-journey-btn');
    const imageInput = document.getElementById('image-input');
    const imagePreview = document.getElementById('image-preview');
    const imagePlaceholder = document.getElementById('image-placeholder');

    const urlParams = new URLSearchParams(window.location.search);
    const goalId = urlParams.get('goalId');

    if (!goalId) {
        alert("No goal specified!");
        window.location.href = 'my-lifelist.html'; 
        return;
    }

    // --- This function fetches the goal details ---
    async function fetchGoalDetails() {
        try {
            // --- 2. THIS IS THE CORRECTED URL ---
            const response = await fetch(`${API_URL}/goals/${goalId}`, { 
                headers: { 'Authorization': token }
            });
            
            if (!response.ok) {
                console.error("Fetch failed with status:", response.status);
                throw new Error("Goal not found.");
            }
            
            const goal = await response.json();
            
            // This will now fill in your "go to italy" title
            titleInput.value = goal.title || '';
            storyInput.value = goal.description || '';
            
            if (goal.imageUrl) {
                imagePreview.src = goal.imageUrl;
                imagePreview.classList.remove('hidden');
                imagePlaceholder.classList.add('hidden');
            }
        } catch (error) {
            console.error("Failed to fetch goal details:", error);
            alert("Could not load your journey details.");
        }
    }

    // --- This handles the image preview ---
    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => { 
                imagePreview.src = e.target.result; 
                imagePreview.classList.remove('hidden'); 
                imagePlaceholder.classList.add('hidden'); 
            };
            reader.readAsDataURL(file);
        }
    });

    // --- This saves your changes ---
    async function saveJourney() {
        const title = titleInput.value.trim();
        const story = storyInput.value.trim();
        const file = imageInput.files[0];

        if (!title) return alert("Please add a title.");
        
        try {
            let finalImageUrl = imagePreview.src; // Keep old image if no new one

            if (file) {
                // --- 3. THIS IS THE CORRECTED URL ---
                const uploadUrlResponse = await fetch(`${API_URL}/goals/${goalId}/upload-url`, { 
                    headers: { 'Authorization': token }
                });
                if (!uploadUrlResponse.ok) throw new Error('Could not get upload URL from API.');
                
                const { uploadUrl, imageUrl } = await uploadUrlResponse.json();
                
                const s3UploadResponse = await fetch(uploadUrl, {
                    method: 'PUT',
                    body: file,
                    headers: { "Content-Type": file.type }
                });
                
                if (!s3UploadResponse.ok) throw new Error('File upload to S3 failed.');
                
                finalImageUrl = imageUrl;
            }

            // --- 4. THIS IS THE CORRECTED URL ---
            await fetch(`${API_URL}/goals/${goalId}`, { 
                method: 'PUT',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title,
                    description: story,
                    imageUrl: finalImageUrl 
                })
            });

            alert("Your journey has been saved!");
            window.location.href = `view-journey.html?goalId=${goalId}`; 
        } catch (error) {
            console.error("Failed to save journey:", error);
            alert(`Could not save your story. Error: ${error.message}`);
        }
    }

    saveBtn.addEventListener('click', saveJourney);
    
    // This runs when the page loads
    await fetchGoalDetails();
});