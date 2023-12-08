const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const socketController = require('./controllers/socketController');
const routes = require("./routes")
const pool = require('./db');
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }

})
app.use(cors());


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

    socket.on('disconnect', (data) => {
        socketController.handleDisconnect(io, socket, data, "disconnect");
    });
});

httpServer.listen(PORT, () => {
    console.log(`Seu servidor esta rodando em http://localhost:${PORT}`)
})

