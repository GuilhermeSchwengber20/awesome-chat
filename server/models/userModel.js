const pool = require("../db");

async function getUsers() {
    const client = await pool.connect();

    try {
        const result = await client.query(`
            SELECT * FROM users
        `)
        return result.rows;
    } catch (error) {
        console.error("Erro ao obter os usuários:", error)
        throw error;
    } finally {
        client.release();
    }
}

async function loginUser(username) {
    const client = await pool.connect();
    try {
        const result = await client.query(
            "SELECT * FROM users WHERE username = $1", [username]
        )

        if(result.rows.length === 0) {
            return null;
        }

        return {
            id: result.rows[0].id,
            username: result.rows[0].username
        };
    } catch (error) {
        console.error("Erro ao fazer o login de usuário", error);          
        throw error;
    } finally {
        client.release()
    }

}


module.exports = {
    getUsers,
    loginUser
}