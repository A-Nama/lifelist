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
    const imageList = document.getElementById('image-list');
    const imagePlaceholder = document.getElementById('image-placeholder');

    const urlParams = new URLSearchParams(window.location.search);
    const goalId = urlParams.get('goalId');

    if (!goalId) {
        alert("No goal specified!");
        window.location.href = 'my-lifelist.html'; 
        return;
    }

    // arrays to track images
    const existingImageUrls = []; // strings from server
    const newFiles = []; // File objects selected by user

    // render thumbnails from both existingImageUrls and newFiles
    function renderImageList() {
        // clear list but keep placeholder logic
        imageList.innerHTML = '';
        const allCount = existingImageUrls.length + newFiles.length;
        if (allCount === 0) {
            // show placeholder
            const ph = document.createElement('div');
            ph.id = 'image-placeholder';
            ph.className = 'image-placeholder';
            ph.innerHTML = '<span class="camera-icon">📷</span>';
            imageList.appendChild(ph);
        } else {
            // render existing image urls first
            existingImageUrls.forEach((url, idx) => {
                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                const img = document.createElement('img');
                img.src = url;
                img.className = 'thumb';
                img.alt = `img-${idx}`;
                wrapper.appendChild(img);

                // allow removing existing image
                const rem = document.createElement('div');
                rem.className = 'thumb-remove';
                rem.textContent = '×';
                rem.title = 'Remove image';
                rem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    existingImageUrls.splice(idx, 1);
                    renderImageList();
                });
                wrapper.appendChild(rem);

                imageList.appendChild(wrapper);
            });

            // then render new selected files
            newFiles.forEach((file, idx) => {
                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                const img = document.createElement('img');
                img.className = 'thumb';
                img.alt = `new-${idx}`;
                wrapper.appendChild(img);

                const reader = new FileReader();
                reader.onload = (e) => img.src = e.target.result;
                reader.readAsDataURL(file);

                const rem = document.createElement('div');
                rem.className = 'thumb-remove';
                rem.textContent = '×';
                rem.title = 'Remove image';
                rem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    newFiles.splice(idx, 1);
                    renderImageList();
                });
                wrapper.appendChild(rem);

                imageList.appendChild(wrapper);
            });
        }
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
            
            // populate images if any (support array or single url)
            if (goal.imageUrls && Array.isArray(goal.imageUrls)) {
                existingImageUrls.splice(0, existingImageUrls.length, ...goal.imageUrls);
            } else if (goal.imageUrl) {
                existingImageUrls.splice(0, existingImageUrls.length, goal.imageUrl);
            }
            renderImageList();
        } catch (error) {
            console.error("Failed to fetch goal details:", error);
            alert("Could not load your journey details.");
        }
    }

    // --- handle file selection (multiple) ---
    imageInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files || []);
        // append files to newFiles
        files.forEach(f => newFiles.push(f));
        // reset input so same file can be reselected later
        imageInput.value = '';
        renderImageList();
    });

    // helper to get upload URL for a single file and PUT it
    async function uploadSingleFile(file) {
        // request an upload URL for each file
        const uploadUrlResponse = await fetch(`${API_URL}/goals/${goalId}/upload-url`, { 
            headers: { 'Authorization': token }
        });
        if (!uploadUrlResponse.ok) throw new Error('Could not get upload URL from API.');
        const { uploadUrl, imageUrl } = await uploadUrlResponse.json();

        // PUT to S3
        const s3UploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { "Content-Type": file.type }
        });
        if (!s3UploadResponse.ok) throw new Error('File upload to S3 failed.');

        // server returned imageUrl alongside uploadUrl; if not, rely on returned imageUrl variable
        return imageUrl;
    }

    // --- This saves your changes (now supports multiple images) ---
    async function saveJourney() {
        const title = titleInput.value.trim();
        const story = storyInput.value.trim();

        if (!title) return alert("Please add a title.");
        
        try {
            // upload new files sequentially and collect their URLs
            const uploadedUrls = [];
            for (const file of newFiles) {
                const url = await uploadSingleFile(file);
                uploadedUrls.push(url);
            }

            // combine existing and uploaded
            const finalImageUrls = [...existingImageUrls, ...uploadedUrls];

            // prepare payload: keep backward compatibility with imageUrl single-field
            const payload = {
                title: title,
                description: story
            };
            if (finalImageUrls.length === 1) {
                payload.imageUrl = finalImageUrls[0];
            } else if (finalImageUrls.length > 1) {
                payload.imageUrls = finalImageUrls;
            }

            // --- 4. THIS IS THE CORRECTED URL ---
            const updateResp = await fetch(`${API_URL}/goals/${goalId}`, { 
                method: 'PUT',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!updateResp.ok) {
                const txt = await updateResp.text();
                throw new Error(`Update failed (${updateResp.status}): ${txt}`);
            }

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
