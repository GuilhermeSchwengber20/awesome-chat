const pool = require("../db")

async function getMessages(userId, recipientUserId) {
    const client = await pool.connect();

    try {
        const result = await client.query(
            `
                SELECT * FROM messages
                WHERE (user_id = $1 AND recipient_user_id = $2)
                    OR (user_id = $2 and recipient_user_id = $1)
                ORDER BY timestamp
            `, [userId, recipientUserId]
        );

        return result.rows;
    } catch (error) {
        console.error("Erro ao buscar mensagens: ", error)
    } finally {
        client.release();
    }
}


module.exports = {
    getMessages
}