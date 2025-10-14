document.addEventListener('DOMContentLoaded', () => {
    // --- MOCK DATA (This will come from your AWS Lambda/DynamoDB) ---
    let communityPosts = [
        {
            id: 'post-1',
            userId: 'user-001',
            username: '_ro_han',
            profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
            goalTitle: 'Traveled to Japan!',
            storyTitle: 'Cherry Blossoms and Sushi Dreams',
            story: 'Finally achieved my dream of visiting Japan! The culture, the food, the sights... truly magical. Tokyo was a vibrant metropolis, and Kyoto offered such serene beauty. Can\'t wait for my next adventure!',
            imageUrl: 'https://images.unsplash.com/photo-1528164344705-477894bb3c52?q=80&w=2070',
            theme: 'Travel',
            timestamp: '2024-10-20T10:00:00Z'
        },
        {
            id: 'post-2',
            userId: 'user-004',
            username: 'ishaaa__',
            profilePic: 'https://randomuser.me/api/portraits/women/12.jpg',
            goalTitle: 'Completed "Learn to Play Guitar"',
            storyTitle: 'From Zero to Chords: My Guitar Journey',
            story: 'It took practice, but I can finally strum a few songs! Starting with basic chords was tough, but consistency paid off. Feeling so proud of this new skill!',
            imageUrl: 'https://images.unsplash.com/photo-1510915228389-411a61c17621?q=80&w=2070',
            theme: 'Skill',
            timestamp: '2024-10-18T15:30:00Z'
        },
        {
            id: 'post-3',
            userId: 'user-002',
            username: 'hanaaaaaan_',
            profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
            goalTitle: 'Explored abandoned house!',
            storyTitle: 'Echoes of the Past: An Urban Exploration',
            story: 'Found this incredible abandoned mansion! The atmosphere was eerie but fascinating. Every room told a silent story. Definitely an adrenaline rush!',
            imageUrl: 'https://images.unsplash.com/photo-1594191307613-2616239f1ff4?q=80&w=2070',
            theme: 'Adrenaline rush',
            timestamp: '2024-10-15T09:10:00Z'
        }
    ];

    const themes = [
        'All Themes', 'Cinema', 'Travel', 'Adrenaline rush', 'Education', 'Cook', 'Skill', 'Create', 'General'
    ];

    // --- DOM ELEMENTS ---
    const communityPostsContainer = document.getElementById('community-posts-container');
    const themeFilterSelect = document.getElementById('theme-filter');
    const logoutBtn = document.getElementById('logout-btn');
    const profilePicThumb = document.querySelector('.profile-pic-thumb');

    // --- INITIALIZATIONS ---
    // In a real app, you'd get this from your authentication service (Cognito).
    const currentUserProfilePic = "https://images.unsplash.com/photo-1509233632946-334a5218145a?q=80&w=1974";
    if (profilePicThumb) {
        profilePicThumb.style.backgroundImage = `url('${currentUserProfilePic}')`;
    }

    // Populate the theme filter dropdown
    themes.forEach(theme => {
        const option = document.createElement('option');
        // Create a URL-friendly value (e.g., "Adrenaline rush" -> "adrenaline-rush")
        option.value = theme.toLowerCase().replace(/\s/g, '-');
        option.textContent = theme;
        themeFilterSelect.appendChild(option);
    });

    // --- FUNCTIONS ---

    /**
     * Renders community posts, optionally filtering by a theme.
     * @param {string} filterTheme - The theme to filter by (e.g., 'travel'). Defaults to 'all'.
     */
    const renderCommunityPosts = (filterTheme = 'all') => {
        communityPostsContainer.innerHTML = ''; // Clear previous posts

        const filteredPosts = filterTheme === 'all'
            ? communityPosts
            : communityPosts.filter(post => post.theme.toLowerCase().replace(/\s/g, '-') === filterTheme);

        if (filteredPosts.length === 0) {
            communityPostsContainer.innerHTML = '<p class="handwritten-text" style="font-size:1.2rem; color:#666; text-align:center; margin-top:2rem;">No posts found for this theme.</p>';
            return;
        }

        // Sort posts by newest first
        filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        filteredPosts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'community-post-card';
            postCard.innerHTML = `
                <div class="post-header">
                    <div class="post-profile-pic" style="background-image: url('${post.profilePic}');"></div>
                    <span class="post-username">${post.username}</span>
                </div>
                <h3 class="post-title">${post.storyTitle || post.goalTitle}</h3>
                ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.storyTitle}" class="post-image">` : ''}
                <p class="post-story">${post.story}</p>
                ${post.theme ? `<span class="post-theme">${post.theme}</span>` : ''}
            `;
            communityPostsContainer.appendChild(postCard);
        });
    };

    // --- EVENT LISTENERS ---

    // Update the feed when the user changes the filter
    themeFilterSelect.addEventListener('change', (e) => {
        renderCommunityPosts(e.target.value);
    });

    // Handle user logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // --- API CALL PLACEHOLDER (Cognito Sign Out) ---
            alert('(API Placeholder) Logging out...');
            window.location.href = 'index.html';
        });
    }

    // --- INITIAL PAGE LOAD LOGIC ---

    // Check the URL for a 'theme' parameter (e.g., community.html?theme=travel)
    const params = new URLSearchParams(window.location.search);
    const themeFromUrl = params.get('theme');

    // If a theme is found in the URL, filter by it immediately. Otherwise, show all posts.
    if (themeFromUrl) {
        themeFilterSelect.value = themeFromUrl; // Set the dropdown to match the theme
        renderCommunityPosts(themeFromUrl);     // Render the filtered posts
    } else {
        renderCommunityPosts(); // Render all posts by default
    }
});