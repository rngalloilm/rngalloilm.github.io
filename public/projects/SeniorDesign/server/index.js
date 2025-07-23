const createServer = require('./server'); // Import createServer function

const PORT = 3001;

createServer({ force: true }).then(server => {
  // Use the returned server instance
  server.listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
  });
});