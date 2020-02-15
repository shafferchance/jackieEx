// Neccessary imports of middleware
const express = require('express');
const path = require('path'); // Needed for getting static files
const bodyParser = require('body-parser');

// Import controllers / configuration
const app = express();
const Main = require('./controllers/main.controller');

// Post ingestion stuff
app.use(bodyParser.json());

// Routes
app.use(express.static(path.resolve('..','client'))); // This is serving the front end (HTML, CSS, JS)
app.use('/', Main);

// Starting server
console.log("Listening on port 5000"); // This is optional
app.listen(5000);