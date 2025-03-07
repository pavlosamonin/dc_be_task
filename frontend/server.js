const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Serve static files like client-side.js
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file with an input field
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Frontend server running at http://localhost:${port}`);
});
