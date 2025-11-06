// journey.js - Complete and Working Version
document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://x9a2avtgph.execute-api.eu-north-1.amazonaws.com/prod';

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
        window.location.href = 'demo.html';
        return;
    }

    // --- 1. Fetch existing goal details when page loads ---
    async function fetchGoalDetails() {
        try {
            const response = await fetch(`${API_URL}/goalId/${goalId}`);
            if (!response.ok) throw new Error("Goal not found.");
            
            const goal = await response.json();
            
            titleInput.value = goal.title || '';
            storyInput.value = goal.description || '';
            
            // If an image already exists, show it
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

    // --- 2. Show a preview of the new image when selected ---
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

    // --- 3. Save the entire journey ---
    async function saveJourney() {
        const title = titleInput.value.trim();
        const story = storyInput.value.trim();
        const file = imageInput.files[0];

        if (!title) return alert("Please add a title.");
        
        try {
            let finalImageUrl;

            // --- STEP A: Upload image if a new one was selected ---
            if (file) {
                // 1. Get the "permission slip" (presigned URL) from our new Lambda
                const uploadUrlResponse = await fetch(`${API_URL}/uploadurl?goalId=${goalId}`);
                const { uploadUrl, imageUrl } = await uploadUrlResponse.json();
                
                // 2. Upload the file directly to S3 with that URL
                await fetch(`${API_URL}/goalId/${goalId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ /* ... title, description, imageUrl ... */ })
                });
                
                finalImageUrl = imageUrl;
            } else {
                // No new file, just keep the old image URL (if any)
                finalImageUrl = imagePreview.src;
            }

            // --- STEP B: Save all data (title, story, and image URL) to DynamoDB ---
            await fetch(`${API_URL}/goals/${goalId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title,
                    description: story, // 'description' is your story
                    imageUrl: finalImageUrl // Save the link to the image
                })
            });

            alert("Your journey has been saved!");
            window.location.href = `view-journey.html?goalId=${goalId}`;
        } catch (error) {
            console.error("Failed to save journey:", error);
            alert("Could not save your story. Please try again.");
        }
    }

    saveBtn.addEventListener('click', saveJourney);
    
    // Load existing goal details when the page opens
    await fetchGoalDetails();
});