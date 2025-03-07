document.addEventListener("DOMContentLoaded", () => {
    const checkIo = setInterval(() => {
        if (window.io) {
            clearInterval(checkIo);
            // Establish WebSocket connection to the backend
            const socket = io('http://localhost:3000', {
                transports: ['polling', 'websocket'], // Ensure these transports are allowed
                withCredentials: true, // If you need to send credentials (cookies), enable this
            });
            socket.on("connect", () => console.log("Connected to WebSocket server"));
            // Listen for progress updates
            socket.on('progress', (data) => {
                console.log('Progress update received:', data.message);
                document.getElementById('progress').innerText = data.message; // Show progress on the page
            });
            // Listen for directory scan event
            socket.on('directoryScanEvent', (data) => {
                console.log('Directory scan event received:', data.message);
                // Optionally update the UI here to reflect that a directory scan has started
            });
        }
    }, 100);
});

// Function to handle the search operation
function performSearch() {
    const searchText = document.getElementById('searchInput').value;

    if (!searchText) {
        alert('Please enter a search text.');
        return;
    }

    fetch(`http://localhost:3000/search?text=${encodeURIComponent(searchText)}`)
        .then(response => response.json()) // Assuming your backend returns JSON
        .then(data => {
            document.getElementById('searchResult').innerText = `Results: ${JSON.stringify(data)}`;
        })
        .catch(error => {
            document.getElementById('searchResult').innerText = 'Error: ' + error;
        });
}
