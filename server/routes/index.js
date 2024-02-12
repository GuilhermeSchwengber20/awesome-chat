const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");

/*---ROTAS DE USUARIO*/
router.get("/api/users", userController.getUsers);
router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);
/*--------*/

/*---ROTAS DE MENSAGENS*/
router.get(
  "/api/messages/:userId/:recipientUserId",
  messageController.getMessages
);
/*--------*/

module.exports = router;
