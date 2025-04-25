const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);

// Load environment variables from .env file
require('dotenv').config()

// Set the port
const port = process.env.PORT || 3000;

// cors middleware
app.use(cors({
  origin: "*",
}
));

// Middleware
app.use(require('./middlewares/requestParser'));

// Routes
app.use('/', require('./routes/indexRoutes'));

// WebSocket Server
const wss = require('./services/websocketService')(server);

// Start the server
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
