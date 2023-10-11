const http = require('http');
const { handleRequest } = require('./routes');

const server = http.createServer(handleRequest);
const port = 3000;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
