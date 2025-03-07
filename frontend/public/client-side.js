document.addEventListener("DOMContentLoaded", () => {
    const checkIo = setInterval(() => {
        if (window.io) {
            clearInterval(checkIo);
            // Establish WebSocket connection to the backend
            const socket = io('http://localhost:3000', {
                transports: ['polling', 'websocket'],
                withCredentials: true,
            });
            socket.on("connect", () => console.log("Connected to WebSocket server"));
            // Listen for progress updates
            socket.on('progress', (data) => {
                console.log('Progress update received:', data.message);
                document.getElementById('progress').innerText = data.message;
            });
            // Listen for directory scan event
            socket.on('directoryScanEvent', (data) => {
                console.log('Directory scan event received:', data.message);
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
        .then(response => response.json())
        .then(data => {
            document.getElementById('searchResult').innerText = `Results: ${JSON.stringify(data)}`;
        })
        .catch(error => {
            document.getElementById('searchResult').innerText = 'Error: ' + error;
        });
}
