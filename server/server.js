const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { SocketAddress } = require('net');


const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3030;

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'awesomechat',
    password: 'postgres',
    port: 5432
});

app.use((req, res, next) => {
    req.pool = pool,
    next();
})

app.use(express.json());

app.get('/api/users', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM users');
        const users = result.rows;
        res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
        client.release();
    }
  });

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    if(!username || username.trim().length < 3) {
        return res.status(400).json({error: 'O nome de usuário deve ter pelo menos 3 caracteres'});
    }

    const userExists = await pool.query(
        'SELECT * FROM users WHERE username = $1', [username]
    );

    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
      }
    

    if(userExists.rows.length > 0) {
        return res.status(400).json({
            error: "Nome de úsuario ja existente!"
        })
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *'
            , [username, hashedPassword]
            );
    
        return res.status(201).json({ id: newUser.rows[0].id, username: newUser.rows[0].username });
    } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
    }
})

app.post('/login', async (req, res) => {
    const { username } = req.body;

    if (!username || username.trim().length < 3) {
      return res.status(400).json({ error: 'O nome de usuário deve ter pelo menos 3 caracteres' });
    }
  
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  
    if (user.rows.length === 0) {
      return res.status(200).json({ error: 'Nenhum usuário encontrado' });
    }
    
    return res.status(200).json({ id: user.rows[0].id, username: user.rows[0].username });
});



// REQUISIÇÕES DE MENSAGENS
app.get('/api/messages/:userId/:recipientUserId', async (req, res) => {
    const { userId, recipientUserId } = req.params;
    const client = await pool.connect();
  
    try {
      const result = await client.query(
        `
          SELECT * FROM messages
          WHERE (user_id = $1 AND recipient_user_id = $2)
             OR (user_id = $2 AND recipient_user_id = $1)
          ORDER BY timestamp;
        `, [userId, recipientUserId]
      );
  
      const messages = result.rows;
      res.status(200).json(messages);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
      client.release();
    }
  });

io.on('connection', (socket) => {
    socket.on('login', (userInfo) => {
        const { userId, username } = userInfo;
    
        socket.data = { userId, username };
    });

    socket.on("private message", async (data) => {
        const {recipientUserId, message } = data;
        const { username } = socket.data;

        const recipientSocket = Array.from(io.sockets.sockets.values()).find(
            (s) => s.data && s.data.userId === recipientUserId
        );

        const client = await pool.connect();
        console.log("usuario que mandou", socket.data.userId);
        console.log("usuario que recebeu", recipientUserId);
        


        try {
            await client.query(
                `
                    INSERT INTO messages (
                        user_id, username, content, recipient_user_id
                    ) VALUES (
                        $1, $2, $3, $4
                    )
               
                `, [socket.data.userId, username, message, recipientUserId]
            );
        } finally {
            client.release();
        }

        if (recipientSocket) {
            recipientSocket.emit('private message', {
              senderUserId: socket.data.userId,
              message,
            });
        }
    })


    socket.on('disconnect', () => {
        console.log('Usuario desconectado', socket.id);
    });

});

server.listen(PORT, () => {
    console.log(`Seu servidor esta rodando em http://localhost:${PORT}`)
})

