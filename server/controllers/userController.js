const userModel = require("../models/userModel");

async function getUsers(req, res) {
  try {
    const users = await userModel.getUsers();

    res.status(200).send(users);
  } catch (error) {
    console.error("Erro ao obter usuarios:", error);
    res.status(500).send({ error: "Erro interno no servidor" });
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;

  if (!username || username.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "O nome de usuário deve ter pelo menos 3 caracteres!" });
  }

  try {
    const user = await userModel.loginUser(username, password);

    if (!user?.id && user.mensagem) {
      return res.status(400).send({ error: true, mensagem: user.mensagem });
    }

    return res.status(200).send({
      id: user.id,
      username: username,
    });
  } catch (error) {
    console.error(`Erro ao fazer o login de usuario: ${error}`);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}

async function registerUser(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({
      error: true,
      mensagem: "Algum campo não foi enviado, por favor verifique",
    });
  }

  try {
    const userExistis = await userModel.userExistis(username);
    if (userExistis?.id) {
      return res.status(400).send({
        error: true,
        mensagem: "Usuario ja existente",
      });
    }

    const success = await userModel.registerUser(username, email, password);
    if (success) {
      return res.status(201).send({
        error: false,
        mensagem: "Usuario cadastrado com sucesso!",
      });
    }
    return res.status(400).send({
      error: true,
      mensagem: "Erro ao cadastrar o usuário!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Erro interno no servidor" });
  }
}

module.exports = {
  getUsers,
  loginUser,
  registerUser,
};
