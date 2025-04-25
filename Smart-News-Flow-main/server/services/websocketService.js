const WebSocket = require('ws');

const users = {};

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const userId = urlParams.get('userId');
    const prompt = urlParams.get('prompt');
    users[userId] = ws;

    console.log(`User ${userId} connected`);
    console.log(`Prompt: ${prompt}`);
    ws.on('message', (message) => {
      console.log(`Received message from user ${userId}: ${message}`);
    });

    ws.on('close', () => {
      delete users[userId];
    });
  });

  wss.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  return wss;
};

module.exports.users = users;
