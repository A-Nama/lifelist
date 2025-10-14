document.addEventListener('DOMContentLoaded', () => {
    // --- MOCK DATA (This will come from your AWS services) ---
    const currentUser = {
        username: "YourName",
        profilePic: "https://images.unsplash.com/photo-1509233632946-334a5218145a?q=80&w=1974", // Your main profile picture
        id: "user-abc"
    };

    const themes = [
        { name: 'Cinema', img: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1931' },
        { name: 'Travel', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070' },
        { name: 'Adrenaline rush', img: 'https://images.unsplash.com/photo-1534278931739-31a8a88ab606?q=80&w=1974' },
        { name: 'Education', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070' }
    ];

    const otherUsers = [
        { username: '_ro_han', profilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974', id: 'user-001' },
        { username: 'hanaaaaaan_', profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974', id: 'user-002' },
        { username: 'rafa___', profilePic: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1974', id: 'user-003' },
        { username: 'ishaaa__', profilePic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1974', id: 'user-004' }
    ];

    // --- DOM ELEMENTS ---
    const headerProfilePic = document.getElementById('header-profile-pic');
    const myLifelistCardImage = document.getElementById('my-lifelist-card-image');

    // --- INITIALIZE UI ---
    // Set the user's profile pictures in the header and on the main card
    headerProfilePic.style.backgroundImage = `url('${currentUser.profilePic}')`;
    myLifelistCardImage.style.backgroundImage = `url('${currentUser.profilePic}')`;

    // --- FUNCTIONS ---

    // Renders the themes section and adds click navigation
    const renderThemes = () => {
        const themeListContainer = document.querySelector('#theme-list .scroll-content');
        themeListContainer.innerHTML = '';
        themes.forEach(theme => {
            const themeCard = document.createElement('div');
            themeCard.className = 'theme-card';
            themeCard.innerHTML = `<img src="${theme.img}" alt="${theme.name}"><p>${theme.name}</p>`;
            
            // Navigate to the community page with the selected theme as a URL parameter
            themeCard.addEventListener('click', () => {
                const themeQuery = encodeURIComponent(theme.name.toLowerCase().replace(/\s/g, '-'));
                window.location.href = `community.html?theme=${themeQuery}`;
            });
            themeListContainer.appendChild(themeCard);
        });
    };

    // Renders other users and adds click navigation
    const renderOtherUsers = () => {
        const userListContainer = document.querySelector('#user-list .scroll-content');
        userListContainer.innerHTML = '';
        otherUsers.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `<img src="${user.profilePic}" alt="${user.username}"><p>${user.username}</p>`;
            
            // Navigate to a profile view page with the selected user's ID as a URL parameter
            userCard.addEventListener('click', () => {
                window.location.href = `view-profile.html?user=${user.id}`;
            });
            userListContainer.appendChild(userCard);
        });
    };
    
    // --- EVENT LISTENERS for horizontal scrolling ---
    document.querySelectorAll('.horizontal-scroll-container').forEach(container => {
        const scrollContent = container.querySelector('.scroll-content');
        const leftArrow = container.querySelector('.left-arrow');
        const rightArrow = container.querySelector('.right-arrow');

        leftArrow.addEventListener('click', () => {
            scrollContent.scrollBy({ left: -300, behavior: 'smooth' });
        });

        rightArrow.addEventListener('click', () => {
            scrollContent.scrollBy({ left: 300, behavior: 'smooth' });
        });
    });

    // --- INITIAL RENDER CALLS ---
    renderThemes();
    renderOtherUsers();
});