const messageModel = require("../models/messageModel");

async function getMessages(req, res) {
    const { userId, recipientUserId } = req.params;

    try {
        const messages = await messageModel.getMessages(userId, recipientUserId)
        res.status(200).json(messages)
    } catch (error) {
        console.error("Erro ao buscar mensagens:", error)
        res.status(500).json({ error: "Erro interno no servidor"})
    }
}

module.exports = {
    getMessages
}