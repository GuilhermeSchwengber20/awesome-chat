const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

async function getUsers(req, res) {
    try {
        const users = await userModel.getUsers();
        
        res.status(200).json(users);
    } catch (error) {
        console.error("Erro ao obter usuarios:", error)
        res.status(500).json({ error: "Erro interno no servidor"})
    }
}

async function loginUser(req, res) {
    const { username } = req.body;

    if(!username || username.trim().length < 3) {
        return res.status(400).json({error: "O nome de usuário deve ter pelo menos 3 caracteres!"})
    }

    try {
        const user = await userModel.loginUser(username);
        if(!user) {
            return res.status(404).json({error: "Nenhum usuário encontrado!"})
        }
        return res.status(200).json({
            id: user.id,
            username: username
        })

    } catch (error) {
        console.error(`Erro ao fazer o login de usuario: ${error}`)   
        res.status(500).json({error: "Erro interno no servidor"})
    }
}

module.exports = {
    getUsers,
    loginUser
}