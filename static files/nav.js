// nav.js
document.addEventListener('DOMContentLoaded', () => {
    // Get all the necessary elements
    const menuToggle = document.getElementById('menu-toggle');
    const sidenavMenu = document.getElementById('sidenav-menu');
    const overlay = document.getElementById('overlay');
    const logoutLink = document.getElementById('logout-link');

    // Function to open the menu
    const openMenu = () => {
        sidenavMenu.classList.add('open');
        overlay.classList.add('visible');
    };

    // Function to close the menu
    const closeMenu = () => {
        sidenavMenu.classList.remove('open');
        overlay.classList.remove('visible');
    };

    // Event Listeners
    menuToggle.addEventListener('click', openMenu); // Open menu when hamburger is clicked
    overlay.addEventListener('click', closeMenu); // Close menu when overlay is clicked

    logoutLink.addEventListener('click', () => {
        // --- API CALL PLACEHOLDER (Cognito Sign Out) ---
        alert('(API Placeholder) Logging out...');
        window.location.href = 'index.html';
    });
    
    // --- Initialize the header profile picture ---
    // In a real app, this would come from your auth service
    const currentUserProfilePic = "https://images.unsplash.com/photo-1509233632946-334a5218145a?q=80&w=1974";
    const headerProfilePic = document.getElementById('header-profile-pic');
    if (headerProfilePic) {
        headerProfilePic.style.backgroundImage = `url('${currentUserProfilePic}')`;
    }
});