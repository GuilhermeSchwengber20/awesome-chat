const pool = require("../db");
const bcrypt = require("bcrypt");

async function getUsers() {
  const client = await pool.connect();

  try {
    const result = await client.query(`
            SELECT * FROM users
        `);
    return result.rows;
  } catch (error) {
    console.error("Erro ao obter os usuários:", error);
    throw error;
  } finally {
    client.release();
  }
}

async function userExistis(username) {
  const client = await pool.connect();
  try {
    const userExistsQuery = "SELECT * FROM users WHERE username = $1";
    const userExistsResult = await client.query(userExistsQuery, [username]);
    if (userExistsResult.rows.length > 0) {
      return {
        username: userExistsResult.rows[0].username,
        id: userExistsResult.rows[0].id,
      };
    }
    return null;
  } catch (error) {
    console.error("Erro ao consultar usuario existente", error);
    throw error;
  } finally {
    client.release();
  }
}

async function loginUser(username, password) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      return {
        error: false,
        mensagem: "Usuário não encontrado!",
      };
    } else {
      return {
        username: result.rows[0].username,
      };
    }
  } catch (error) {
    console.error("Erro ao fazer o login de usuário", error);
    throw error;
  } finally {
    client.release();
  }
}

async function registerUser(username, email, password) {
  const client = await pool.connect();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(
      `INSERT INTO users(username, email, password) VALUES($1, $2, $3)`,
      [username, email, hashedPassword]
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    client.release();
  }
}

module.exports = {
  getUsers,
  loginUser,
  registerUser,
  userExistis,
};
