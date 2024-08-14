const WebSocket = require('ws');
const http = require('http');
const express = require('express');

// Create an Express application
const app = express();
app.use(express.json()); // For parsing application/json

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Function to generate a random message
const generateMessage = () => {
  return `Message sent at ${new Date().toISOString()}`;
};

// Handle new WebSocket connections
wss.on('connection', ws => {
  console.log('New client connected');

  // Send a message when the client connects
  ws.send(generateMessage());

  // Handle incoming messages from the client
  ws.on('message', message => {
    console.log(`Received message: ${message}`);
  });

  // Handle connection close
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Define an API endpoint to send a message to all WebSocket clients
app.post('/send-message', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send('Message is required');
  }

  // Broadcast the message to all connected WebSocket clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  res.send('Message sent to all WebSocket clients');
});

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
