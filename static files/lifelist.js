// Replace this with your actual hosted FastAPI backend URL
const API_BASE_URL = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');

    // If no token, redirect to signin page (protected route)
    if (!token) {
        window.location.href = 'signin.html';
        return;
    }

    fetchLifelistItems(token);
});

async function fetchLifelistItems(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/lifelist/items`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // If token is invalid/expired, redirect to signin
            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                window.location.href = 'signin.html';
            }
            throw new Error('Failed to fetch items');
        }

        const items = await response.json();
        displayItems(items);

    } catch (error) {
        console.error('Error fetching lifelist items:', error);
    }
}

function displayItems(items) {
    const container = document.getElementById('lifelist-items-container');
    container.innerHTML = ''; // Clear any existing content

    // For demo purposes, if the backend returns nothing, show some sample data
    if (items.length === 0) {
        items = [
            { id: 1, text: "I wanna watch 'Vettam' in theatre", completed: true },
            { id: 2, text: "I wanna have that YJHD trip with my school friends", completed: false },
            { id: 3, text: "I wanna learn how make perfect Kerala Poratta", completed: true },
            { id: 4, text: "I wanna go to an amusement park and do all the crazy rides", completed: false },
        ];
    }


    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'lifelist-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `item-${item.id}`;
        checkbox.checked = item.completed;

        const label = document.createElement('label');
        label.htmlFor = `item-${item.id}`;
        label.textContent = item.text;

        li.appendChild(checkbox);
        li.appendChild(label);
        container.appendChild(li);
    });
}