const serverUrl = 'https://loacateme.onrender.com'; // Replace with your live server's URL

const responseElement = document.getElementById('response');

// Function to show loading indicator
function showLoading(message) {
    responseElement.textContent = message || 'Loading...';
}

// Function to fetch location repeatedly until success
function fetchLocationUntilSuccess() {
    showLoading('Attempting to fetch location...');

    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        fetch(`${serverUrl}/insert-location`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude, accuracy }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch location data. Status: ${response.status}`);
                }
                return response.text();
            })
            .then((data) => {
                responseElement.textContent = `Location data received: ${data}`;
            })
            .catch((error) => {
                showLoading(`Retrying... Error: ${error.message}`);
                setTimeout(fetchLocationUntilSuccess, 3000); // Retry after 3 seconds
            });
    }, (error) => {
        showLoading(`Error getting location: ${error.message}. Retrying...`);
        setTimeout(fetchLocationUntilSuccess, 3000); // Retry after 3 seconds
    });
}

// Start loading and fetching location on page load
window.addEventListener('load', () => {
    fetchLocationUntilSuccess();
});

// Handle "Get Location and Insert" button click
document.getElementById('get-location').addEventListener('click', fetchLocationUntilSuccess);

// Handle "Ghost Mode" button click
document.getElementById('ghost-mode').addEventListener('click', () => {
    showLoading('Activating Ghost Mode...');
    fetch(`${serverUrl}/ghost-mode`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',}
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Ghost Mode failed. Status: ${response.status}`);
            }
            return response.text();
        })
        .then((data) => {
            responseElement.textContent = data;
        })
        .catch((error) => {
            responseElement.textContent = `Error: ${error.message}`;
        });
});

// Handle "View All Locations" button click
    document.getElementById('view-all').addEventListener('click', () => {
        showLoading('Fetching all locations...');
        fetch(`${serverUrl}/view-all`, {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch locations. Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                responseElement.textContent = JSON.stringify(data, null, 2);
            })
            .catch((error) => {
                responseElement.textContent = `Error: ${error.message}`;
            });
    });
