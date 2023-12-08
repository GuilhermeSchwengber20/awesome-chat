const { json } = require("express");
const pool = require("../db")

async function handleUserConnected(io, socket, data) {
    console.log(data)
    const { userId, isConnected, username } = data;

    const client = await pool.connect();

    socket.data = {userId, username};
    try {
        await client.query(
            "UPDATE users SET is_connected = $1 WHERE id = $2", [isConnected, userId]
        )
        socket.data.userId = userId;
        console.log(socket.data);
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


    const client = await pool.connect();
   
    const recipientSocket = Array.from(io.sockets.sockets.values()).find(
        (s) => s.data && s.data.userId === recipientUserId
    );
    
    console.log("Usuario que enviou:", socket.data.userId);
    console.log("Usuario que recebeu:", recipientUserId);
    if (recipientSocket) {
        recipientSocket.emit('private message', {
            userId,
            recipientUserId,
            username,
            message,
        });
    }
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
    
    // console.log("recipientSocket", recipientSocket);
    // if (recipientSocket) {
    //     recipientSocket.emit("private message", {
    //         recipientUserId,
    //         message
    //     })
    // }

}
function handleDisconnect() {
    console.log("Usuario desconectado");
}

module.exports = {
    handlePrivateMessage,
    handleDisconnect,
    handleUserConnected,
}