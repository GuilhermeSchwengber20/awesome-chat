const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const socketController = require("./controllers/socketController");
const routes = require("./routes");
const pool = require("./db");
const cors = require("cors");
require("dotenv").config();

const app = express();
const frontEndURL =
  process.env.MODE === "development"
    ? process.env.FRONTEND_URL_DEV
    : process.env.FRONTEND_URL;
const backendURL =
  process.env.MODE === "development"
    ? process.env.BACKEND_URL_DEV
    : process.env.BACKEND_URL;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: frontEndURL,
  },
});

const corsOptions = {
  origin: frontEndURL,
  methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3030;

app.use((req, res, next) => {
  (req.pool = pool), next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", frontEndURL);
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());

app.use("/", routes);

io.on("connection", (socket) => {
  socket.on("userLoged", (data) => {
    socketController.handleUserConnected(io, socket, data);
  });

  socket.on("private message", (data) => {
    socketController.handlePrivateMessage(io, socket, data);
  });

  socket.on("disconnect", (data) => {
    socketController.handleDisconnect(io, socket, data, "disconnect");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Seu servidor esta rodando em [${backendURL}]`);
  console.log(`Seu client esta rodando em [${frontEndURL}]`);
});
