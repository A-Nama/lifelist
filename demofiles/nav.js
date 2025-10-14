document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidenavMenu = document.getElementById('sidenav-menu');
    const overlay = document.getElementById('overlay');
    const logoutLink = document.getElementById('logout-link');
    const headerProfilePic = document.getElementById('header-profile-pic');

    const openMenu = () => {
        sidenavMenu.classList.add('open');
        overlay.classList.add('visible');
    };

    const closeMenu = () => {
        sidenavMenu.classList.remove('open');
        overlay.classList.remove('visible');
    };

    if(menuToggle) menuToggle.addEventListener('click', openMenu);
    if(overlay) overlay.addEventListener('click', closeMenu);

    if(logoutLink) {
        logoutLink.addEventListener('click', () => {
            // To log out, simply remove the token from storage and redirect
            localStorage.removeItem('idToken');
            window.location.href = 'index.html';
        });
    }
    
    // Set a placeholder for the profile picture in the header
    if (headerProfilePic) {
        headerProfilePic.style.backgroundColor = '#ccc';
    }
});