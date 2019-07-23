// Env
require('dotenv').config();

// Utils
const app = require('./src/app');
const http = require('http');

// Variables
const PORT = process.env.SERVER_PORT || 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
	console.info(`Server running on port: ${PORT}`);
});
