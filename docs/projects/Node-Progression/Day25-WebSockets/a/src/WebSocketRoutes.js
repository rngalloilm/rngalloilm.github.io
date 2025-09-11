const express = require('express');
const websocketRouter = express.Router();

// Store chat messages
const messages = [];

// Store connected clients
const clients = new Set();

// Helper function to send structured data
function sendPacket(ws, label, data) {
  const packet = {
    label: label,
    data: data
  };
  ws.send(JSON.stringify(packet));
}

// WebSocket route
websocketRouter.ws('/ws', (ws, req) => {
  console.log('New client connected');
  clients.add(ws);

  // Send existing messages to new client
  sendPacket(ws, 'init', messages);

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  // Handle incoming messages
  ws.on('message', (msg) => {
    try {
      const packet = JSON.parse(msg);
      
      switch (packet.label) {
        case 'chat':
          // Add new message to history
          messages.push(packet.data);
          
          // Broadcast to all other clients
          clients.forEach(client => {
            if (client !== ws && client.readyState === ws.OPEN) {
              sendPacket(client, 'chat', packet.data);
            }
          });
          break;
          
        default:
          console.log('Unknown message type:', packet.label);
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });
});

module.exports = websocketRouter;