const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const pool = require('./db');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const routes = require("./routes")
const socketController = require('./controllers/socketController');
app.use(cors());
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3030;

app.use((req, res, next) => {
    req.pool = pool,
    next();
})

app.use(express.json());

app.use('/', routes);

io.on('connection', (socket) => {
    socket.on("userLoged", (data) => {
        socketController.handleUserConnected(io, socket, data);
    })

    socket.on("private message", (data) => {
        socketController.handlePrivateMessage(io, socket, data);
    });

    socket.on('disconnect', () => {
        socketController.handleDisconnect(socket);
    });
});

server.listen(PORT, () => {
    console.log(`Seu servidor esta rodando em http://localhost:${PORT}`)
})

