const pool = require("../db")

async function handleUserConnected(io, socket, data) {
    const { userId, isConnected } = data;

    const client = await pool.connect();

    try {
        await client.query(
            "UPDATE users SET is_connected = $1 WHERE id = $2", [isConnected, userId]
        )

        socket.emit("updateSuccessful");
        console.log(`Status isConnected do usuário ${userId} atualizado para ${isConnected}`);

    } catch (error) {
        console.error('Erro ao atualizar status isConnected do usuário:', error);
    } finally {
        client.release();
    }

}


async function handlePrivateMessage(io, socket, data) {
    const {
        recipientUserId,
        message,
        userId,
        username
    } = data;

    const recipientSocket = Array.from(io.sockets.sockets.values()).find(
        (s) => s.data && s.data.userId === recipientUserId
    );

    const client = await pool.connect();

    console.log("Usuario que enviou:", socket.data.userId);
    console.log("Usuario que recebeu:", recipientUserId);

    try {
        await client.query(
            `
                INSERT INTO messages (
                    user_id, username, content, recipient_user_id
                ) VALUES (
                    $1, $2, $3, $4
                )
            `, [userId, username, message, recipientUserId]
        );
    } finally {
        client.release();
    }

    if (recipientSocket) {
        recipientSocket.emit("private message", {
            senderUserId: socket.data.userId,
            message
        })
    }

}
function handleDisconnect() {
    console.log("Usuario desconectado");
}

module.exports = {
    handlePrivateMessage,
    handleDisconnect,
    handleUserConnected,
}