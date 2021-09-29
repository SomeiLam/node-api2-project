const server = require('./api/server');

const PORT = 4000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
